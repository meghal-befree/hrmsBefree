import {
    TableRow,
    TableCell
} from "@mui/material";
import { HeaderGroup } from "@tanstack/react-table";
import { TextFilter } from "./TextFilter";
import { SelectFilter } from "./SelectFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";

interface Props<T> {
    headerGroup: HeaderGroup<T>;
}

export function TableFilterRow<T>({ headerGroup }: Props<T>) {
    return (
        <TableRow key={headerGroup.id + "-filters"}>
            {headerGroup.headers.map((header) => {
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
    );
}
