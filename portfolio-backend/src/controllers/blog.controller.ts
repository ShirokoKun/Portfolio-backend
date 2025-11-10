import { Request, Response } from 'express';
import { SubstackService } from '../services/substack.service';

const substackService = new SubstackService();

/**
 * GET /api/blog/posts
 * Fetch all blog posts
 */
export const getPosts = async (req: Request, res: Response) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const { posts, cached } = await substackService.fetchPosts(forceRefresh);

    res.status(200).json({
      posts,
      count: posts.length,
      cached,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }
};

/**
 * GET /api/blog/post/:slug
 * Fetch a single blog post by slug
 */
export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await substackService.fetchPostBySlug(slug);

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  }
};

/**
 * POST /api/blog/cache/clear
 * Clear the blog cache (admin endpoint)
 */
export const clearCache = async (_req: Request, res: Response) => {
  try {
    substackService.clearCache();
    res.status(200).json({ message: 'Cache cleared successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  }
};
