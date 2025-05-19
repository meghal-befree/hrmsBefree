import type { ColumnDef } from '@tanstack/react-table';
export interface Employee {
    id: number;
    username: string;
    email: string;
    isActiveUser: boolean;
}

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: 'id',
        header: () => 'ID',
        cell: info => info.getValue(),
        meta: {
            enableSorting: false,
            enableColumnFilter: false,
        },
        filterFn: (row, columnId, filterValue) => {
            const cellValue = row.getValue<number>(columnId);
            return String(cellValue).includes(filterValue);
        },
    },
    {
        accessorKey: 'username',
        header: () => 'Name',
        cell: info => info.getValue(),
        meta: {
            enableSorting: true,
            enableColumnFilter: true,
        },
    },
    {
        accessorKey: 'email',
        header: () => 'Email',
        cell: info => info.getValue(),
        meta: {
            enableSorting: true,
            enableColumnFilter: true,
        },
    },
    {
        accessorKey: 'isActiveUser',
        header: () => 'Status',
        cell: info => info.getValue() ? 'Active User' : 'Deactivated User',
        meta: {
            enableSorting: true,
            enableColumnFilter: true,
        },
        filterFn: (row, columnId, filterValue) => {
            const value = row.getValue<boolean>(columnId);
            const label = value ? 'Active User' : 'Deactivated User';
            return label.toLowerCase().includes((filterValue as string).toLowerCase());
        },
    }
];
