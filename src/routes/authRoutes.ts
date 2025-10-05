import { Router } from 'express';
import { AuthController } from '../controllers/authController'; // ✅ Use correct case
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes (no authentication needed)
router.post('/login', AuthController.login);

// // Protected routes (require valid JWT token)
// router.post('/logout', authenticateToken, AuthController.logout);
// router.get('/verify', authenticateToken, AuthController.verify);

export default router;
