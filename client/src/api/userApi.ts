import axios from 'axios';

import {API_USERS_URL} from "../constants/apiUrl";


export const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`${API_USERS_URL}/allUsers`);
        return response.data;
    } catch (err) {
        console.error(err)
    }
};