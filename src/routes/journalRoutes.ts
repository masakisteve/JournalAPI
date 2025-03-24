import { Router } from 'express';
import { JournalController } from '../controllers/journalController';
import { authMiddleware } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';

const router = Router();

router.use(authMiddleware); // Protect all journal routes

router.get('/', JournalController.getEntries);
router.post('/', JournalController.createEntry);
router.get('/summary', JournalController.getSummary);

// Admin only route example
router.delete('/:id', checkRole(['admin']), JournalController.deleteEntry);

export default router;