import React, { useState } from 'react';
import PaginatedTable from '../components/PaginatedTable';
import axiosInstance from '../api/axiosInstance';
import { buildApiFilter } from '../utils/filterBuilder';

interface HeroRecord {
    id: number;
    url: string;
    urlWithOwner: string;
    wallOwner: string;
    postAuthor: string;
    dateTime: string;
    text: string;
    likes: number;
    reposts: number;
    comments: number;
    views: number;
    commentUrl?: string;
    authorName: string;
    subscribers: number;
}

const fieldLabels: Record<string, string> = {
    url: 'Ссылка на запись',
    urlWithOwner: 'Ссылка на запись с учётом владельца',
    wallOwner: 'Владелец стены',
    postAuthor: 'Автор записи',
    text: 'Текст поста',
    commentUrl: 'Ссылка на комментарий',
    authorName: 'Название автора',
    fromDateTime: 'От даты',
    toDateTime: 'До даты',
};

const HeroRecordsPage = () => {
    const [filters, setFilters] = useState({
        url: '',
        urlWithOwner: '',
        wallOwner: '',
        postAuthor: '',
        text: '',
        commentUrl: '',
        authorName: '',
        fromDateTime: '',
        toDateTime: '',
    });

    const [modalRecord, setModalRecord] = useState<HeroRecord | null>(null);
    const [pageSize, setPageSize] = useState(10);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchRecords = async (pageNumber: number, pageSize: number) => {
        const filterBody = buildApiFilter({
            filters: {
                ...Object.fromEntries(
                    Object.entries(filters).map(([key, val]) => [key, val ? val : undefined])
                )
            },
            pageNumber,
            pageSize,
        });

        const response = await axiosInstance.patch('/HeroRecords/RecordsByFilter', filterBody);
        return response.data;
    };

    const columns = [
        { header: 'ID', accessor: 'id' as keyof HeroRecord },
        {
            header: 'Ссылка', accessor: 'url' as keyof HeroRecord,
            render: (val: string) => val.slice(0, 20) + (val.length > 20 ? '...' : '')
        },
        {
            header: 'Текст', accessor: 'text' as keyof HeroRecord,
            render: (val: string) => val.slice(0, 50) + (val.length > 50 ? '...' : '')
        },
        {
            header: 'Дата', accessor: 'dateTime',
            render: (val: string) => new Date(val).toLocaleString()
        },
        { header: 'Лайки', accessor: 'likes' },
        { header: 'Репосты', accessor: 'reposts' },
        { header: 'Просмотры', accessor: 'views' },
        {
            header: 'Действия', accessor: 'actions',
            render: (_: any, row: HeroRecord) => (
                <button className="btn btn-sm btn-info" onClick={() => setModalRecord(row)}>
                    Посмотреть полностью
                </button>
            )
        }
    ];

    return (
        <div className="container mt-4">
            <h2>Записи о героях</h2>

            {/* Фильтры */}
            <div className="row mb-3">
                {Object.entries(filters).map(([key, val]) => (
                    <div className="col-md-3 mb-2" key={key}>
                        <label className="form-label">{fieldLabels[key] || key}</label>
                        <input
                            className="form-control"
                            type={key.includes('DateTime') ? 'datetime-local' : 'text'}
                            value={val}
                            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                        />
                    </div>
                ))}
                <div className="col-md-3">
                    <label className="form-label">Действие</label>
                    <button className="btn btn-primary w-100" onClick={() => setRefreshKey(prev => prev + 1)}>Поиск
                    </button>
                </div>
            </div>

            <PaginatedTable<HeroRecord>
                key={refreshKey}
                fetchFunction={(pageNumber) => fetchRecords(pageNumber, pageSize)}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
            />

            {/* Упрощённая модалка просмотра */}
            {modalRecord && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-light overflow-auto p-4" style={{ zIndex: 2000 }}>
                    <div className="bg-white p-4 rounded shadow">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Запись #{modalRecord.id}</h5>
                            <button className="btn-close" onClick={() => setModalRecord(null)}></button>
                        </div>
                        <div className="row">
                            {Object.entries(modalRecord).map(([key, value]) => (
                                <div className="mb-3" key={key}>
                                    <label className="form-label fw-bold">{key}</label>
                                    <textarea className="form-control"
                                              value={key == "text" ? value.replaceAll("\t", "\n") : String(value)} readOnly rows={2} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroRecordsPage;
