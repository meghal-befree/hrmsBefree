import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
    Table, TableBody, TableCell, TableContainer, TableRow,
    Paper, TextField, Box, IconButton, Select, MenuItem, Typography, CircularProgress, Tooltip,
    Badge
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import {TableHeader} from "./TableHeader.tsx";

interface CustomMeta {
    enableSorting?: boolean;
    enableColumnFilter?: boolean;
    filterType?: 'text' | 'select' | 'multiselect';
    filterOptions?: { label: string; value: any }[];
}

type TableColumn<T> = ColumnDef<T, any> & {
    meta?: CustomMeta;
    enableSorting?: boolean;
    enableColumnFilter?: boolean;
};


export interface Props<T> {
    columns: TableColumn<T>[];
    queryKey: string[];
    queryFn: (params: {
        pageIndex: number;
        pageSize: number;
        globalFilter: string;
        columnFilters: ColumnFiltersState;
        sorting: SortingState;
    }) => Promise<{ data: T[]; total: number }>;
}

export function MuiDataTable<T extends object>({ columns, queryKey, queryFn }: Props<T>) {
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [showFilters, setShowFilters] = React.useState(false);

    const { data, isLoading } = useQuery({
        queryKey: [...queryKey, pageIndex, pageSize, globalFilter, columnFilters, sorting],
        queryFn: () =>
            queryFn({ pageIndex, pageSize, globalFilter, columnFilters, sorting }),
        keepPreviousData: true,
    });

    const processedColumns = columns.map(col => ({
        ...col,
        enableSorting: col.meta?.enableSorting ?? true,
        enableColumnFilter: col.meta?.enableColumnFilter ?? true,
    }));

    const table = useReactTable({
        data: data?.data ?? [],
        columns: processedColumns,
        pageCount: Math.ceil((data?.total ?? 0) / pageSize),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        state: {
            globalFilter,
            columnFilters,
            sorting,
            pagination: { pageIndex, pageSize },
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onPaginationChange: updater => {
            const newState = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;

    const renderTableBody = () => <TableBody>
        {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={{ border: '1px solid #ccc' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </TableBody>

    const renderPaginationControls = () => <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
            <IconButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body2" component="span" mx={2}>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </Typography>
            <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <NavigateNextIcon />
            </IconButton>
            <IconButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <LastPageIcon />
            </IconButton>
        </Box>

        <Select
            size="small"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
            {[5, 10, 20].map((size) => (
                <MenuItem key={size} value={size}>Show {size}</MenuItem>
            ))}
        </Select>
    </Box>

    const renderToolbar = () => (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <TextField
                label="Search"
                variant="outlined"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                size="small"
                sx={{ width: '300px' }}
            />

            <Box display="flex" alignItems="center" gap={1}>
                {/* Toggle Filter Button */}
                <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
                    <IconButton onClick={() => setShowFilters(prev => !prev)} color="primary">
                        <Badge badgeContent={columnFilters.length} color="secondary">
                            <FilterListIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* Clear Filter Button (only shown if filters are applied) */}
                {columnFilters.length > 0 && (
                    <Tooltip title="Clear All Filters">
                        <IconButton
                            onClick={() => {
                                table.resetColumnFilters();
                                setColumnFilters([]);
                            }}
                            color="error"
                        >
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );

    return (
        <Box>
            {renderToolbar()}
            <TableContainer component={Paper}>
                <Table sx={{ border: '1px solid #ccc' }}>
                    <TableHeader headerGroups={table.getHeaderGroups()} showFilters={showFilters}/>
                    {renderTableBody()}
                </Table>
            </TableContainer>

            {renderPaginationControls()}
        </Box>
    );
}
