export const getLocalStorageToken = () => {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
        const parsedUser = JSON.parse(user);
        return parsedUser.access_token;
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return null;
    }
};