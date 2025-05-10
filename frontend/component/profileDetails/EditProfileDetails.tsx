import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, CircularProgress } from '@mui/material';
import Input from '../form/Input';
import { getUserById, updateUser } from '../../api/auth';

const EditUser = () => {
    const id  = 12;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formValues, setFormValues] = useState({ username: '', email: '', password: '' });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(Number(id));
                const user = res.data;
                setFormValues({ username: user.username, email: user.email, password: '' }); // leave password blank
            } catch (err) {
                console.error('Failed to load user', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUser(Number(id), formValues);
            navigate('/home');
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

    return (
        <Container maxWidth="sm">
            <Box mt={10}>
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <Typography variant="h4" align="center">Edit User</Typography>
                        <Input label="Name" name="username" value={formValues.username} onChange={handleChange} />
                        <Input label="Email" name="email" value={formValues.email} type="email" onChange={handleChange} />
                        <Input label="Password (leave blank to keep unchanged)" name="password" type="password" value={formValues.password} onChange={handleChange} />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Save Changes
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default EditUser;
