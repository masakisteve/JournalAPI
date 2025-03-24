import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { Journal } from '../models/Journal';

const journalRepository = AppDataSource.getRepository(Journal);

export const getAllJournals = async (req: Request, res: Response) => {
    try {
        const journals = await journalRepository.find();
        res.json(journals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching journals" });
    }
};

export const getJournal = async (req: Request, res: Response) => {
    try {
        const journal = await journalRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!journal) return res.status(404).json({ message: "Journal not found" });
        res.json(journal);
    } catch (error) {
        res.status(500).json({ message: "Error fetching journal" });
    }
};

// Add other controller methods similarly