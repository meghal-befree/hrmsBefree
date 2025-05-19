import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EmployeeTable as TanStackEmployeeTable} from "./TanStackTable/EmployeeTable.tsx";
import { EmployeeTable as MatrialUIEmployeeTable} from "./MatrialUI/EmployeeTable.tsx";
import { EmployeeTable as MatrialUIAndTanStackEmployeeTable} from "./matrialUIandTanStack/EmployeeTable.tsx";
import {Box, Divider, Paper} from "@mui/material";

const EmployeeList = () => {
    const queryClient = new QueryClient();
    return (
        <Box sx={{ width: '100%', my: 2 }} p={2}>
            <Paper  elevation={3} sx={{ adding:'10px', padding: '10px'}}>
                <h1 style={{ textAlign: 'center'}}>Material UI and Tanstack </h1>
                <QueryClientProvider client={queryClient}>
                    <MatrialUIAndTanStackEmployeeTable />
                </QueryClientProvider>
            </Paper>
            {/*<Divider sx={{ my: 2 }} />*/}
            {/*<Paper elevation={3} sx={{ adding:'10px', padding: '10px'}}>*/}
            {/*    <h1 style={{ textAlign: 'center'}}>Employee list TanStack query</h1>*/}
            {/*    <QueryClientProvider client={queryClient}>*/}
            {/*        <TanStackEmployeeTable />*/}
            {/*    </QueryClientProvider>*/}
            {/*</Paper>*/}
            {/*<Divider sx={{ my: 2 }} />*/}
            {/*<Paper  elevation={3} sx={{ adding:'10px', padding: '10px'}}>*/}
            {/*    <h1 style={{ textAlign: 'center'}}>Matrial UI </h1>*/}
            {/*    <MatrialUIEmployeeTable />*/}
            {/*</Paper>*/}
        </Box>
    )
}

export default EmployeeList;