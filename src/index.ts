import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import journalRoutes from './routes/journalRoutes';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/journals', journalRoutes);

// Database configuration
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "journal_db",
  entities: ["src/models/*.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: true,
});

// Initialize DB connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Error connecting to database:", error));