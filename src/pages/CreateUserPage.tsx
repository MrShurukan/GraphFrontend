import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const CreateUserPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const roleOptions = [
        { label: 'Пользователь', value: 1 },
        { label: 'Админ', value: 2 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await axiosInstance.post('/User/CreateUser', {
                email,
                password,
                role
            });
            setMessage('Пользователь успешно создан');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setRole(1);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при создании пользователя');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Создание пользователя</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
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

                <div className="mb-3">
                    <label className="form-label">Повторите пароль</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Роль</label>
                    <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(Number(e.target.value))}
                    >
                        {roleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </form>
        </div>
    );
};

export default CreateUserPage;
