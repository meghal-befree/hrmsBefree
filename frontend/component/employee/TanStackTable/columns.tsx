import type { ColumnDef } from '@tanstack/react-table';
import type { Employee } from './EmployeeTable';

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: 'id',
        header: () => 'ID',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
        filterFn: (row, columnId, filterValue) => {
            const cellValue = row.getValue<number>(columnId);
            return String(cellValue).includes(filterValue);
        },
    },
    {
        accessorKey: 'username',
        header: () => 'Name',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
    },
    {
        accessorKey: 'email',
        header: () => 'Email',
        cell: info => info.getValue(),
        enableColumnFilter: true,
        enableSorting: true,
    },
    {
        accessorKey: 'isActiveUser',
        header: () => 'Status',
        cell: info => info.getValue() ? 'Active User' : 'Deactivated User',
        enableColumnFilter: true,
        enableSorting: true,
        filterFn: (row, columnId, filterValue) => {
            const value = row.getValue<boolean>(columnId);
            const label = value ? 'Active User' : 'Deactivated User';
            return label.toLowerCase().includes((filterValue as string).toLowerCase());
        },
    }
];
