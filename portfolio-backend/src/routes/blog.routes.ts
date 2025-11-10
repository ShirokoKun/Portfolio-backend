import { Router } from 'express';
import { getPosts, getPostBySlug, clearCache } from '../controllers/blog.controller';

const router = Router();

// GET /api/blog/posts - Fetch all posts
router.get('/posts', getPosts);

// GET /api/blog/post/:slug - Fetch single post by slug
router.get('/post/:slug', getPostBySlug);

// POST /api/blog/cache/clear - Clear cache (admin)
router.post('/cache/clear', clearCache);

export default router;
