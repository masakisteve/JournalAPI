import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../models/Category';
import logger from '../utils/logger';

export class CategoryController {
    private static getCategoryRepository() {
        return AppDataSource.getRepository(Category);
    }

    static async create(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const userId = (req as any).user.userId;
            const repository = this.getCategoryRepository();

            const category = repository.create({
                name,
                description,
                user: { id: userId }
            });

            await repository.save(category);
            logger.info('Category created', { categoryId: category.id, userId });
            res.status(201).json(category);
        } catch (error) {
            logger.error('Error creating category', { error });
            res.status(500).json({ message: "Error creating category" });
        }
    }

    static async getUserCategories(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const repository = this.getCategoryRepository();

            const categories = await repository.find({
                where: { user: { id: userId } }
            });

            res.json(categories);
        } catch (error) {
            logger.error('Error fetching categories', { error });
            res.status(500).json({ message: "Error fetching categories" });
        }
    }
}