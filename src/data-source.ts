import { DataSource } from "typeorm";
import { config } from 'dotenv';

config(); // Load environment variables

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