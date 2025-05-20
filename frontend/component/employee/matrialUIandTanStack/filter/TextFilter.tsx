import { TextField } from "@mui/material";
import React from "react";

interface TextFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export function TextFilter({ value, onChange }: TextFilterProps) {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder="Filter"
            fullWidth
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => onChange(localValue)}
        />
    );
}
