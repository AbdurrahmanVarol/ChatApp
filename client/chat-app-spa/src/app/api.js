import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "https://localhost:7177/api";

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export function getApiWithToken() {
    const token = Cookies.get('token');
    return axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

export default api;
