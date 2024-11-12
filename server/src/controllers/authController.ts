import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { badRequest, internal } from '../error/ApiError';
import { User } from '../models/User';

dotenv.config();


const generateJwt = (id: number, email: string, username: string): string => {
    return jwt.sign(
        { id, email, username },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return next(badRequest('Your data is not correct'));
    }
    try {
        const findEmail: User | null = await User.findOne({ where: { email } });
        if (findEmail) {
            return next(badRequest('The user with this email already exists'));
        }
        const findUsername: User | null = await User.findOne({ where: { username } });
        if (findUsername) {
            return next(badRequest('The user with this username already exists'));
        }

        const hashPassword: string = await bcrypt.hash(password, 5);
        const user: User = await User.create({ email, username, password: hashPassword });

        const token = generateJwt(user.id, user.email, user.username);
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email, password } = req.body;
    try {
        const user: User | null = await User.findOne({ where: { email } });
        if (!user) {
            return next(internal('The user was not found'));
        }
        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(internal('Incorrect password'));
        }
        const token: string = generateJwt(user.id, user.email, user.username);
        return res.json({ token });
    } catch (error) {
        return next(error);
    }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { token } = req.body;
    if (!token) {
        return next(badRequest('The token is empty'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        const user: User | null = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return next(badRequest('The user was not found'));
        }
        return res.json({ id: user.id, email: user.email, username: user.username });
    } catch (error) {
        return next(badRequest('Invalid token'));
    }
};