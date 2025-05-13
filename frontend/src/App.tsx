import AppRoutes from '../router/Routes.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <>
            <AppRoutes />
            <ToastContainer />
        </>
    );
};

export default App;
