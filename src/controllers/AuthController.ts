import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export class AuthController {
    private static getUserRepository() {
        return AppDataSource.getRepository(User);
    }

    static register = async (req: Request, res: Response) => {
        try {
            // Log the incoming request
            logger.info('Registration attempt', {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                // Don't log the password!
            });

            const { email, password, firstName, lastName } = req.body;

            // Validate required fields
            if (!email || !password || !firstName || !lastName) {
                logger.warn('Registration failed - Missing required fields', {
                    missingFields: {
                        email: !email,
                        password: !password,
                        firstName: !firstName,
                        lastName: !lastName
                    }
                });
                return res.status(400).json({
                    message: "Missing required fields",
                    details: {
                        email: !email ? "Email is required" : undefined,
                        password: !password ? "Password is required" : undefined,
                        firstName: !firstName ? "First name is required" : undefined,
                        lastName: !lastName ? "Last name is required" : undefined
                    }
                });
            }

            const userRepository = this.getUserRepository();

            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                logger.warn('Registration failed - Email already exists', { email });
                return res.status(400).json({ message: "User already exists" });
            }

            const user = userRepository.create({
                email,
                password,
                firstName,
                lastName
            });

            await userRepository.save(user);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            logger.info('User registered successfully', { userId: user.id, email });
            res.status(201).json({ token });
        } catch (error) {
            logger.error('Registration error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            res.status(500).json({ message: "Error creating user" });
        }
    };

    static login = async (req: Request, res: Response) => {
        try {
            logger.info('Login attempt', { email: req.body.email });

            const { email, password } = req.body;

            if (!email || !password) {
                logger.warn('Login failed - Missing credentials');
                return res.status(400).json({ message: "Email and password are required" });
            }

            const userRepository = this.getUserRepository();

            const user = await userRepository.findOne({ 
                where: { email },
                relations: ['roles'] 
            });

            if (!user || !await bcrypt.compare(password, user.password)) {
                logger.warn('Login failed - Invalid credentials', { email });
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user.id, roles: user.roles.map(r => r.name) },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            logger.info('User logged in successfully', { userId: user.id, email });
            res.json({ token });
        } catch (error) {
            logger.error('Login error', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            res.status(500).json({ message: "Error during login" });
        }
    };
}