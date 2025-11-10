import { Router } from 'express';
import { submitContactForm, testConnection } from '../controllers/contact.controller';
import { validateContactForm } from '../middlewares/validation.middleware';
import { contactRateLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

// POST /api/contact - Submit contact form (with rate limiting and validation)
router.post('/', contactRateLimiter, validateContactForm, submitContactForm);

// GET /api/contact/test - Test Google Sheets connection
router.get('/test', testConnection);

export default router;
