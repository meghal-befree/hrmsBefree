import React from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Input from '../form/Input';
import {loginUser} from "../../api/auth.ts";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get('email')?.toString() ?? '',
            password: formData.get('password')?.toString() ?? '',
        };

        try {
            const response = await loginUser(data);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            alert('Invalid email or password');
        }
    };

    const renderFromData = () =>  <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h4" align="center">Login</Typography>
            <Input label="Email" name="email" type="email" />
            <Input label="Password" name="password" type="password" />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
            </Button>
            <Typography align="center">
                Don't have an account? <Link to="/signup">Sign up</Link>
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

export default Login;
