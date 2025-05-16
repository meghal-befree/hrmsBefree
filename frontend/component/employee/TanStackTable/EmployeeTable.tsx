import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { fetchAllUsers } from '../../../api/auth';
import {columns} from "./columns.tsx";

export interface Employee {
    id: number;
    username: string;
    email: string;
    isActiveUser: boolean;
}

export const EmployeeTable: React.FC = () => {
    const { data = [], isLoading } = useQuery<Employee[]>({
        queryKey: ['employees'],
        queryFn: fetchAllUsers,
    });

    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            columnFilters,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        globalFilterFn: 'includesString',
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (isLoading) return <p>Loading...</p>;

    // --- Render Functions ---
    const renderGlobalSearch = () => (
        <input
            type="text"
            placeholder="Global Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ marginBottom: '1rem', padding: '5px', width: '200px' }}
        />
    );

    const renderTableHeader = () => (
        <thead>
        {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                        <div
                            style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                            onClick={header.column.getToggleSortingHandler()}
                        >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc'
                                ? ' 🔼'
                                : header.column.getIsSorted() === 'desc'
                                    ? ' 🔽'
                                    : ''}
                        </div>
                        {header.column.getCanFilter() && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Filter..."
                                    value={(header.column.getFilterValue() as string) ?? ''}
                                    onChange={(e) =>
                                        header.column.setFilterValue(e.target.value)
                                    }
                                    style={{
                                        width: '100%',
                                        marginTop: '5px',
                                        padding: '6px',
                                    }}
                                />
                            </div>
                        )}
                    </th>
                ))}
            </tr>
        ))}
        </thead>
    );

    const renderTableBody = () => (
        <tbody>
        {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
            </tr>
        ))}
        </tbody>
    );

    const renderPaginationControls = () => (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                ⏮ First
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                ◀ Previous
            </button>
            <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next ▶
            </button>
            <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                Last ⏭
            </button>
            <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
                {[5, 10, 20].map((size) => (
                    <option key={size} value={size}>
                        Show {size}
                    </option>
                ))}
            </select>
        </div>
    );

    // --- Final Render ---
    return (
        <div>
            {renderGlobalSearch()}
            <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
                {renderTableHeader()}
                {renderTableBody()}
            </table>
            {renderPaginationControls()}
        </div>
    );
};
