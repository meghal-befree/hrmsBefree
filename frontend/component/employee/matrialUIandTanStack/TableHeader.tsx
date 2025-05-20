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
} from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {TableFilterRow} from "./filter/TableFilterRow.tsx";

interface Props<T> {
    headerGroups: HeaderGroup<T>[];
    showFilters?: boolean;
}

export function TableHeader<T>({ headerGroups, showFilters }: Props<T>) {
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
            {showFilters && headerGroups.map((group) => (
                <TableFilterRow key={group.id + "-filters"} headerGroup={group} />
            ))}
        </TableHead>
    );
}
