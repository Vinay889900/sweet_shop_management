import { Router } from 'express';
import { checkout } from '../controllers/cartController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/checkout', authenticateToken, checkout);

export default router;
