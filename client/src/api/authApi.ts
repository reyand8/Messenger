import axios from 'axios';

import {API_AUTH_URL} from "../constants/apiUrl";


export const register = async (username: string, email: string, password: string) => {
    const response =
        await axios.post(`${API_AUTH_URL}/register`, { username, email, password });
    return response.data;
};

export const login = async (email: string, password: string)  => {
    const response =
        await axios.post(`${API_AUTH_URL}/login`, { email, password });
    return response.data;
};

export const verifyToken = async (token: string)  => {
    try {
        const response =
            await axios.post(`${API_AUTH_URL}/verifyToken`, {token});
        return await response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};