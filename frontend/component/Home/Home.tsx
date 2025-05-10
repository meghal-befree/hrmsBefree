import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import './home.scss';
import UserDetailsTable from "./UserDetails.tsx";

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderHeader = () => <Box
        className="headingContainer"
        height="100vh"
    >
        <Typography variant="h5">Home Page</Typography>
        <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
        >
            Logout
        </Button>
    </Box>

    const renderTable = () => <Box className="tableContainer">
        <UserDetailsTable />
    </Box>

    return (
        <Box className="homeContainer">
            {renderHeader()}
            {renderTable()}
        </Box>
    );
};

export default Home;

