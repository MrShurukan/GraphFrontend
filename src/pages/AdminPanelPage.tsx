import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

interface MarkResults {
    markedCount: number;
    noHeroCount: number;
    unknownCategoryCount: number;
}

const AdminPanelPage = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MarkResults | null>(null);
    const [error, setError] = useState('');

    const handleMark = async () => {
        setLoading(true);
        setResult(null);
        setError('');

        try {
            const response = await axiosInstance.post('/HeroRecords/Mark');
            const data = response.data;
            setResult({
                markedCount: data.markedCount ?? data.MarkedCount,
                noHeroCount: data.noHeroCount ?? data.NoHeroCount,
                unknownCategoryCount: data.unknownCategoryCount ?? data.UnknownCategoryCount
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при разметке данных');
        } finally {
            setLoading(false);
        }
    };

    const handleResetMark = async () => {
        setLoading(true);
        setResult(null);
        setError('');

        try {
            await axiosInstance.post('/HeroRecords/ResetMark');
            setResult({
                markedCount: 0,
                noHeroCount: 0,
                unknownCategoryCount: 0
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при сбросе разметки');
        } finally {
            setLoading(false);
        }
    };

    const handleRecalculateMetrics = async () => {
        setLoading(true);
        setResult(null);
        setError('');

        try {
            await axiosInstance.post('/HeroRecords/RecalculateMetrics');
            setResult({
                markedCount: 0,
                noHeroCount: 0,
                unknownCategoryCount: 0
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при пересчёте метрик');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Админ-панель</h2>

            <button
                className="btn btn-primary"
                onClick={handleMark}
                disabled={loading}
            >
                {loading ? 'Обработка...' : 'Произвести разметку'}
            </button>

            <br/><br/>

            <button
                className="btn btn-primary"
                onClick={handleRecalculateMetrics}
                disabled={loading}
            >
                {loading ? 'Обработка...' : 'Пересчитать метрики'}
            </button>

            <br/><br/>

            <button
                className="btn btn-danger"
                onClick={handleResetMark}
                disabled={loading}
            >
                {loading ? 'Обработка...' : 'Сбросить разметку'}
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {result && (
                <div className="alert alert-success mt-3">
                    <p>Всего размечено: {result.markedCount}</p>
                    <p>Без "Герой": {result.noHeroCount}</p>
                    <p>Неизвестная категория: {result.unknownCategoryCount}</p>
                </div>
            )}
        </div>
    );
};

export default AdminPanelPage;