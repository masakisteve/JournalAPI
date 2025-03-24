import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { JournalEntry } from '../models/JournalEntry';
import { User } from '../models/User';

const journalRepository = AppDataSource.getRepository(JournalEntry);

export class JournalController {
    static createEntry = async (req: Request, res: Response) => {
        try {
            const { title, content, categoryId, tags, mood } = req.body;
            const userId = (req as any).user.id; // From auth middleware

            const entry = journalRepository.create({
                title,
                content,
                mood,
                wordCount: content.split(' ').length,
                entryDate: new Date(),
                user: { id: userId },
                category: { id: categoryId },
                tags: tags?.map((id: number) => ({ id }))
            });

            await journalRepository.save(entry);
            res.status(201).json(entry);
        } catch (error) {
            res.status(500).json({ message: "Error creating entry" });
        }
    };

    static getEntries = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { category, startDate, endDate, tags } = req.query;

            let queryBuilder = journalRepository
                .createQueryBuilder('entry')
                .where('entry.user.id = :userId', { userId })
                .leftJoinAndSelect('entry.category', 'category')
                .leftJoinAndSelect('entry.tags', 'tags');

            if (category) {
                queryBuilder.andWhere('category.id = :categoryId', { categoryId: category });
            }

            if (startDate && endDate) {
                queryBuilder.andWhere('entry.entryDate BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate
                });
            }

            if (tags) {
                queryBuilder.andWhere('tags.id IN (:...tagIds)', { tagIds: tags });
            }

            const entries = await queryBuilder
                .orderBy('entry.entryDate', 'DESC')
                .getMany();

            res.json(entries);
        } catch (error) {
            res.status(500).json({ message: "Error fetching entries" });
        }
    };

    static getSummary = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { timeframe } = req.query; // 'week', 'month', 'year'

            // Get entry counts by category
            const categoryCounts = await journalRepository
                .createQueryBuilder('entry')
                .select('category.name', 'category')
                .addSelect('COUNT(*)', 'count')
                .leftJoin('entry.category', 'category')
                .where('entry.user.id = :userId', { userId })
                .groupBy('category.name')
                .getRawMany();

            // Get word count trends
            const wordCountTrend = await journalRepository
                .createQueryBuilder('entry')
                .select('DATE(entry.entryDate)', 'date')
                .addSelect('SUM(entry.wordCount)', 'totalWords')
                .where('entry.user.id = :userId', { userId })
                .groupBy('DATE(entry.entryDate)')
                .orderBy('date', 'DESC')
                .limit(30)
                .getRawMany();

            res.json({
                categoryCounts,
                wordCountTrend,
                // Add more summary data as needed
            });
        } catch (error) {
            res.status(500).json({ message: "Error generating summary" });
        }
    };

    static deleteEntry = async (req: Request, res: Response) => {
        try {
         
        } catch (error) {
            res.status(500).json({ message: "Error generating summary" });
        }
    };

    // Add other methods for update, delete, etc.
}