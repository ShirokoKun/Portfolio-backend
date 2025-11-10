import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const validateContactForm = (req: Request, _res: Response, next: NextFunction) => {
  try {
    contactFormSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ApiError(400, `Validation error: ${errors.map(e => e.message).join(', ')}`);
    }
    next(error);
  }
};
