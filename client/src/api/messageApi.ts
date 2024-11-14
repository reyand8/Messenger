import axios from 'axios';

import {API_MESSAGES_URL} from '../constants/apiUrl';


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
 * @param {string} receiverId - The ID of the receiver user.
 * @param {string} senderId - The ID of the sender user.
 *
 * @returns {Promise<any>} The response data from the server (usually an array of messages).
 */
export const fetchMessages = async (receiverId: string, senderId: string): Promise<any> => {
    const response = await api.get(`/${senderId}/${receiverId}/`);
    return response.data;
};

/**
 * Sends a message from one user to another by sending a POST request to the server.
 *
 * @param {string} senderId - The ID of the sender user.
 * @param {string} receiverId - The ID of the receiver user.
 * @param {string} text - The content of the message.
 *
 * @returns {Promise<any>} The response data from the server (usually the created message).
 */
export const sendMessage = async (senderId: string, receiverId: string, text: string): Promise<any> => {
    const newMessage = {
        senderId,
        receiverId,
        text
    };
    const response = await api.post('', newMessage);
    return response.data;
};


/**
 * Deletes a message by sending a POST request to the server to delete it.
 *
 * @param {number} id - The ID of the message to delete.
 *
 * @returns {Promise<any>} The response data from the server (usually a success message).
 */
export const deleteMessage = async (id: number): Promise<any> => {
    const response = await api.post(`/delete/${id}`);
    return response.data;
};

/**
 * Edits an existing message by sending a POST request to the server with the updated content.
 *
 * @param {number} id - The ID of the message to edit.
 * @param {string} text - The new content for the message.
 *
 * @returns {Promise<any>} The response data from the server (usually the edited message).
 */
export const editMyMessage = async (id: number, text: string): Promise<any> => {
    const editedMessage = {
        text
    };
    const response = await api.post(`/edit/${id}`, editedMessage);
    return response.data;
};


/**
 * Uploads an image as part of a message by sending a POST request to the server with the image data.
 *
 * @param {string} senderId - The ID of the sender user.
 * @param {string} receiverId - The ID of the receiver user.
 * @param {FormData} formData - The FormData object containing the image and other message details.
 *
 * @returns {Promise<any>} The response data from the server (usually the uploaded image or message).
 */
export const uploadImage = async (senderId: string, receiverId: string, formData: FormData): Promise<any> => {
    formData.append('senderId', senderId);
    formData.append('receiverId', receiverId);
    formData.append('text', '');
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};