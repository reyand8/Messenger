import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import {IUserPayload} from "../types/user.interface";


declare module 'express-serve-static-core' {
    interface Request {
        user?: IUserPayload;
    }
}

/**
 * Middleware to authenticate the user by verifying the JWT token.
 *
 * This middleware checks if the incoming request contains a valid JWT token in the
 * `Authorization` header. If the token is valid, it decodes the token and attaches
 * the decoded user payload to the `req.user` object. If the token is missing or invalid,
 * it sends a 401 status code with an error message.
 *
 * @param {Request} req - The request object, which may include a JWT token in the `Authorization` header.
 * @param {Response} res - The response object used to send the authentication result.
 * @param {NextFunction} next - The next middleware function to be executed if authentication is successful.
 *
 * @returns {void}
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token: string | undefined = req.headers.authorization?.split(' ')[1]
        if (!token) {
            console.error(res.status(401).json({message: "The user was not auth"}))
        } else{
            const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as unknown;
            req.user = decoded as IUserPayload
            next()
        }
    } catch (e) {
        res.status(401).json({message: "The user was not auth"})
    }
};