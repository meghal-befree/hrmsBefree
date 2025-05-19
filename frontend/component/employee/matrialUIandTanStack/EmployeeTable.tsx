import { MuiDataTable } from './MuiDataTable.tsx';
import { columns } from './columns';
import { fetchAllUsers } from '../../../api/auth';

export function EmployeeTable() {
    return (
        <MuiDataTable
            columns={columns}
            queryKey={['employees']}
            queryFn={fetchAllUsers}
        />
    );
}