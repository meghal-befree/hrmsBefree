import React from 'react';
import {
    Stack,
    Typography,
    Divider,
    MenuList,
    MenuItem,
    ListItemIcon,
    Avatar,
    ListItemText,
    IconButton,
    Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { getParsedUser } from '../component/utils/util.ts';

export function SidebarFooterAccount() {
    const sessionUserAccount = getParsedUser();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditProfile = () => {
        handleMenuClose();
        navigate('/edit');
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Stack direction="column" sx={{ p: 2 }}>
            <Typography variant="body2" mb={1}>Accounts</Typography>
            <MenuList>
                {sessionUserAccount && (
                    <MenuItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                src={`http://localhost:3000${sessionUserAccount.user.image}`}
                                alt={sessionUserAccount.user.username}
                            />
                            <ListItemText
                                primary={sessionUserAccount.user.username}
                                secondary={sessionUserAccount.user.email}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                            />
                        </Stack>
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    </MenuItem>
                )}
            </MenuList>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEditProfile}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <Divider />
        </Stack>
    );
}
