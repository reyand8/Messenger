import axios from 'axios';

import {API_MESSAGES_URL} from "../constants/apiUrl";


export const fetchMessages =
    async (receiverId: string, senderId: string, token: string ) => {
    const response =
        await axios.get(`${API_MESSAGES_URL}/${senderId}/${receiverId}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

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

export const deleteMessage = async (id: number) => {
    const response =
        await axios.post(`${API_MESSAGES_URL}/delete/${id}`);
    return response.data;
};

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