import axios from 'axios';

import {API_USERS_URL} from '../constants/apiUrl';
import {IUser} from '../types/user/user.interface';

export type IUserList = IUser[];

/**
 * Fetches all users from the server by sending a GET request.
 *
 * @returns {Promise<IUserList | null>} A promise that resolves to an array of users if the request is successful,
 * or null if an error occurs during the request.
 */
export const fetchAllUsers = async (): Promise<IUserList | null> => {
    try {
        const response = await axios.get(`${API_USERS_URL}/allUsers`);
        return response.data as IUserList;
    } catch (err) {
        console.error(err);
        return null;
    }
};