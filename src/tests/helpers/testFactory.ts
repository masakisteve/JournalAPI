import { User } from '../../models/User';
import { JournalEntry } from '../../models/JournalEntry';
import { AppDataSource } from '../../data-source';
import * as jwt from 'jsonwebtoken';

export const createTestUser = async () => {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
    });
    return await userRepository.save(user);
};

export const createTestEntry = async (user: User) => {
    const entryRepository = AppDataSource.getRepository(JournalEntry);
    const entry = entryRepository.create({
        title: 'Test Entry',
        content: 'Test content',
        user,
        wordCount: 2,
        entryDate: new Date()
    });
    return await entryRepository.save(entry);
};

export const generateToken = (user: User) => {
    return jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
};