const getParsedUser = () => {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return null;
    }
};

export const getLocalStorageToken = () => {
    const parsedUser = getParsedUser();
    return parsedUser?.access_token ?? null;
};

export const getLocalStorageUserId = () => {
    const parsedUser = getParsedUser();
    return parsedUser?.user?.id ?? null;
};

export const getLocalStorageIsAdmin = () => {
    const parsedUser = getParsedUser();
    return parsedUser?.user?.isAdmin ?? null;
};