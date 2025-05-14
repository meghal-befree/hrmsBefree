import { Navigate } from 'react-router-dom';
import type { JSX } from "react";
import { getLocalStorageToken, getLocalStorageIsAdmin } from '../utils/util';

const PrivateRoute = ({ children, adminOnly = false }: { children?: JSX.Element, adminOnly?: boolean }) => {
    const token = getLocalStorageToken();
    const isAdmin = getLocalStorageIsAdmin();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;