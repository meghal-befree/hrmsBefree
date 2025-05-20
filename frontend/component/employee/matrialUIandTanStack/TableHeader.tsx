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
import {SelectFilter} from "./filter/SelectFilter.tsx";
import {MultiSelectFilter} from "./filter/MultiSelectFilter.tsx";
import {TextFilter} from "./filter/TextFilter.tsx";

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
                                                <SelectFilter
                                                    value={filterValue ?? ""}
                                                    options={meta.filterOptions ?? []}
                                                    onChange={(val) => header.column.setFilterValue(val)}
                                                />
                                            );

                                        case "multiselect":
                                            return (
                                                <MultiSelectFilter
                                                    value={Array.isArray(filterValue) ? filterValue : []}
                                                    options={meta.filterOptions ?? []}
                                                    onChange={(val) => header.column.setFilterValue(val)}
                                                />
                                            );

                                        case "text":
                                        default:
                                            return (
                                                <TextFilter
                                                    value={(filterValue ?? "") as string}
                                                    onChange={(val) => header.column.setFilterValue(val)}
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
