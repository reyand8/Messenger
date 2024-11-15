import axios from 'axios';

import {API_MESSAGES_URL} from '../constants/apiUrl';
import {IDeleteMessage, IEditMessage, IFetchMessage, ISendMessage} from '../types/message/message.interface';


const api = axios.create({
    baseURL: API_MESSAGES_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Redirecting to login...');
        }
        return Promise.reject(error);
    }
);


/**
 * Fetches messages between two users by sending a GET request to the server.
 *
 * @param {string} receiverId - The ID of the user receiving the messages.
 * @param {string} senderId - The ID of the user sending the messages.
 *
 * @returns {Promise<IFetchMessage[]>} A promise that resolves to an array of messages or an empty array in case of an error.
 */
export const fetchMessages = async (receiverId: string, senderId: string): Promise<IFetchMessage[]> => {
    try {
        const response = await api.get(`/${senderId}/${receiverId}/`);
        return (response.data as IFetchMessage[]) || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

/**
 * Sends a message from one user to another by sending a POST request to the server.
 *
 * @param {string} senderId - The ID of the user sending the message.
 * @param {string} receiverId - The ID of the user receiving the message.
 * @param {string} text - The content of the message to send.
 *
 * @returns {Promise<ISendMessage | null>} A promise that resolves to the created message or `null` in case of an error.
 */
export const sendMessage = async (senderId: string, receiverId: string, text: string): Promise<ISendMessage | null> => {
    try {
        const newMessage = {senderId, receiverId, text };
        const response = await api.post('', newMessage);
        return response.data as ISendMessage;
    } catch (error) {
        console.error('Error sending message:', error);
        return null;
    }
};

/**
 * Deletes a message by sending a request to the server.
 *
 * @param {number} id - The ID of the message to delete.
 *
 * @returns {Promise<IDeleteMessage>} A promise that resolves to the server's response or an error message.
 */
export const deleteMessage = async (id: number): Promise<IDeleteMessage> => {
    try {
        const response = await api.post(`/delete/${id}`);
        if (response.data) {
            return response.data as IDeleteMessage;
        }
        return { message: 'No data returned' };
    } catch (error) {
        console.error('Error deleting message:', error);
        return { message: 'Error deleting message' };
    }
};

/**
 * Edits an existing message by sending updated content to the server.
 *
 * @param {number} id - The ID of the message to edit.
 * @param {string} text - The new content of the message.
 *
 * @returns {Promise<IEditMessage | null>} A promise that resolves to the updated message or `null` in case of an error.
 */
export const editMyMessage = async (id: number, text: string): Promise<IEditMessage | null> => {
    try {
        const editedMessage = { text };
        const response = await api.post(`/edit/${id}`, editedMessage);
        return response.data as IEditMessage;
    } catch (error) {
        console.error('Error editing message:', error);
        return null;
    }
};


/**
 * Uploads an image as part of a message by sending the image data to the server.
 *
 * @param {string} senderId - The ID of the user sending the image.
 * @param {string} receiverId - The ID of the user receiving the image.
 * @param {FormData} formData - The FormData object containing the image file and metadata.
 *
 * @returns {Promise<ISendMessage | null>} A promise that resolves to the uploaded image's response or `null` in case of an error.
 */
export const uploadImage = async (senderId: string, receiverId: string, formData: FormData): Promise<ISendMessage | null> => {
    try {
        formData.append('senderId', senderId);
        formData.append('receiverId', receiverId);
        formData.append('text', '');
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data as ISendMessage;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};