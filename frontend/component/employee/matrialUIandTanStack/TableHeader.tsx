import {
    flexRender,
    type HeaderGroup
} from "@tanstack/react-table";
import {
    TableHead,
    TableRow,
    TableCell,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText
} from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props<T> {
    headerGroups: HeaderGroup<T>[];
}

export function TableHeader<T>({ headerGroups }: Props<T>) {
    return (
        <TableHead>
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

            {/* Filter Row */}
            {headerGroups.map((group) => (
                <TableRow key={group.id + "-filters"}>
                    {group.headers.map((header) => {
                        const meta = header.column.columnDef.meta as {
                            enableColumnFilter?: boolean;
                            filterType?: "text" | "select" | "multiselect";
                            filterOptions?: { label: string; value: any }[];
                        };

                        const filterValue = header.column.getFilterValue();

                        return (
                            <TableCell
                                key={header.id + "-filter"}
                                sx={{ border: "1px solid #ccc", backgroundColor: "#fafafa" }}
                            >
                                {meta?.enableColumnFilter && header.column.getCanFilter() && (() => {
                                    switch (meta.filterType) {
                                        case "select":
                                            return (
                                                <Select
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={filterValue ?? ""}
                                                    displayEmpty
                                                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                                                >
                                                    <MenuItem value="">All</MenuItem>
                                                    {meta.filterOptions?.map(opt => (
                                                        <MenuItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            );

                                        case "multiselect":
                                            return (
                                                <Select
                                                    multiple
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={Array.isArray(filterValue) ? filterValue : []}
                                                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                                                    input={<OutlinedInput />}
                                                    renderValue={(selected: any[]) => selected.join(", ")}
                                                >
                                                    {meta.filterOptions?.map(opt => (
                                                        <MenuItem key={opt.value} value={opt.value}>
                                                            <Checkbox checked={filterValue?.includes(opt.value)} />
                                                            <ListItemText primary={opt.label} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            );

                                        case "text":
                                        default:
                                            return (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="Filter"
                                                    fullWidth
                                                    defaultValue={(filterValue ?? "") as string}
                                                    onBlur={(e) => header.column.setFilterValue(e.target.value)}
                                                />
                                            );
                                    }
                                })()}
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableHead>
    );
}
