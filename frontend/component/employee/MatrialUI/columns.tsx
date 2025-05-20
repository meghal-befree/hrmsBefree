import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const columns = [
    { field: 'id', headerName: 'ID', flex: 1, filterable: true, sortable: true },
    { field: 'username', headerName: 'Name', flex: 2, filterable: true, sortable: true, editable: true },
    { field: 'email', headerName: 'Email', flex: 3, filterable: true, sortable: true, editable: true },
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
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    aria-label="delete"
                >
                    <DeleteIcon />
                </IconButton>
            </>
        ),
    },
];