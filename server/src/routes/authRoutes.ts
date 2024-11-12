import express, { Request, Response, NextFunction } from 'express';

import {login, register, verifyToken} from "../controllers/authController";


const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await register(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await login(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post('/verifyToken', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await verifyToken(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;