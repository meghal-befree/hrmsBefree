import { Routes, Route } from 'react-router-dom';
import Login from '../component/Auth/Login';
import Signup from '../component/Auth/Signup';
import Home from '../component/Home/Home.tsx';
import PrivateRoute from '../component/privateRoute/PrivateRoute.tsx';
import EditUser from "../component/profileDetails/EditProfileDetails.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />

            <Route
                path="/edit"
                element={
                    <PrivateRoute>
                        <EditUser />
                    </PrivateRoute>
                }
            />

            <Route
                path="/edit/:id"
                element={
                    <PrivateRoute adminOnly>
                        <EditUser />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
