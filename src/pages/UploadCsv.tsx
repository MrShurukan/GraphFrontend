import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const UploadCsvPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [importedCount, setImportedCount] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        setError('');
        setImportedCount(null);

        if (!file) {
            setError('Выберите файл');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axiosInstance.post('/HeroRecords/UploadCsv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImportedCount(response.data.imported || response.data.imported);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при загрузке файла');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Загрузка CSV</h2>

            <div className="mb-3">
                <input
                    type="file"
                    className="form-control"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </div>

            <button className="btn btn-primary mb-3" onClick={handleUpload} disabled={loading}>
                {loading ? 'Загрузка...' : 'Загрузить'}
            </button>

            {error && <div className="alert alert-danger">{error}</div>}
            {importedCount !== null && (
                <div className="alert alert-success">Выгружено {importedCount} новых записей</div>
            )}
        </div>
    );
};

export default UploadCsvPage;
