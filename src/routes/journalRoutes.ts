import { Router } from 'express';
import { JournalController } from '../controllers/JournalController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

router.use(authMiddleware);

const entryValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('categoryId').optional().isNumeric(),
    body('tags').optional().isArray(),
    body('mood').optional().isString()
];

router.post('/', entryValidation, validate, async (req, res, next) => {
    try {
        await JournalController.createEntry(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await JournalController.getEntries(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/summary', async (req, res, next) => {
    try {
        await JournalController.getSummary(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', entryValidation, validate, async (req, res, next) => {
    try {
        await JournalController.updateEntry(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await JournalController.deleteEntry(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;