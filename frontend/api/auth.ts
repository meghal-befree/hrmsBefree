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

export const updateUser = async (id: number, data: FormData) => {
    return http.put(`/auth/users/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    });
};

export const downloadUserPdf = async (page?: number, limit?: number) => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;

    return http.post(
        `/auth/users/download-pdf`,
        {},
        {
            responseType: 'blob',
            withCredentials: true,
            params,
        }
    );
};

export const getUserById = async (id: number) => {
    return http.get(`/auth/users/${id}`);
};

