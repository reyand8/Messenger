import axios from 'axios';

import {API_MESSAGES_URL} from '../constants/apiUrl';

/**
 * Fetches messages between two users by sending a GET request to the server.
 *
 * @param {string} receiverId - The ID of the receiver user.
 * @param {string} senderId - The ID of the sender user.
 * @param {string} token - The authentication token for the current user.
 *
 * @returns {Promise<any>} The response data from the server (usually an array of messages).
 */
export const fetchMessages =
    async (receiverId: string, senderId: string, token: string ) => {
        const response =
        await axios.get(`${API_MESSAGES_URL}/${senderId}/${receiverId}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    };

/**
 * Sends a message from one user to another by sending a POST request to the server.
 *
 * @param {string} senderId - The ID of the sender user.
 * @param {string} receiverId - The ID of the receiver user.
 * @param {string} text - The content of the message.
 * @param {string} token - The authentication token for the current user.
 *
 * @returns {Promise<any>} The response data from the server (usually the created message).
 */
export const sendMessage = async (senderId: string, receiverId: string, text: string, token: string) => {
    const newMessage = {
        senderId: senderId,
        receiverId: receiverId,
        text: text
    };
    const response =
        await axios.post(API_MESSAGES_URL, newMessage, {
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
};

/**
 * Deletes a message by sending a POST request to the server to delete it.
 *
 * @param {number} id - The ID of the message to delete.
 *
 * @returns {Promise<any>} The response data from the server (usually a success message).
 */
export const deleteMessage = async (id: number) => {
    const response =
        await axios.post(`${API_MESSAGES_URL}/delete/${id}`);
    return response.data;
};

/**
 * Edits an existing message by sending a POST request to the server with the updated content.
 *
 * @param {number} id - The ID of the message to edit.
 * @param {string} text - The new content for the message.
 * @param {string} token - The authentication token for the current user.
 *
 * @returns {Promise<any>} The response data from the server (usually the edited message).
 */
export const editMyMessage = async (id: number, text: string, token: string) => {
    const editedMessage = {
        text: text
    };
    const response =
        await axios.post(`${API_MESSAGES_URL}/edit/${id}`, editedMessage, {
            headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
};

/**
 * Uploads an image as part of a message by sending a POST request to the server with the image data.
 *
 * @param {string} senderId - The ID of the sender user.
 * @param {string} receiverId - The ID of the receiver user.
 * @param {FormData} formData - The FormData object containing the image and other message details.
 * @param {string} token - The authentication token for the current user.
 *
 * @returns {Promise<any>} The response data from the server (usually the uploaded image or message).
 */
export const uploadImage = async (senderId: string, receiverId: string, formData: FormData, token: string) => {
    formData.append('senderId', senderId);
    formData.append('receiverId', receiverId);
    formData.append('text', '');
    const response = await axios.post(`${API_MESSAGES_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};