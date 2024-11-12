import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import {IUserPayload} from "../types/user.interface";


declare module 'express-serve-static-core' {
    interface Request {
        user?: IUserPayload;
    }
}

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