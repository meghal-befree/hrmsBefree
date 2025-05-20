import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Box, IconButton, Select, MenuItem, Typography, CircularProgress
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface CustomMeta {
    enableSorting?: boolean;
    enableColumnFilter?: boolean;
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

   const renderTableHeader = () => (
        <TableHead>
            {/* First Row: Headers with sorting */}
            {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                    {group.headers.map((header) => (
                        <TableCell
                            key={header.id}
                            sx={{ border: "1px solid #ccc", backgroundColor: "#f5f5f5" }}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Typography>

                                {/* Sorting icons */}
                                {header.column.getCanSort() && (
                                    <>
                                        {header.column.getIsSorted() === "asc" && (
                                            <ArrowDropUpIcon fontSize="small" />
                                        )}
                                        {header.column.getIsSorted() === "desc" && (
                                            <ArrowDropDownIcon fontSize="small" />
                                        )}
                                        {header.column.getIsSorted() === false && (
                                            <ArrowDropDownIcon fontSize="small" sx={{ opacity: 0.3 }} />
                                        )}
                                    </>
                                )}
                            </Box>
                        </TableCell>
                    ))}
                </TableRow>
            ))}

            {/* Second Row: Filters */}
            {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id + "-filters"}>
                    {group.headers.map((header) => (
                        <TableCell
                            key={header.id + "-filter"}
                            sx={{ border: "1px solid #ccc", backgroundColor: "#fafafa" }}
                        >
                            {/* Render filter input only if enableColumnFilter is true */}
                            {header.column.columnDef.meta?.enableColumnFilter ? (
                                header.column.getCanFilter() ? (
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        placeholder="Filter"
                                        defaultValue={(header.column.getFilterValue() ?? "") as string}
                                        onBlur={(e) => header.column.setFilterValue(e.target.value)}
                                        fullWidth
                                    />
                                ) : null
                            ) : null}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableHead>
    );


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

    const renderGlobalSearch = () =>  <TextField
        label="Search"
        variant="outlined"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        sx={{ mb: 2 }}
    />

    return (
        <Box>
            {renderGlobalSearch()}
            <TableContainer component={Paper}>
                <Table sx={{ border: '1px solid #ccc' }}>
                    {renderTableHeader()}
                    {renderTableBody()}
                </Table>
            </TableContainer>
            {renderPaginationControls()}
        </Box>
    );
}
