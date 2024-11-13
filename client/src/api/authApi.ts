import axios from 'axios';

import {API_AUTH_URL} from '../constants/apiUrl';

/**
 * Registers a new user by sending a POST request to the server with the user's credentials.
 *
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 *
 * @returns {Promise<any>} The response data from the server (e.g., user data, success message).
 */
export const register = async (username: string, email: string, password: string): Promise<any> => {
    const response =
        await axios.post(`${API_AUTH_URL}/register`, { username, email, password });
    return response.data;
};

/**
 * Logs in an existing user by sending a POST request to the server with their email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 *
 * @returns {Promise<any>} The response data from the server (e.g., authentication token).
 */
export const login = async (email: string, password: string): Promise<any>  => {
    const response =
        await axios.post(`${API_AUTH_URL}/login`, { email, password });
    return response.data;
};

/**
 * Verifies the authenticity of the provided token by sending a POST request to the server.
 *
 * @param {string} token - The authentication token to verify.
 *
 * @returns {Promise<any>} The response data from the server (e.g., user data if the token is valid).
 *
 * @throws {Error} If the token is invalid or verification fails, an error is thrown.
 */
export const verifyToken = async (token: string): Promise<any>  => {
    try {
        const response =
            await axios.post(`${API_AUTH_URL}/verifyToken`, {token});
        return await response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};