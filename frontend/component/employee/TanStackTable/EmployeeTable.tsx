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
import { columns } from './columns.tsx';
import {Box} from "@mui/material";

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
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [columnPinning, setColumnPinning] = React.useState<{ [colId: string]: 'left' | 'right' | undefined }>({});


    // Initialize column order once data & columns loaded
    React.useEffect(() => {
        if (data.length && columnOrder.length === 0) {
            setColumnOrder(columns.map((col) => col.accessorKey as string));
        }
    }, [data, columns, columnOrder.length]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            columnFilters,
            sorting,
            columnOrder,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onColumnOrderChange: setColumnOrder,
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

    function calculateLeftOffset(colId: string) {
        const pinnedLeftCols = columns
            .map((c) => c.accessorKey as string)
            .filter((id) => columnPinning[id] === 'left');
        let offset = 0;
        for (const id of pinnedLeftCols) {
            if (id === colId) break;
            offset += 150; // your column width in px, or calculate dynamically
        }
        return offset;
    }

    function calculateRightOffset(colId: string) {
        const pinnedRightCols = columns
            .map((c) => c.accessorKey as string)
            .filter((id) => columnPinning[id] === 'right')
            .reverse();
        let offset = 0;
        for (const id of pinnedRightCols) {
            if (id === colId) break;
            offset += 150;
        }
        return offset;
    }
    const renderTableHeader = () => (
        <thead>
        {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <th
                        key={header.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('colId', header.column.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const draggedColId = e.dataTransfer.getData('colId');
                            const targetColId = header.column.id;

                            const newOrder = [...columnOrder];
                            const fromIndex = newOrder.indexOf(draggedColId);
                            const toIndex = newOrder.indexOf(targetColId);

                            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                                newOrder.splice(fromIndex, 1);
                                newOrder.splice(toIndex, 0, draggedColId);
                                setColumnOrder(newOrder);
                            }
                        }}
                        style={{
                            position: columnPinning[header.column.id] ? 'sticky' : undefined,
                            left: columnPinning[header.column.id] === 'left' ? calculateLeftOffset(header.column.id) : undefined,
                            right: columnPinning[header.column.id] === 'right' ? calculateRightOffset(header.column.id) : undefined,
                            backgroundColor: 'white',
                            zIndex: columnPinning[header.column.id] ? 2 : 1,
                        }}
                    >
                        <Box style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'grab' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#1f1f1f"
                                style={{ flexShrink: 0 }}
                                aria-label="Drag handle"
                            >
                                <path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640Z" />
                            </svg>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <button
                                onClick={() => {
                                    setColumnPinning((old) => {
                                        const current = old[header.column.id];
                                        if (!current) return { ...old, [header.column.id]: 'left' };
                                        if (current === 'left') return { ...old, [header.column.id]: 'right' };
                                        const { [header.column.id]: _, ...rest } = old;
                                        return rest;
                                    });
                                }}
                                title="Toggle pin (Left → Right → None)"
                                style={{ marginLeft: 'auto' }}
                            >
                                {columnPinning[header.column.id] === 'left' ? '📌L' : columnPinning[header.column.id] === 'right' ? '📌R' : '📍'}
                            </button>
                            {header.column.getIsSorted() === 'asc'
                                ? ' 🔼'
                                : header.column.getIsSorted() === 'desc'
                                    ? ' 🔽'
                                    : ''}
                        </Box>
                        {header.column.getCanFilter() && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Filter..."
                                    value={(header.column.getFilterValue() as string) ?? ''}
                                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                                    style={{ width: '100%', marginTop: '5px', padding: '6px' }}
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
                {row.getVisibleCells().map((cell) => {
                    const pinnedSide = columnPinning[cell.column.id]; // 'left' | 'right' | undefined
                    return (
                        <td
                            key={cell.id}
                            style={{
                                minWidth: 150,
                                width: 150,
                                position: pinnedSide ? 'sticky' : undefined,
                                left: pinnedSide === 'left' ? calculateLeftOffset(cell.column.id) : undefined,
                                right: pinnedSide === 'right' ? calculateRightOffset(cell.column.id) : undefined,
                                backgroundColor: 'white',
                                zIndex: pinnedSide ? 1 : undefined,
                            }}
                        >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    );
                })}
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
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <div style={{ minWidth: '1000px' }}>
                    <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
                        {renderTableHeader()}
                        {renderTableBody()}
                    </table>
                </div>
            </div>
            {renderPaginationControls()}
        </div>
    );
};
