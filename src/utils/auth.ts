import axios from "axios";
import { User } from "../types";
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = "token";
const defaultUser: User = {
    email: "",
    isAuthenticated: false,
    token: ""
};

const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
}

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || null;
}

const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}

export const authenticate = (token?: string): User => {
    if (token) {
        setToken(token);
    }

    const _token = token ? token : getToken();

    if (!_token) {
        return {...defaultUser};
    }

    const decoded: any = jwt_decode(_token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
        removeToken();
        return {...defaultUser};
    }

    axios.defaults.headers.common["Authorization"] = _token;

    return {...defaultUser, email: decoded.sub, isAuthenticated: true, token: _token};
}

export const logout = (): User => {
    removeToken();
    delete axios.defaults.headers.common['Authorization'];
    return {...defaultUser};
}