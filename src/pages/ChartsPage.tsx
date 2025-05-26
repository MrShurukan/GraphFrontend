import {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    CartesianGrid
} from 'recharts';

const classificationLabels: Record<string, string> = {
    Svo: 'Герои СВО',
    Vov: 'Герои ВОВ',
    Work: 'Герои Труда',
    Police: 'МЧС + полиция',
    Combat: 'Герои военных конфликтов',
    Personal: 'Личный контекст',
    Unmarked: 'Не размечено'
};

const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#00C49F',
    '#FFBB28',
    '#d88e4b'
];

const ChartsPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    // const renderCustomizedLabel = ({
    //                                    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
    //                                }: any) => {
    //     if (percent < 0.05) return null; // не показывать мелкие
    //
    //     const RADIAN = Math.PI / 180;
    //     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    //     const x = cx + radius * Math.cos(-midAngle * RADIAN);
    //     const y = cy + radius * Math.sin(-midAngle * RADIAN);
    //
    //     return (
    //         <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central">
    //             {`${name} (${(percent * 100).toFixed(0)}%)`}
    //         </text>
    //     );
    // };

    const fetchChartData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.get('/HeroRecords/ClassificationCounts');
            const raw = response.data;
            const parsed = Object.entries(raw).map(([key, value]) => ({
                name: classificationLabels[key] || key,
                value: value as number
            }));
            setData(parsed);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при получении данных');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Графики классификаций</h2>

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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            )}

            {data.length > 0 && chartType === 'bar' && (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default ChartsPage;