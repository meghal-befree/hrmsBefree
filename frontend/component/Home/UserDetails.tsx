import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress,
    Box, Typography, TablePagination
} from '@mui/material';
import { getUsersInformation } from '../../api/auth.ts';

interface User {
    id: number;
    username: string;
    email: string;
}

const UserDetailsTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); // 0-based index for TablePagination
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const fetchUsersInformation = async (currentPage = 0, limit = 5) => {
        setLoading(true);
        try {
            const response = await getUsersInformation(currentPage + 1, limit); // convert to 1-based for API
            setUsers(response.data.data);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersInformation(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    if (loading) {
        return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h5" align="center" mb={2}>User List</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        ))}
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
        </Box>
    );
};

export default UserDetailsTable;
