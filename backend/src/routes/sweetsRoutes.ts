import { Router } from 'express';
import { addSweet, getSweets, searchSweets, updateSweet, deleteSweet, purchaseSweet, restockSweet } from '../controllers/sweetsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.post('/', authenticateToken, addSweet);
router.get('/', getSweets); // Public for debugging
router.get('/search', authenticateToken, searchSweets);
router.put('/:id', authenticateToken, updateSweet);
router.delete('/:id', authenticateToken, deleteSweet);
router.post('/:id/purchase', authenticateToken, purchaseSweet);
router.post('/:id/restock', authenticateToken, restockSweet);

export default router;
