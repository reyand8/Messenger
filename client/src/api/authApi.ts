import axios from 'axios';

import {API_AUTH_URL} from '../constants/apiUrl';
import {IAuthResponse, IVerifyToken} from '../types/auth/auth.interface';


/**
 * A generic function to perform POST requests and handle errors.
 *
 * @template T - The expected type of the response data.
 * @param {string} url - The endpoint URL for the POST request.
 * @param {object} data - The data to send in the body of the request.
 *
 * @returns {Promise<T | null>} A promise that resolves to the server response data.
 */
const postRequest = async <T>(url: string, data: object): Promise<T | null> => {
    try {
        const response = await axios.post(url, data);
        return response.data as T;
    } catch (error: any) {
        throw new Error(error);
    }
};

/**
 * Registers a new user by sending their credentials to the server.
 *
 * @param {string} username - The desired username of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user account.
 *
 * @returns {Promise<IAuthResponse | null>} A promise that resolves to the server's response data.
 */
export const register = async (
    username: string, email: string, password: string
): Promise<IAuthResponse | null> => {
    const data = await postRequest<IAuthResponse>(`${API_AUTH_URL}/register`, { username, email, password });
    return data?.token ? data : null;
};

/**
 * Logs in an existing user by sending their email and password to the server.
 *
 * @param {string} email - The registered email address of the user.
 * @param {string} password - The password associated with the user's account.
 *
 * @returns {Promise<IAuthResponse | null>} A promise that resolves to the server's response data.
 */
export const login = async (
    email: string, password: string
): Promise<IAuthResponse | null> => {
    const data = await postRequest<IAuthResponse>(`${API_AUTH_URL}/login`, { email, password });
    return data?.token ? data : null;
};

/**
 * Verifies the provided authentication token by sending it to the server for validation.
 *
 * @param {string} token - The authentication token to be verified.
 *
 * @returns {Promise<IVerifyToken | null>} A promise that resolves to the server's response data.
 */
export const verifyToken = async (
    token: string
): Promise<IVerifyToken | null> => {
    const data = await postRequest<IVerifyToken>(`${API_AUTH_URL}/verifyToken`, { token });
    return data && data.username && data.email && data.id ? data : null;
};