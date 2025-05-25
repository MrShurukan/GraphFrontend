import React, { useEffect, useState } from 'react';

interface PaginatedResponse<T> {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface Column<T> {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
}

interface PaginatedTableProps<T> {
    fetchFunction: (pageNumber: number, pageSize: number) => Promise<PaginatedResponse<T>>;
    columns: Column<T>[];
    pageSize?: number;
}

function PaginatedTable<T>({ fetchFunction, columns, pageSize = 10 }: PaginatedTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchFunction(page, pageSize).then((res) => {
            setData(res.items);
            setTotalPages(res.totalPages);
        });
    }, [page]);

    return (
        <div className="table-responsive">
            <table className="table table-bordered mt-3">
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.accessor.toString()}>{col.header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col) => (
                            <td key={col.accessor.toString()}>
                                {col.render
                                    ? col.render((row as any)[col.accessor], row)
                                    : String(row[col.accessor])}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center">
                <button
                    className="btn btn-secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Назад
                </button>
                <span>Страница {page} из {totalPages}</span>
                <button
                    className="btn btn-secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Вперёд
                </button>
            </div>
        </div>
    );
}

export default PaginatedTable;