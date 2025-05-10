import React from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Input from '../form/Input';
import {signupUser} from "../../api/auth.ts";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            username: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        try {
            const response = await signupUser(data);
            console.log('Signup success:', response.data);
            form.reset();
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    const renderFromData = () =>  <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h4" align="center">Sign Up</Typography>
            <Input label="Name" name="name" />
            <Input label="Email" name="email" type="email" />
            <Input label="Password" name="password" type="password" />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign Up
            </Button>
            <Typography align="center">
                Already have an account? <Link to="/">Login</Link>
            </Typography>
        </Box>
    </form>

    return (
        <Container maxWidth="sm">
            <Box mt={10}>
                {renderFromData()}
            </Box>
        </Container>
    );
};

export default Signup;
