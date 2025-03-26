import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post(
    '/register', 
    registerValidation, 
    validate, 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await AuthController.register(req, res);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/login', 
    loginValidation, 
    validate, 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await AuthController.login(req, res);
        } catch (error) {
            next(error);
        }
    }
);

export default router;