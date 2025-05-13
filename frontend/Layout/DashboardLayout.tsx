import * as React from 'react';
import { createTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout as CoreLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';

const NAVIGATION: Navigation = [
    {
        segment: 'User',
        title: 'user',
        icon: <DashboardIcon />,
    },
    {
        segment: 'orders',
        title: 'Orders',
        icon: <ShoppingCartIcon />,
    },
];

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

const DashboardLayout = () => {
    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" height={24} />,
                title: 'HRMS Befree',
                homeUrl: '/',
            }}
            theme={theme}
        >
            <CoreLayout>
                <Outlet />
            </CoreLayout>
        </AppProvider>
    );
};

export default DashboardLayout;
