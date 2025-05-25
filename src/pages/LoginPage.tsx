import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.ts';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useAuth} from '../components/AuthContext.tsx';

const API_BASE_URL = 'http://localhost:5233'; // Глобальная переменная для URL

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    if (token) {
        navigate('/');
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/User/Login`, {
                email: email,
                password: password
            });
            const token = response.data.token;
            login(token);
            navigate('/');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Неизвестная ошибка');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Авторизация</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Пароль</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary">Войти</button>
            </form>
        </div>
    );
}

export default LoginPage;
