import * as React from 'react';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarQuickFilter,
    GridToolbarExport,
    type GridColumnGroupingModel,
} from '@mui/x-data-grid';
import { fetchAllUsers } from '../../../api/auth';
import { columns } from './columns.tsx';

// Custom toolbar with density selector
function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

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

    const processRowUpdate = (newRow: any) => {
        console.log('Updated Row:', newRow);
        // Optionally send updated row to backend
        return newRow;
    };

    const columnGroupingModel: GridColumnGroupingModel = [
        {
            groupId: 'user Information',
            children: [
                { field: 'username' },
                { field: 'email' },
                { field: 'isActiveUser' },
            ],
        },
    ];

    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    density: 'comfortable',
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                slots={{
                    toolbar: CustomToolbar,
                }}
                showToolbar
                disableRowSelectionOnClick
                checkboxSelection={false}
                sortingMode="client"
                filterMode="client"
                paginationMode="client"
                editMode="cell"
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                columnGroupingModel={columnGroupingModel}
            />
        </div>
    );
}
