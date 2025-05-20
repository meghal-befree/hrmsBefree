import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import { TableHead, TableRow, TableCell, Box, Typography, TextField } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props<T> {
    headerGroups: HeaderGroup<T>[];
}

export function TableHeader<T>({ headerGroups }: Props<T>) {
    return (
        <TableHead>
            {/* First Row: Headers with Sorting */}
            {headerGroups.map((group) => (
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

                                {header.column.getCanSort() && (
                                    <>
                                        {header.column.getIsSorted() === "asc" && <ArrowDropUpIcon fontSize="small" />}
                                        {header.column.getIsSorted() === "desc" && <ArrowDropDownIcon fontSize="small" />}
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
            {headerGroups.map((group) => (
                <TableRow key={group.id + "-filters"}>
                    {group.headers.map((header) => (
                        <TableCell
                            key={header.id + "-filter"}
                            sx={{ border: "1px solid #ccc", backgroundColor: "#fafafa" }}
                        >
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
}
