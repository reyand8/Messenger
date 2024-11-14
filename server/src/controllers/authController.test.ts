import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { register, login, verifyToken } from './authController';
import { User } from '../models/User';
import { badRequest, internal } from '../error/ApiError';

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('authController', (): void => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach((): void => {
        req = {
            body: {},
        };
        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    afterEach((): void => {
        jest.clearAllMocks();
    });


    describe('register', (): void => {

        it('should return 400 if user data is missing', async (): Promise<void> => {
            req.body = { email: 'test@test.com', username: '' };
            await register(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(badRequest('Your data is not correct'));
        });

        it('should return 400 if user with this email already exists', async (): Promise<void> => {
            req.body = { email: 'test@test.com', username: 'user', password: 'password' };
            (User.findOne as jest.Mock).mockResolvedValue({});

            await register(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(badRequest('The user with this email already exists'));
        });

        it('should return 400 if user with this user already exists', async (): Promise<void> => {
            req.body = { email: 'test@test.com', username: 'user', password: 'password' };
            (User.findOne as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({});

            await register(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(badRequest('The user with this username already exists'));
        });

        it('should create a new user and return a token', async (): Promise<void> => {
            req.body = { email: 'test@test.com', username: 'user', password: 'password' };
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('MyHashedPassword');
            (User.create as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com', username: 'user' });
            (jwt.sign as jest.Mock).mockReturnValue('MyToken');

            await register(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ token: 'MyToken' });
        });
    });


    describe('login', (): void => {
        it('should return error if user does not exist', async (): Promise<void> => {
            req.body = { email: 'test@test.com', password: 'password' };
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await login(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(internal('The user was not found'));
        });

        it('should return error if password is incorrect', async (): Promise<void> => {
            req.body = { email: 'test@test.com', password: 'password' };
            (User.findOne as jest.Mock).mockResolvedValue({ password: 'MyHashedPassword' });
            (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

            await login(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(internal('Incorrect password'));
        });

        it('should return a token if login action is successful', async (): Promise<void> => {
            req.body = { email: 'test@test.com', password: 'password' };
            (User.findOne as jest.Mock).mockResolvedValue({
                id: 1, email: 'test@test.com', username: 'user', password: 'MyHashedPassword' });
            (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('MyToken');

            await login(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ token: 'MyToken' });
        });
    });


    describe('verifyToken', () => {
        it('should return error if token is empty', async (): Promise<void> => {
            req.body = { token: '' };
            await verifyToken(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(badRequest('The token is empty'));
        });

        it('should return 400 if token is invalid', async (): Promise<void> => {
            req.body = { token: 'MyInvalidToken' };
            (jwt.verify as jest.Mock).mockImplementation((): void =>
            { throw new Error('Invalid token'); });

            await verifyToken(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(badRequest('Invalid token'));
        });

        it('should return user data if token is valid', async (): Promise<void> => {
            req.body = { token: 'MyValidToken' };
            (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
            (User.findOne as jest.Mock).mockResolvedValue(
                { id: 1, email: 'test@test.com', username: 'user' });

            await verifyToken(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(
                { id: 1, email: 'test@test.com', username: 'user' });
        });

        it('should return error if user not found', async (): Promise<void> => {
            req.body = { token: 'MyValidToken' };
            (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await verifyToken(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(badRequest('The user was not found'));
        });
    });
});