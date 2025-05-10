import { Navigate } from 'react-router-dom';
import type { JSX } from "react";
import {getLocalStorageToken} from "../utils/util.ts";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = getLocalStorageToken();
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;