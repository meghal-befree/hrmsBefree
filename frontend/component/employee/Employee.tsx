import { Box, Divider, Typography, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Enter a valid email").required("Email is required"),
});

const Employee = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
        },
        resolver: yupResolver(schema),
        mode: "onTouched",
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        reset();
    };

    return (
        <Box p={2}>
            <Typography variant="h4" align="center" mb={2}>
                Employee Form
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box mb={2}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />
                </Box>

                <Box mb={2}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                </Box>

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default Employee;
