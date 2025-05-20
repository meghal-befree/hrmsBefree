import { TextField } from "@mui/material";

interface TextFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export function TextFilter({ value, onChange }: TextFilterProps) {
    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder="Filter"
            fullWidth
            defaultValue={value}
            onBlur={(e) => onChange(e.target.value)}
        />
    );
}
