import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
    static register = async (req: Request, res: Response) => {
        try {
            const { email, password, firstName, lastName } = req.body;

            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
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

            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: "Error creating user" });
        }
    };

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = await userRepository.findOne({ 
                where: { email },
                relations: ['roles'] 
            });

            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user.id, roles: user.roles.map(r => r.name) },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: "Error during login" });
        }
    };
}