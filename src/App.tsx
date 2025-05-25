import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import axiosInstance from './api/axiosInstance';
import Header from './components/Header';
import {useAuth} from './components/AuthContext.tsx';
import UsersListPage from './pages/UsersListPage.tsx';
import CreateUserPage from './pages/CreateUserPage.tsx';
import ChartsPage from './pages/ChartsPage.tsx';
import HeroRecordsPage from './pages/HeroRecordsPage.tsx';
import UploadCsv from './pages/UploadCsv.tsx';

const API_BASE_URL = 'http://localhost:5233';

const HomePage = () => {
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        axiosInstance.get(`${API_BASE_URL}/User/TestAuth`)
            .then(res => setText(res.data))
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError('Неизвестная ошибка');
                }
            });
    }, []);

    return (
        <div className="container mt-4">
            <h1>Домашняя страница</h1>
            {error ? <div className="alert alert-danger">{error}</div> : <p>{text}</p>}
        </div>
    );
};

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