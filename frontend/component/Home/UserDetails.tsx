import React, {useEffect, useState} from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress,
    Box, Typography, TablePagination, Avatar, IconButton, Switch,
    FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {getUsersInformation, softDeleteUser, updateUserStatus} from '../../api/auth.ts';
import {getLocalStorageIsAdmin} from "../utils/util.ts";
import {useNavigate} from "react-router-dom";
import ConfirmModal from "../modal/ConfirmModal.tsx";
import { toast } from 'react-toastify';

interface User {
    id: number;
    username: string;
    email: string;
    image: string;
    isActiveUser: boolean;
}

const UserDetailsTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'delete' | 'status'>('delete');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [filterInput, setFilterInput] = useState({
        username: '',
        email: ''
    });

    const [appliedFilter, setAppliedFilter] = useState({
        username: '',
        email: ''
    });

    const navigate = useNavigate();

    const currentUserRole = getLocalStorageIsAdmin() ? 'admin' : 'user';

    const fetchUsersInformation = async (currentPage = 0, limit = 5,  name = '', email = '') => {
        setLoading(true);
        try {
            const response = await getUsersInformation(currentPage + 1, limit, name, email); // convert to 1-based for API
            setUsers(response.data.data);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersInformation(page, rowsPerPage, appliedFilter.username, appliedFilter.email);
    }, [page, rowsPerPage, appliedFilter]);

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
    }

    const handleEdit = (id: number) => {
        navigate(`/edit/${id}`)
    }

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setModalType('delete');
        setModalOpen(true);
    }

    const handleStatusChange = (id: number) => {
        setSelectedId(id);
        setModalType('status');
        setModalOpen(true);
    };
    const renderFilter = () => {
        const uniqueUsernames = Array.from(new Set(users.map(user => user.username)));

        const handleEmailKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                setAppliedFilter(filterInput);
                setPage(0);
            }
        };

        const handleEmailBlur = () => {
            setAppliedFilter(filterInput);
            setPage(0);
        };

        return (
            <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                flexWrap="wrap"
                gap={3}
                mb={3}
            >
                {/* Username Dropdown */}
                <FormControl variant="standard" sx={{ minWidth: 200 }}>
                    <InputLabel id="username-filter-label">Username</InputLabel>
                    <Select
                        labelId="username-filter-label"
                        value={filterInput.username}
                        onChange={(e) => {
                            const updated = { ...filterInput, username: e.target.value };
                            setFilterInput(updated);
                            setAppliedFilter(updated);
                            setPage(0);
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {uniqueUsernames.map((name) => (
                            <MenuItem key={name} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Email Input */}
                <TextField
                    label="Email"
                    variant="standard"
                    value={filterInput.email}
                    onChange={(e) =>
                        setFilterInput((prev) => ({ ...prev, email: e.target.value }))
                    }
                    onBlur={handleEmailBlur}
                    onKeyUp={handleEmailKeyUp}
                />
            </Box>
        );
    };



    const handleConfirmDelete = async () => {
        if (selectedId !== null) {
            try {
                if (modalType === 'delete') {
                    const res = await softDeleteUser(selectedId);
                    toast.success(res.data.message);
                    await fetchUsersInformation(page, rowsPerPage);
                } else {
                    await updateUserStatus(selectedId);
                    await updateUserStatus(selectedId);
                    setUsers(prevUsers =>
                        prevUsers.map(user =>
                            user.id === selectedId ? { ...user, isActiveUser: !user.isActiveUser } : user
                        )
                    );
                    toast.success('User status updated successfully');
                }
            } catch (err) {
                console.error('Error ->', err);
                toast.error(modalType === "delete" ? 'Failed to delete user. Please try again later.' : 'Failed to update user status. Please try again later.');
            } finally {
                handleClose();
            }
        }
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedId(null);
    };

    const renderTableBody = () => {
        return users.map(user => {
            return (
                <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                        <Avatar
                            alt={user.username}
                            src={user.image ? `http://localhost:3000${user.image}` : undefined}
                        >
                            {!user.image && user.username?.[0].toUpperCase()}
                        </Avatar>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    {currentUserRole === 'admin' && (
                        <TableCell>
                            <Switch
                                checked={user.isActiveUser}
                                color="success"
                                onChange={() => handleStatusChange(user.id)}
                            />
                        </TableCell>
                    )}
                    {currentUserRole === 'admin' && (
                        <TableCell>
                            <IconButton onClick={() => handleEdit(user.id)} aria-label="edit" color="primary">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(user.id)} aria-label="delete" color="error">
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    )}
                </TableRow>
            )
        });
    };

    return (
        <Box mt={5} p={2} sx={{ width: '100%' }}>
            <Typography variant="h5" align="center" mb={2}>User List</Typography>
            <hr />
            <Paper elevation={2} sx={{ p: 2, mb: 3 }} variant="outlined">
                {renderFilter()}
            </Paper>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Profile Image</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            {currentUserRole === 'admin' && <TableCell>Status</TableCell>}
                            {currentUserRole === 'admin' && <TableCell>Action</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderTableBody()}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />
            <ConfirmModal
                open={modalOpen}
                onClose={handleClose}
                onConfirm={handleConfirmDelete}
                title={modalType === 'delete' ? 'Confirm Delete' : 'Confirm Status Change'}
                description={modalType === 'delete'
                    ? 'Are you sure you want to delete this user?'
                    : 'Are you sure you want to change the status of this user?'}
                actionButtonName={modalType === 'delete' ? 'Delete' : 'Change'}
                actionButtonColor={modalType === 'delete' ? 'error' : 'primary'}
            />
        </Box>
    );
};

export default UserDetailsTable;
