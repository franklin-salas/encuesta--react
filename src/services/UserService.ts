import axios from 'axios';
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from '../utils/endpoints';

export const registerUser = (name: string, email: string, password: string) => {
    return axios.post(REGISTER_ENDPOINT, {
        name, email, password
    });
}

export const loginUser = (email: string, password: string) => {
    return axios.post(LOGIN_ENDPOINT, {
        email, password
    });
}