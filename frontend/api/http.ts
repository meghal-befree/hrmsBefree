import axios from 'axios';
import {getLocalStorageToken} from "../component/utils/util.ts";

const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(config => {
    const excludedEndpoints = ['/auth/login', '/auth/signup'];

    if (!excludedEndpoints.includes(config.url || '')) {
        const token = getLocalStorageToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return config;
});

export default http;
