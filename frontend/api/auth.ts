import http from './http';
import type {ColumnFiltersState, SortingState} from "@tanstack/react-table";

export const loginUser = async (data: { email: string; password: string }) => {
    return http.post('/auth/login', data);
};

export const signupUser = async (data: { username: string; email: string; password: string }) => {
    return http.post('/auth/signup', data);
};

export const getUsersInformation = async (
    page = 1,
    limit = 5,
    name = '',
    email = ''
) => {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (name) params.append('name', name);
    if (email) params.append('email', email);

    return http.get(`/auth/users?${params.toString()}`);
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

// export async function fetchAllUsers({
//                                         pageIndex,
//                                         pageSize,
//                                         globalFilter,
//                                         columnFilters,
//                                         sorting,
//                                     }: {
//     pageIndex: number;
//     pageSize: number;
//     globalFilter: string;
//     columnFilters: ColumnFiltersState;
//     sorting: SortingState;
// }) {
//     const params = new URLSearchParams({
//         page: (pageIndex + 1).toString(),
//         limit: pageSize.toString(),
//         search: globalFilter,
//         // Add other filters/sorts as needed
//     });
//
//     columnFilters.forEach(filter =>
//         params.append(`filters[${filter.id}]`, filter.value)
//     );
//
//     sorting.forEach(sort =>
//         params.append(`sort[${sort.id}]`, sort.desc ? 'desc' : 'asc')
//     );
//
//     console.log('params', params.toString());
//
//     const response =await http.post(`/auth/users/table-data?${params.toString()}`);
//     return { data: response?.data?.data || [], total: response?.data?.total || 0, page: response?.data?.page || 1, lastPage: response?.data?.lastPage || 1 };
// }

export async function fetchAllUsers({
                                        pageIndex,
                                        pageSize,
                                        globalFilter,
                                        columnFilters,
                                        sorting,
                                    }: {
    pageIndex: number;
    pageSize: number;
    globalFilter: string;
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
}) {
    const params = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        limit: pageSize.toString(),
        search: globalFilter || '',
    });

    if (columnFilters.length > 0) {
        params.append('filters', JSON.stringify(columnFilters));
    }

    if (sorting.length > 0) {
        params.append('sort', JSON.stringify(sorting));
    }

    console.log('params', params.toString());

    const response = await http.post(`/auth/users/table-data?${params.toString()}`);
    return {
        data: response?.data?.data || [],
        total: response?.data?.total || 0,
        page: response?.data?.page || 1,
        lastPage: response?.data?.lastPage || 1,
    };
}
