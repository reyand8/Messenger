import { Op } from 'sequelize';
import { Request, Response } from 'express';

import { Message, User } from '../models/User';

/**
 * Gets all messages between two users.
 *
 * This function retrieves all messages exchanged between two users, identified by
 * their sender and receiver IDs. The messages are returned in ascending order by creation time.
 * It also includes the sender and receiver user information (id, username, and email).
 *
 * @param {Request} req - The request object containing the `receiverId` and `senderId` parameters.
 * @param {Response} res - The response object used to send back the messages.
 * @returns {Promise<Response>} A JSON response with the messages.
 */
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

/**
 * Creates a new message between two users.
 *
 * This function accepts the sender ID, receiver ID, and message text from the request body
 * and creates a new message in the database.
 *
 * @param {Request} req - The request object containing `senderId`, `receiverId`, and `text` in the body.
 * @param {Response} res - The response object used to send back the created message.
 * @returns {Promise<Response>} A JSON response with the created message.
 */
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

/**
 * Edits an existing message.
 *
 * This function allows the user to edit the text of an existing message. It checks that the new
 * text is provided, finds the message by its ID, and updates the message's text.
 *
 * @param {Request} req - The request object containing `id` as a parameter and `text` in the body.
 * @param {Response} res - The response object used to send back the updated message.
 * @returns {Promise<Response>} A JSON response with the updated message.
 */
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

/**
 * Deletes a message.
 *
 * This function deletes a message identified by its ID. If the message is found, it is destroyed
 * from the database, and a success response is sent. If the message is not found, an error response is sent.
 *
 * @param {Request} req - The request object containing `id` as a parameter.
 * @param {Response} res - The response object used to send back the success or error message.
 * @returns {Promise<Response>} A JSON response indicating whether the message was deleted or not.
 */
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

/**
 * Uploads files.
 *
 * This function allows the user to upload files (images) along with a message. It checks if files
 * are provided, creates a new message with the associated files' paths, and stores the message in the database.
 *
 * @param {Request} req - The request object containing `senderId`, `receiverId`, `text`, and uploaded files.
 * @param {Response} res - The response object used to send back the created message along with file paths.
 * @returns {Promise<Response>} A JSON response with the message and file paths.
 */
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