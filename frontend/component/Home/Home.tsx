import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import './home.scss';
import {downloadUserExcel, downloadUserPdf} from "../../api/auth.ts";

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleEditProfile = () => {
        navigate('/edit');
    };

    const handlePdfDownload = async () => {
        try {
            const response = await downloadUserPdf();

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'user-profile.pdf';
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download PDF', err);
        }
    };

    const handleExcelDownload = async () => {
        try {
            const response = await downloadUserExcel(); // Call the new API endpoint
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'users.xlsx';
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download Excel file', err);
        }
    };

    const renderHeader = () => <Box
        className="headingContainer"
        height="100vh"
    >
        <Typography variant="h5">Home Page</Typography>
       <Box>
           <Button
               variant="contained"
               color="secondary"
               onClick={handleEditProfile}
               sx={{ mr: 2 }}
           >
               Add Profile
           </Button>
           <Button
               variant="contained"
               color="secondary"
               onClick={handlePdfDownload}
               sx={{ mr: 2 }}
           >
               pdF Download
           </Button>
           <Button
               variant="contained"
               color="secondary"
               onClick={handleExcelDownload}
               sx={{ mr: 2 }}
           >
               Excel Download
           </Button>
           <Button
               variant="contained"
               color="secondary"
               onClick={handleLogout}
           >
               Logout
           </Button>
       </Box>
    </Box>

    return (
        <Box className="homeContainer">
            {renderHeader()}
        </Box>
    );
};

export default Home;

