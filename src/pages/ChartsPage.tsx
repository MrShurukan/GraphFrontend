import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';

const classificationLabels: Record<string, string> = {
    Svo: 'Герои СВО',
    Vov: 'Герои ВОВ',
    Work: 'Герои Труда + МЧС + полиция',
    Combat: 'Герои военных конфликтов',
    Personal: 'Личный контекст',
    Unmarked: 'Не размечено'
};

const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#00C49F',
    '#FFBB28',
    '#d88e4b'
];

const ChartsPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [metricsData, setMetricsData] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    const [filters, setFilters] = useState({
        fromDateTime: '',
        toDateTime: '',
        classification: ''
    });

    const classificationOptions = [
        { label: '', value: '' },
        { label: 'Герои СВО', value: 1 },
        { label: 'Герои ВОВ', value: 2 },
        { label: 'Герои Труда + МЧС + полиция', value: 3 },
        { label: 'Герои военных конфликтов', value: 4 },
        { label: 'Личный контекст', value: 5 },
        { label: 'Не размечено', value: 6 },
        { label: 'Нет слова герой', value: 7 },
    ];

    const buildFilterBody = () => {
        const filter: any = {};
        Object.entries(filters).forEach(([key, val]) => {
            if (val) filter[key] = { value: val };
        });
        return {
            ...filter,
            pageNumber: 0,
            pageSize: 0
        };
    };

    const fetchChartData = async () => {
        setLoading(true);
        setError('');
        try {
            const [classificationRes, metricsRes] = await Promise.all([
                axiosInstance.patch('/HeroRecords/ClassificationCounts', buildFilterBody()),
                axiosInstance.patch('/HeroRecords/GetMetrics', buildFilterBody())
            ]);

            const classificationRaw = classificationRes.data;
            const classificationParsed = Object.entries(classificationRaw).map(([key, value]) => ({
                name: classificationLabels[key] || key,
                value: value as number
            }));

            setData(classificationParsed);
            setMetricsData(metricsRes.data);

        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при получении данных');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Графики классификаций</h2>

            {/* Фильтры */}
            <div className="row mb-3">
                <div className="col-md-3 mb-2">
                    <label className="form-label">От даты</label>
                    <input
                        className="form-control"
                        type="datetime-local"
                        value={filters.fromDateTime}
                        onChange={(e) => setFilters({ ...filters, fromDateTime: e.target.value })}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <label className="form-label">До даты</label>
                    <input
                        className="form-control"
                        type="datetime-local"
                        value={filters.toDateTime}
                        onChange={(e) => setFilters({ ...filters, toDateTime: e.target.value })}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <label className="form-label">Тип классификации</label>
                    <select
                        className="form-select"
                        value={filters.classification}
                        onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
                    >
                        {classificationOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="d-flex gap-3 mb-3">
                <button className="btn btn-primary" onClick={fetchChartData} disabled={loading}>
                    {loading ? 'Загрузка...' : 'Построить диаграмму'}
                </button>
                <select
                    className="form-select w-auto"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as 'pie' | 'bar')}
                >
                    <option value="pie">Круговая</option>
                    <option value="bar">Столбчатая</option>
                </select>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {data.length > 0 && chartType === 'pie' && (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}

            {data.length > 0 && chartType === 'bar' && (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {metricsData.length > 0 && (
                <>
                    <h4 className="mt-5">Коэффициент просмотров (VR)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="vr" name="Коэффициент просмотров" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>

                    <h4 className="mt-5">Коэффициент вовлеченности (ER)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="er" name="Коэффициент вовлеченности" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>

                    <h4 className="mt-5">Средний показатель</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="average" name="Средний показатель" stroke="#ffc658" />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
};

export default ChartsPage;
