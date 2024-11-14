import { getUsers } from './userController';
import { User } from '../models/User';
import { Request, Response } from 'express';

jest.mock('../models/User');

describe('User Controller', (): void => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach((): void => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        req = {};
        res = {
            status: statusMock,
            json: jsonMock,
        };

        jest.clearAllMocks();
    });

    describe('getUsers', (): void => {
        it('should return a list of users', async (): Promise<void> => {

            const mockUsers = [
                { id: 1, username: 'user one' },
                { id: 2, username: 'user two' },
            ];
            (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

            await getUsers(req as Request, res as Response);

            expect(User.findAll).toHaveBeenCalledWith({
                attributes: ['id', 'username'],
            });

            expect(jsonMock).toHaveBeenCalledWith(mockUsers);
        });

        it('should return a database error', async (): Promise<void> => {
            const errorMessage = new Error('Database error');
            (User.findAll as jest.Mock).mockRejectedValue(errorMessage);

            await getUsers(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(500);

            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Get users error',
                error: errorMessage,
            });
        });
    });
});
