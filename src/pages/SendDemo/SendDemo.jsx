import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './SendDemo.module.css';
import { Upload, X, CheckCircle, FileCode, AlertCircle, Loader } from 'lucide-react';

const SendDemo = () => {
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processed, error
    const [statusMessage, setStatusMessage] = useState('');
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        if (!selectedFile.name.toLowerCase().endsWith('.dem')) {
            alert('Proszę wybrać plik z rozszerzeniem .dem');
            return;
        }
        setFile(selectedFile);
        setUploadStatus('idle');
        setStatusMessage('');
    };

    const removeFile = () => {
        setFile(null);
        setUploadStatus('idle');
        setStatusMessage('');
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploadStatus('uploading');
        setStatusMessage('Przetwarzanie dema...'); // Per user request

        const formData = new FormData();
        formData.append('file', file);

        try {
            // POST /api/dem/upload
            // Do NOT set Content-Type manually for FormData; axios/browser does it with boundary
            const response = await api.post('/api/dem/upload', formData);

            // Assuming success 200 OK means processed
            setUploadStatus('processed');
            setStatusMessage('Plik Dem jest w trakcie analizy');

            // Redirect to history immediately on success
            setTimeout(() => {
                navigate('/demohistory');
            }, 1000);

        } catch (error) {
            console.error(error);
            setUploadStatus('error');
            const errorMsg = error.response?.data?.message || error.message || 'Wystąpił błąd podczas przesyłania.';
            setStatusMessage(`Błąd: ${errorMsg}`);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.welcomeMessage}>
                <h1>Prześlij Demo</h1>
                <p>Prześlij plik .dem do analizy (tylko jeden plik jednocześnie)</p>
            </div>

            <div className={styles.uploadCard}>
                {!file ? (
                    <form
                        className={`${styles.dropArea} ${dragActive ? styles.dragover : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onSubmit={(e) => e.preventDefault()}
                        onClick={onButtonClick}
                    >
                        <Upload size={48} className={styles.uploadIcon} />
                        <div className={styles.dropText}>Przeciągnij i upuść plik .dem tutaj</div>
                        <div className={styles.dropOr}>lub kliknij, aby wybrać</div>
                        <div className={styles.fileInfo}>Maksymalny rozmiar: 1GB</div>
                    </form>
                ) : (
                        <div className={styles.filePreview}>
                            <div className={styles.fileCard}>
                                <FileCode size={32} className={styles.fileIcon} />
                                <div className={styles.fileDetails}>
                                    <span className={styles.fileName}>{file.name}</span>
                                    <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                                </div>
                                {uploadStatus === 'idle' && (
                                    <button type="button" onClick={removeFile} className={styles.removeBtn}>
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {uploadStatus === 'idle' && (
                                <button onClick={handleUpload} className={styles.uploadBtn}>
                                    <Upload size={20} />
                                    Rozpocznij Analizę
                                </button>
                            )}

                            {uploadStatus === 'uploading' && (
                                <div className={styles.statusContainer}>
                                    <Loader size={24} className={styles.spinner} />
                                    <span>{statusMessage}</span>
                                </div>
                            )}

                            {uploadStatus === 'processed' && (
                                <div className={`${styles.statusContainer} ${styles.success}`}>
                                    <CheckCircle size={24} />
                                    <span>{statusMessage}</span>
                                </div>
                            )}

                            {uploadStatus === 'error' && (
                                <div className={`${styles.statusContainer} ${styles.error}`}>
                                    <AlertCircle size={24} />
                                    <span>{statusMessage}</span>
                                    <button onClick={() => setUploadStatus('idle')} className={styles.retryBtn}>Spróbuj ponownie</button>
                                </div>
                            )}
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    id="fileInput"
                    accept=".dem"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default SendDemo;
