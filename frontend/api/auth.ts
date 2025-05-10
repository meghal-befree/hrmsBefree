import http from './http';

export const loginUser = async (data: { email: string; password: string }) => {
    return http.post('/auth/login', data);
};

export const signupUser = async (data: { username: string; email: string; password: string }) => {
    return http.post('/auth/signup', data);
};

export const getUsersInformation = async (page = 1, limit = 5) => {
    return http.get(`/auth/users?page=${page}&limit=${limit}`);
};

export const updateUser = async (id: number, data: { username: string; email: string; password?: string }) => {
    return http.put(`/auth/users/${id}`, data);
};

export const getUserById = async (id: number) => {
    return http.get(`/auth/users/${id}`);
};

