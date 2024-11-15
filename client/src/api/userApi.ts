import axios from 'axios';

import {API_USERS_URL} from '../constants/apiUrl';
import {IUser} from '../types/user/user.interface';

export type IUserList = IUser[];

/**
 * Fetches all users from the server by sending a GET request.
 *
 * @returns {Promise<any>} The response data from the server, usually an array of users.
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