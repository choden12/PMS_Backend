import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/login', AuthController.login);

// Protected routes (require authentication)
router.post('/logout', authenticateToken, AuthController.logout as unknown as import('express').RequestHandler);
router.get(
  '/verify',
  authenticateToken,
  AuthController.verify as unknown as import('express').RequestHandler
);

export default router;