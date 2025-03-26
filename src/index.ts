import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import journalRoutes from './routes/journalRoutes';
import { User } from './models/User';
import { JournalEntry } from './models/JournalEntry';
import { Category } from './models/Category';
import { Tag } from './models/Tag';
import { Role } from './models/Role';
import { UserPreference } from './models/UserPreference';
import authRoutes from './routes/authRoutes';
import { requestLogger } from './middleware/requestLogger';
import categoryRoutes from './routes/categoryRoutes';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/journals', journalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// Database configuration
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "journal_db",
    entities: [User, JournalEntry, Category, Tag, Role, UserPreference],
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: true,
});

// Initialize DB connection
const initializeApp = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error during initialization:", error);
        process.exit(1);
    }
};

initializeApp();