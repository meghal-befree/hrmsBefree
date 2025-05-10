import React from "react";
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

type InputProps = TextFieldProps & {
    name: string;
    label: string;
}

const Input: React.FC<InputProps> = ({ name, label, ...rest }) => {
    return (
        <TextField
            name={name}
            label={label}
            fullWidth
            required
            {...rest}
        />
    );
};

export default Input;
