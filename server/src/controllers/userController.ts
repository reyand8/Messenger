import { Request, Response } from 'express';

import { User } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await User.findAll({
            attributes: ['id', 'username'],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Get users error', error });
    }
};