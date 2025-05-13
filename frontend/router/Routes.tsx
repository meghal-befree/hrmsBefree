// AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Login from '../component/Auth/Login';
import Signup from '../component/Auth/Signup';
import PrivateRoute from '../component/privateRoute/PrivateRoute';
import EditUser from '../component/profileDetails/EditProfileDetails';
import UserDetailsTable from '../component/Home/UserDetails';
import DashboardLayout from '../Layout/DashboardLayout';
import Home from '../component/Home/Home';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Dashboard Layout with Nested Routes */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                }
            >
                {/* Default dashboard route */}
                <Route index element={<Home />} />

                {/* Nested routes */}
                <Route path="user" element={<UserDetailsTable />} />
                <Route path="edit" element={<EditUser />} />
                <Route path="edit/:id" element={<EditUser />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
