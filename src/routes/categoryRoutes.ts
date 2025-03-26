import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

router.use(authMiddleware);

const categoryValidation = [
    body('name').notEmpty().withMessage('Category name is required'),
    body('description').optional()
];

router.post('/', categoryValidation, validate, async (req, res, next) => {
    try {
        await CategoryController.create(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await CategoryController.getUserCategories(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;