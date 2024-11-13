import { Request, Response } from 'express';

import { User } from '../models/User';

/**
 * Fetches a list of users.
 *
 * This function retrieves a list of all users from the database, including only their
 * `id` and `username` attributes. It returns the list of users in the response in JSON format.
 *
 * @param {Request} req - The request object. No parameters are required for this endpoint.
 * @param {Response} res - The response object used to send back the list of users.
 * @returns {Promise<Response>} A JSON response containing the list of users.
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users: User[] = await User.findAll({
            attributes: ['id', 'username'],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Get users error', error });
    }
};