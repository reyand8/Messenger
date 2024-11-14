import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { getMessages, createMessage, editMessage, deleteMessage, uploadFiles } from './messageController';
import { Message, User } from '../models/User';

jest.mock('../models/User');


describe('messageController', (): void => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        req = {};
        res = {
            status: statusMock,
            json: jsonMock
        };

        jest.clearAllMocks();
    });

    describe('getMessages', (): void => {
        it('should return all messages between two users', async () => {
            req.params = { senderId: '1', receiverId: '2' };
            const mockMessages = [{ id: 1, text: 'Hello', senderId: '1', receiverId: '2' }];
            (Message.findAll as jest.Mock).mockResolvedValue(mockMessages);

            await getMessages(req as Request, res as Response);

            expect(Message.findAll).toHaveBeenCalledWith({
                where: {
                    [Op.or]: [
                        { senderId: '1', receiverId: '2' },
                        { senderId: '2', receiverId: '1' }
                    ]
                },
                include: [
                    { model: User, as: 'sender', attributes: ['id', 'username', 'email'] },
                    { model: User, as: 'receiver', attributes: ['id', 'username', 'email'] }
                ],
                order: [['createdAt', 'ASC']]
            });
            expect(jsonMock).toHaveBeenCalledWith(mockMessages);
        });
    });

    describe('createMessage', () => {
        it('should create a new message', async (): Promise<void> => {
            req.body = { senderId: '1', receiverId: '2', text: 'Hello' };
            const mockMessage = { id: 1, text: 'Hello', senderId: '1', receiverId: '2' };
            (Message.create as jest.Mock).mockResolvedValue(mockMessage);

            await createMessage(req as Request, res as Response);

            expect(Message.create).toHaveBeenCalledWith({ senderId: '1', receiverId: '2', text: 'Hello' });
            expect(jsonMock).toHaveBeenCalledWith(mockMessage);
        });
    });

    describe('editMessage', () => {
        it('should edit an existing message', async (): Promise<void> => {
            req.params = { id: '1' };
            req.body = { text: 'New text' };
            const mockMessage = { id: 1, text: 'Hello', save: jest.fn() };
            (Message.findByPk as jest.Mock).mockResolvedValue(mockMessage);

            await editMessage(req as Request, res as Response);

            expect(mockMessage.save).toHaveBeenCalled();
            expect(mockMessage.text).toBe('New text');
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Your message was updated', data: mockMessage });
        });

        it('should return error if message is not found', async (): Promise<void> => {
            req.params = { id: '1' };
            (Message.findByPk as jest.Mock).mockResolvedValue(null);

            await editMessage(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Text is required' });
        });
    });

    describe('deleteMessage', () => {
        it('should delete a message', async (): Promise<void> => {
            req.params = { id: '1' };
            const mockMessage = { id: 1, destroy: jest.fn() };
            (Message.findByPk as jest.Mock).mockResolvedValue(mockMessage);

            await deleteMessage(req as Request, res as Response);

            expect(mockMessage.destroy).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Your message was deleted' });
        });

        it('should return error if message was not found', async (): Promise<void> => {
            req.params = { id: '1' };
            (Message.findByPk as jest.Mock).mockResolvedValue(null);

            await deleteMessage(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Message was not found' });
        });
    });

    describe('uploadFiles', () => {
        it('should upload files', async (): Promise<void> => {
            req.body = { senderId: '1', receiverId: '2', text: 'Hello' };
            req.files = [{ path: 'path/to/image1' }, { path: 'path/to/image2' }] as any;

            const mockMessage = {
                id: 1,
                text: 'Hello',
                imagePaths: ['path/to/image1', 'path/to/image2'],
                toJSON: jest.fn().mockReturnValue({
                    id: 1,
                    text: 'Hello',
                    imagePaths: ['path/to/image1', 'path/to/image2']
                })
            };

            (Message.create as jest.Mock).mockResolvedValue(mockMessage);

            await uploadFiles(req as Request, res as Response);

            expect(Message.create).toHaveBeenCalledWith({
                senderId: '1',
                receiverId: '2',
                text: 'Hello',
                imagePaths: ['path/to/image1', 'path/to/image2']
            });
            expect(jsonMock).toHaveBeenCalledWith({
                id: 1,
                text: 'Hello',
                imagePaths: ['path/to/image1', 'path/to/image2']
            });
        });
    });
});
