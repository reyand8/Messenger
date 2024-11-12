import { Op } from 'sequelize';
import { Request, Response } from 'express';

import { Message, User } from '../models/User';


export const getMessages = async (req: Request, res: Response) => {
    try {
        const { receiverId, senderId } = req.params;

        const messages: Message[] = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'receiver', attributes: ['id', 'username', 'email'] }
            ],
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Get messages error', error });
    }
};


export const createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { receiverId, senderId, text } = req.body;
        const message = await Message.create({ senderId, receiverId, text });
        res.json(message);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Create message error', error });
    }
};


export const editMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            res.status(400).json({ message: 'Text is required' });
            return;
        }

        const message = await Message.findByPk(id);
        if (!message) {
            res.status(404).json({ message: 'Message was not found' });
            return;
        }
        message.text = text;

        await message.save();

        res.json({ message: 'Your message was updated', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Edit message error', error });
    }
};


export const deleteMessage = async (req: Request, res: Response): Promise<void>  => {
    try {
        const { id } = req.params;
        const message: Message | null = await Message.findByPk(id);

        if (!message) {
            res.status(404).json({ message: 'Message was not found' });
        } else {
            await message?.destroy();
            res.json({ message: 'Your message was deleted' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Delete message error', error });
    }
};


export const uploadFiles = async (req: Request, res: Response) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
             res.status(400).json({ message: 'No files uploaded' });
        }
        const { senderId, receiverId, text } = req.body;
        const files = req.files as Express.Multer.File[];
        const imagePaths = files.map(file => file.path);

        const message: Message = await Message.create({
            senderId,
            receiverId,
            text,
            imagePaths
        });
        res.json({ ...message.toJSON(), imagePaths });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload images error', error });
    }
};