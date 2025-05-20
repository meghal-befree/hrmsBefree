import {
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText
} from "@mui/material";

interface MultiSelectFilterProps {
    value: string[];
    options: { label: string; value: string }[];
    onChange: (value: string[]) => void;
}

export function MultiSelectFilter({ value, options, onChange }: MultiSelectFilterProps) {
    return (
        <Select
            multiple
            variant="outlined"
            size="small"
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value as string[])}
            input={<OutlinedInput />}
            renderValue={(selected) => selected.join(", ")}
        >
            {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                    <Checkbox checked={value.includes(opt.value)} />
                    <ListItemText primary={opt.label} />
                </MenuItem>
            ))}
        </Select>
    );
}
