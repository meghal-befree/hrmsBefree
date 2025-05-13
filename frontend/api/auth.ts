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

export const downloadUserExcel = async (page?: number, limit?: number) => {
    const queryParams = [];

    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    return http.post(
        `/auth/users/csv-download${queryString}`,
        {},
        {
            responseType: 'blob',
            withCredentials: true,
        }
    );
};

export const getUserById = async (id: number) => {
    return http.get(`/auth/users/${id}`);
};

export const updateUserStatus = async (id: number) => {
    return http.put(`/auth/user/${id}/toggle-active`);
}

export const softDeleteUser = async (id: number) => {
    return http.patch(`/auth/user/${id}/soft-delete`);
}

