import * as React from 'react';
import { createTheme, CssBaseline } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider, type Navigation, type Session } from '@toolpad/core/AppProvider';
import { DashboardLayout as CoreLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useNavigate } from 'react-router-dom';
import { getParsedUser } from "../component/utils/util.ts";

import { SidebarFooterAccount } from './SidebarFooterAccount';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'User Management',
    },
    {
        segment: 'user',
        title: 'User',
        icon: <DashboardIcon />,
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
    const navigate = useNavigate();

    const parsedUser = getParsedUser();
    const [session, setSession] = React.useState<Session | null>(parsedUser ? {
        user: {
            name: parsedUser.user.username,
            email: parsedUser.user.email,
            image: `http://localhost:3000${parsedUser.user.image}`,
        },
    } : null);

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: parsedUser.user.username,
                        email: parsedUser.user.email,
                        image: `http://localhost:3000${parsedUser.user.image}`,
                    },
                });
            },
            signOut: () => {
                setSession(null);
                localStorage.removeItem('user');
                navigate('/login');
            },
        };
    }, [navigate, parsedUser]);

    return (
        <AppProvider
            session={session}
            // authentication={authentication} // if use in top level app
            navigation={NAVIGATION}
            branding={{
                logo: (
                    <img
                        src="https://befree.xecurify.com/moas/images/solution-logos/customapp.png"
                        alt="MUI logo"
                        height={24}
                    />
                ),
                title: 'HRMS befree',
                homeUrl: '/',
            }}
            theme={theme}
        >
            <CssBaseline />
            <CoreLayout
                slots={{
                    sidebarFooter: SidebarFooterAccount,
                }}
            >
                <Outlet />
            </CoreLayout>
        </AppProvider>
    );
};

export default DashboardLayout;
