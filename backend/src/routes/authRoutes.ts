import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.get('/me', authenticateToken as any, getMe as any);

export default router;
