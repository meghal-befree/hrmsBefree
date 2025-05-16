import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchAllUsers } from '../../../api/auth';
import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function EmployeeTable() {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAllUsers();
                const formatted = response.map((item: any, index: number) => ({
                    id: `EMP ${index + 1}`,
                    username: item.username,
                    email: item.email,
                    isActiveUser: item.isActiveUser,
                }));
                setData(formatted);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1, filterable: true, sortable: true },
        { field: 'username', headerName: 'Name', flex: 2, filterable: true, sortable: true },
        { field: 'email', headerName: 'Email', flex: 3, filterable: true, sortable: true },
        {
            field: 'isActiveUser',
            headerName: 'Status',
            flex: 2,
            filterable: true,
            sortable: true,
            renderCell: (params: any) => (params.value ? 'Active User' : 'Deactivated User'),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="edit"
                        // onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        // onClick={() => handleDelete(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                    columns: {
                        columnVisibilityModel: {
                        },
                    },
                }}
                slots={{
                    toolbar: GridToolbar, // toolbar enables filtering, export, column show/hide, etc
                }}
                disableRowSelectionOnClick
                checkboxSelection={true}  // disable if you want row selection checkboxes off
                sortingMode="client"
                filterMode="client"
                paginationMode="client"
            />
        </div>
    );
}
