import { Select, MenuItem } from "@mui/material";

interface SelectFilterProps {
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
}

export function SelectFilter({ value, options, onChange }: SelectFilterProps) {
    return (
        <Select
            variant="outlined"
            size="small"
            fullWidth
            value={value}
            displayEmpty
            onChange={(e) => onChange(e.target.value)}
        >
            <MenuItem value="">All</MenuItem>
            {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                </MenuItem>
            ))}
        </Select>
    );
}
