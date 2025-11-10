# Frontend Integration Guide

This guide shows how to connect your portfolio website to the new backend API.

## 📝 Step 1: Add Environment Variable

Create or update `.env.local` in your portfolio website root:

```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

**For production (Vercel):**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add: `NEXT_PUBLIC_API_URL` with your backend URL
4. Redeploy

## 🔧 Step 2: Create API Client

Create `lib/api-client.ts`:

```typescript
// lib/api-client.ts
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

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Blog API
  async getBlogPosts(forceRefresh = false): Promise<{ posts: BlogPost[]; cached: boolean }> {
    const query = forceRefresh ? '?refresh=true' : '';
    return this.request(`/api/blog/posts${query}`);
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.request(`/api/blog/post/${slug}`);
  }

  // Contact API
  async submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
```

## 🔄 Step 3: Update SubstackBlog Component

Replace the fetch logic in `components/SubstackBlog.tsx`:

```typescript
// components/SubstackBlog.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient, BlogPost } from '@/lib/api-client';
import PostSkeleton from './ui/PostSkeleton';

export default function SubstackBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts } = await apiClient.getBlogPosts();
        setPosts(posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="glass-card p-6">
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Read More →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
```

## 📧 Step 4: Update Contact Component

Replace the submit logic in `components/Contact.tsx`:

```typescript
// components/Contact.tsx
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await apiClient.submitContact(formData);
      setStatus('success');
      setMessage(response.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      {/* ... other fields ... */}

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      {status !== 'idle' && (
        <div className={status === 'success' ? 'text-green-400' : 'text-red-400'}>
          {message}
        </div>
      )}
    </form>
  );
}
```

## 🗑️ Step 5: Clean Up Old API Routes (Optional)

You can now remove these files since the backend handles them:
- `app/api/substack/route.ts`
- `app/api/contact/route.ts`

Or keep them as fallbacks if the backend is down.

## ✅ Step 6: Test Locally

1. Start your backend:
```bash
cd portfolio-backend
npm run dev
```

2. Update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Start your frontend:
```bash
cd portfolio-website
npm run dev
```

4. Test on `http://localhost:3000`

## 🚀 Step 7: Deploy

1. Deploy backend to Railway/Render (see DEPLOYMENT.md)
2. Get backend URL (e.g., `https://your-app.up.railway.app`)
3. Update Vercel environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
   ```
4. Redeploy frontend
5. Test live site!

## 🔍 Debugging

### Check if backend is accessible:
```bash
curl https://your-backend.com/health
```

### Check browser console for CORS errors:
- Make sure frontend URL is in backend's `ALLOWED_ORIGINS`

### Check network tab:
- Look for failed requests
- Check response status codes
- Verify request URLs

## 📊 Monitoring

### Backend logs:
- **Railway**: Project → Deployments → View Logs
- **Render**: Dashboard → Logs

### Frontend (Vercel):
- Project → Deployments → Functions

## 🎉 Done!

Your portfolio now uses a separate backend API that you can:
- Deploy independently
- Scale separately
- Monitor individually
- Update without touching frontend

**Benefits:**
- ✅ Better separation of concerns
- ✅ Can deploy backend to different platforms
- ✅ Easier to add new endpoints
- ✅ Better caching control
- ✅ Independent scaling
