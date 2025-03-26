import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { JournalEntry } from '../models/JournalEntry';
import { Between, Like, DeepPartial } from 'typeorm';
import logger from '../utils/logger';

export class JournalController {
    private static getJournalRepository() {
        return AppDataSource.getRepository(JournalEntry);
    }

    static async createEntry(req: Request, res: Response) {
        try {
            const { title, content, categoryId, tags, mood } = req.body;
            const userId = (req as any).user.userId;
            const repository = this.getJournalRepository();

            // Create the entry with proper typing
            const entryData: DeepPartial<JournalEntry> = {
                title,
                content,
                mood,
                wordCount: content.split(/\s+/).length,
                entryDate: new Date(),
                user: { id: userId },
                category: categoryId ? { id: categoryId } : undefined,  // Change null to undefined
                tags: tags?.map((id: number) => ({ id }))
            };

            const entry = repository.create(entryData);
            await repository.save(entry);
            
            logger.info('Journal entry created', { entryId: entry.id, userId });
            res.status(201).json(entry);
        } catch (error) {
            logger.error('Error creating journal entry', { error });
            res.status(500).json({ message: "Error creating entry" });
        }
    }

    static async getEntries(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { 
                category,
                startDate,
                endDate,
                search,
                mood,
            } = req.query;
    
            // Parse pagination parameters with defaults
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
    
            const repository = this.getJournalRepository();
            const queryBuilder = repository.createQueryBuilder('entry')
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
    
            if (search) {
                queryBuilder.andWhere(
                    '(entry.title LIKE :search OR entry.content LIKE :search)',
                    { search: `%${search}%` }
                );
            }
    
            if (mood) {
                queryBuilder.andWhere('entry.mood = :mood', { mood });
            }
    
            const [entries, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
    
            res.json({
                entries,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            logger.error('Error fetching entries', { error });
            res.status(500).json({ message: "Error fetching entries" });
        }
    }

    static async getSummary(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const { timeframe = 'month' } = req.query;
            const repository = this.getJournalRepository();

            // Entry count by category
            const categoryStats = await repository
                .createQueryBuilder('entry')
                .select('category.name', 'category')
                .addSelect('COUNT(*)', 'count')
                .addSelect('SUM(entry.wordCount)', 'totalWords')
                .leftJoin('entry.category', 'category')
                .where('entry.user.id = :userId', { userId })
                .groupBy('category.name')
                .getRawMany();

            // Word count trends
            const wordCountTrend = await repository
                .createQueryBuilder('entry')
                .select('DATE(entry.entryDate)', 'date')
                .addSelect('SUM(entry.wordCount)', 'totalWords')
                .where('entry.user.id = :userId', { userId })
                .groupBy('DATE(entry.entryDate)')
                .orderBy('date', 'DESC')
                .limit(30)
                .getRawMany();

            // Mood distribution
            const moodStats = await repository
                .createQueryBuilder('entry')
                .select('entry.mood', 'mood')
                .addSelect('COUNT(*)', 'count')
                .where('entry.user.id = :userId', { userId })
                .andWhere('entry.mood IS NOT NULL')
                .groupBy('entry.mood')
                .getRawMany();

            res.json({
                categoryStats,
                wordCountTrend,
                moodStats,
                totalEntries: await repository.count({
                    where: { user: { id: userId } }
                })
            });
        } catch (error) {
            logger.error('Error generating summary', { error });
            res.status(500).json({ message: "Error generating summary" });
        }
    }

    static async updateEntry(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            const { title, content, categoryId, tags, mood } = req.body;
            const repository = this.getJournalRepository();

            const entry = await repository.findOne({
                where: { id, user: { id: userId } },
                relations: ['tags']
            });

            if (!entry) {
                return res.status(404).json({ message: "Entry not found" });
            }

            Object.assign(entry, {
                title,
                content,
                mood,
                wordCount: content.split(/\s+/).length,
                category: categoryId ? { id: categoryId } : null,
                tags: tags?.map((id: number) => ({ id }))
            });

            await repository.save(entry);
            logger.info('Journal entry updated', { entryId: entry.id, userId });
            res.json(entry);
        } catch (error) {
            logger.error('Error updating entry', { error });
            res.status(500).json({ message: "Error updating entry" });
        }
    }

    static async deleteEntry(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            const repository = this.getJournalRepository();

            const entry = await repository.findOne({
                where: { id, user: { id: userId } }
            });

            if (!entry) {
                return res.status(404).json({ message: "Entry not found" });
            }

            await repository.remove(entry);
            logger.info('Journal entry deleted', { entryId: id, userId });
            res.json({ message: "Entry deleted successfully" });
        } catch (error) {
            logger.error('Error deleting entry', { error });
            res.status(500).json({ message: "Error deleting entry" });
        }
    }
}