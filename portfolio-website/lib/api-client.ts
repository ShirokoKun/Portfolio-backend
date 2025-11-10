/**
 * API Client for Portfolio Backend
 * 
 * This client handles all communication with the separate backend API.
 * The backend URL is configured via NEXT_PUBLIC_API_URL environment variable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log('API Client initialized with base URL:', this.baseUrl);
  }

  /**
   * Generic request handler
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}` 
        }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Fetch all blog posts
   * @param forceRefresh - Force cache refresh on backend
   */
  async getBlogPosts(forceRefresh = false): Promise<{ 
    posts: BlogPost[]; 
    cached: boolean;
    count: number;
  }> {
    const query = forceRefresh ? '?refresh=true' : '';
    return this.request(`/api/blog/posts${query}`);
  }

  /**
   * Fetch a single blog post by slug
   * @param slug - URL slug of the post
   */
  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.request(`/api/blog/post/${slug}`);
  }

  /**
   * Submit contact form
   * @param data - Contact form data
   */
  async submitContact(data: ContactFormData): Promise<{ 
    success: boolean; 
    message: string;
  }> {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ 
    status: string;
    timestamp: string;
    uptime: number;
  }> {
    return this.request('/health');
  }

  /**
   * Test if backend is reachable
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export default ApiClient;
