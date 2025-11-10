import Parser from 'rss-parser';
import NodeCache from 'node-cache';
import { ApiError } from '../middlewares/error.middleware';

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  link: string;
  thumbnail?: string;
  tags: string[];
  author?: string;
}

export class SubstackService {
  private parser: Parser;
  private cache: NodeCache;
  private rssUrl: string;
  private cacheTTL: number;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['content:encoded', 'description', 'enclosure'],
      },
    });
    
    // Cache TTL from env or default to 30 minutes
    this.cacheTTL = parseInt(process.env.CACHE_TTL || '1800', 10);
    this.cache = new NodeCache({ stdTTL: this.cacheTTL });
    
    this.rssUrl = process.env.SUBSTACK_RSS_URL || 'https://shirokokun.substack.com/feed';
  }

  /**
   * Fetch all blog posts from Substack RSS feed
   */
  async fetchPosts(forceRefresh = false): Promise<{ posts: BlogPost[]; cached: boolean }> {
    const cacheKey = 'blog:posts';

    // Return cached posts if available and not forcing refresh
    if (!forceRefresh) {
      const cached = this.cache.get<BlogPost[]>(cacheKey);
      if (cached) {
        console.log('✅ Returning cached blog posts');
        return { posts: cached, cached: true };
      }
    }

    try {
      console.log('🔄 Fetching fresh blog posts from Substack...');
      const feed = await this.parser.parseURL(this.rssUrl);

      if (!feed.items || feed.items.length === 0) {
        throw new ApiError(404, 'No posts found in RSS feed');
      }

      const posts: BlogPost[] = feed.items.map((item) => ({
        title: item.title || 'Untitled',
        slug: this.generateSlug(item.title || ''),
        excerpt: this.extractExcerpt(item.contentSnippet || item.content || ''),
        content: (item as any)['content:encoded'] || item.content || '',
        publishedAt: item.isoDate || item.pubDate || '',
        link: item.link || '',
        thumbnail: (item as any).enclosure?.url || this.extractFirstImage(item.content || ''),
        tags: item.categories || [],
        author: item.creator || item.author || '',
      }));

      // Cache the posts
      this.cache.set(cacheKey, posts);
      console.log(`✅ Cached ${posts.length} blog posts`);

      return { posts, cached: false };
    } catch (error) {
      console.error('❌ Error fetching Substack feed:', error);
      
      // Return cached posts if fetch fails
      const cached = this.cache.get<BlogPost[]>(cacheKey);
      if (cached) {
        console.log('⚠️  Using stale cache due to fetch error');
        return { posts: cached, cached: true };
      }

      throw new ApiError(500, 'Failed to fetch blog posts');
    }
  }

  /**
   * Fetch a single blog post by slug
   */
  async fetchPostBySlug(slug: string): Promise<BlogPost> {
    const { posts } = await this.fetchPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      throw new ApiError(404, `Post with slug "${slug}" not found`);
    }

    return post;
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Extract excerpt from content
   */
  private extractExcerpt(content: string, length = 200): string {
    // Strip HTML tags
    const stripped = content.replace(/<[^>]*>/g, '');
    
    // Truncate to desired length
    if (stripped.length <= length) {
      return stripped;
    }

    // Cut at last complete word
    const truncated = stripped.substring(0, length);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  /**
   * Extract first image URL from HTML content
   */
  private extractFirstImage(html: string): string | undefined {
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : undefined;
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.cache.flushAll();
    console.log('🗑️  Cache cleared');
  }
}
