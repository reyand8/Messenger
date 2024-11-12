import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { badRequest, internal } from '../error/ApiError';
import { User } from '../models/User';

dotenv.config();

/**
 * Generates a JSON Web Token (JWT) for a user.
 *
 * This function generates a JWT that includes the user's ID, email, and username,
 * and is signed with a secret key.
 *
 * @param id - The user's ID.
 * @param email - The user's email.
 * @param username - The user's username.
 * @returns A signed JWT token as a string.
 */
const generateJwt = (id: number, email: string, username: string): string => {
    return jwt.sign(
        { id, email, username },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
};

/**
 * Handles user registration by validating input, checking if the user already exists,
 * hashing the password, and creating a new user in the database.
 *
 * If the registration is successful, it generates a JWT for the new user and returns it.
 *
 * @param req - The request object containing the user's email, username, and password.
 * @param res - The response object to send the generated token as a JSON response.
 * @param next - The next middleware function to handle errors.
 * @returns A response containing the JWT token or an error message.
 */
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

/**
 * Handles user login by checking if the provided email exists, validating the password,
 * and generating a JWT token if the login is successful.
 *
 * @param req - The request object containing the user's email and password.
 * @param res - The response object to send the generated token as a JSON response.
 * @param next - The next middleware function to handle errors.
 * @returns A response containing the JWT token or an error message.
 */
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

/**
 * Verifies the provided JWT token by decoding it and checking if the user exists in the database.
 *
 * If the token is valid, the function returns the user's information. Otherwise, it sends an error response.
 *
 * @param req - The request object containing the JWT token.
 * @param res - The response object to send the user's information or an error message.
 * @param next - The next middleware function to handle errors.
 * @returns A response containing the user's information or an error message.
 */
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