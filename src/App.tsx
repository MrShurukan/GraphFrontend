import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import Header from './components/Header';
import {useAuth} from './components/AuthContext.tsx';
import UsersListPage from './pages/UsersListPage.tsx';
import CreateUserPage from './pages/CreateUserPage.tsx';
import ChartsPage from './pages/ChartsPage.tsx';
import HeroRecordsPage from './pages/HeroRecordsPage.tsx';
import UploadCsv from './pages/UploadCsv.tsx';

function App() {
    const { isAuthenticated, role } = useAuth();

    return (
        <>
            <Header />
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/" element={isAuthenticated ? <HeroRecordsPage /> : <Navigate to="/login" />} />
                <Route path="/charts" element={isAuthenticated ? <ChartsPage /> : <Navigate to="/login" />} />
                <Route path="/create-user" element={isAuthenticated && role === 'Admin' ? <CreateUserPage /> : <Navigate to="/" />} />
                <Route path="/users" element={isAuthenticated && role === 'Admin' ? <UsersListPage /> : <Navigate to="/" />} />
                <Route path="/upload" element={isAuthenticated && role === 'Admin' ? <UploadCsv /> : <Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;