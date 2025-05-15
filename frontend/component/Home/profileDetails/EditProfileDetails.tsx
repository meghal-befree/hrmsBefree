import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Button,
    Typography,
    Box,
    CircularProgress,
    InputLabel,
    Input as MuiInput
} from '@mui/material';
import Input from '../../form/Input';
import { getUserById, updateUser } from '../../../api/auth';
import { getLocalStorageUserId } from '../../utils/util.ts';

const EditUser = () => {
    const { id } = useParams(); // only exists if admin accesses /edit/:id
    const userId = id ?? getLocalStorageUserId();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formValues, setFormValues] = useState({ username: '', email: '' });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(Number(userId));
                const user = res.data;
                setFormValues({ username: user.username, email: user.email });
            } catch (err) {
                console.error('Failed to load user', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', formValues.username);
        formData.append('email', formValues.email);
        if (file) {
            formData.append('image', file);
        }

        try {
            await updateUser(Number(userId), formData);
            navigate('/');
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    if (loading) return <Box textAlign="center"><CircularProgress /></Box>;

    return (
        <Container maxWidth="sm">
            <Box mt={10}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Box display="flex" flexDirection="column" gap={3}>
                        <Typography variant="h4" align="center">Edit User</Typography>
                        <Input label="Name" name="username" value={formValues.username} onChange={handleChange} />
                        <Input label="Email" name="email" value={formValues.email} type="email" onChange={handleChange} />

                        <InputLabel htmlFor="image">Profile Image</InputLabel>
                        <MuiInput id="image" type="file" name="image" inputProps={{ accept: 'image/*' }} onChange={handleFileChange} />

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
