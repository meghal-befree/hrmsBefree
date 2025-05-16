import * as React from 'react';
import {
    DataGrid, type GridColumnGroupingModel,
    GridToolbar,
} from '@mui/x-data-grid';
import { fetchAllUsers } from '../../../api/auth';
import {columns} from "./columns.tsx";

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

    const processRowUpdate = (newRow) => {
        console.log('Updated Row:', newRow);
        // Here, you can make an API call to persist the changes to the backend
        return newRow;
    };

    const columnGroupingModel: GridColumnGroupingModel = [
        {
            groupId: 'user Information',
            description: '',
            children: [{field: 'username'}, {field: 'email'}, { field: 'isActiveUser'}],
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
                }}
                slots={{
                    toolbar: GridToolbar, // toolbar enables filtering, export, column show/hide, etc
                }}
                disableRowSelectionOnClick
                checkboxSelection={false}  // disable if you want row selection checkboxes off
                sortingMode="client"
                filterMode="client"
                paginationMode="client"
                editMode="cell" // enable cell editing
                processRowUpdate={processRowUpdate} // callback to persist the updated row
                experimentalFeatures={{ newEditingApi: true }} // enable new editing API
                columnGroupingModel={columnGroupingModel}
            />
        </div>
    );
}
