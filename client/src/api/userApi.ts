import axios from 'axios';

import {API_USERS_URL} from "../constants/apiUrl";

/**
 * Fetches all users from the server by sending a GET request.
 *
 * @returns {Promise<any>} The response data from the server, usually an array of users.
 */
export const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`${API_USERS_URL}/allUsers`);
        return response.data;
    } catch (err) {
        console.error(err)
    }
};