import { useState } from 'react';
import PaginatedTable from '../components/PaginatedTable';
import axiosInstance from '../api/axiosInstance';
import { buildApiFilter } from '../utils/filterBuilder';

interface User {
    id: number;
    email: string;
    role: number;
}

const roleMap: Record<number, string> = {
    1: 'Пользователь',
    2: 'Админ',
};

const roleOptions = [
    { label: 'Пользователь', value: 1 },
    { label: 'Админ', value: 2 },
];

const UserListPage = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<number | ''>('');
    const [_, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0); // для повторного запроса
    const [error, setError] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const pageSize = 10;

    const fetchUsers = async (pageNumber: number, pageSize: number) => {
        setError('');
        const filterBody = buildApiFilter({
            filters: {
                email: email ? email : undefined,
                role: role !== '' ? role : undefined,
            },
            pageNumber,
            pageSize,
        });

        const response = await axiosInstance.patch('/User/UsersByFilter', filterBody);
        return response.data;
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/User/User?id=${id}`);
            setConfirmDeleteId(null);
            setRefreshKey(prev => prev + 1); // триггер обновления
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка удаления');
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' as keyof User },
        { header: 'Email', accessor: 'email' as keyof User },
        {
            header: 'Роль',
            accessor: 'role' as keyof User,
            render: (value: number) => roleMap[value] || '—'
        },
        {
            header: 'Действия',
            accessor: 'action' as keyof User,
            render: (_: any, row: User) => (
                <button className="btn btn-sm btn-danger" onClick={() => setConfirmDeleteId(row.id)}>
                    Удалить
                </button>
            )
        }
    ];

    return (
        <div className="container mt-4">
            <h2>Список пользователей</h2>

            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value === '' ? '' : Number(e.target.value))}
                    >
                        <option value="">Все роли</option>
                        {roleOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <button className="btn btn-primary w-100" onClick={() => setRefreshKey(prev => prev + 1)}>
                        Поиск
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <PaginatedTable<User>
                key={refreshKey} // перерисовать таблицу при изменении фильтра
                fetchFunction={(pageNumber) => {
                    setPage(pageNumber);
                    return fetchUsers(pageNumber, pageSize);
                }}
                columns={columns}
                pageSize={pageSize}
            />

            {/* Модальное окно подтверждения */}
            {confirmDeleteId !== null && (
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Подтвердите удаление</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDeleteId(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Вы уверены, что хотите удалить пользователя #{confirmDeleteId}?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteId!)}>
                                    Удалить
                                </button>
                                <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserListPage;