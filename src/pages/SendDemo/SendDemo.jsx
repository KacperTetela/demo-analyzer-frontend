import React, { useState, useRef } from 'react';
import styles from './SendDemo.module.css';

const SendDemo = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
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
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const newFiles = Array.from(files).filter(file => {
            if (file.name.toLowerCase().endsWith('.dem')) {
                // Check for duplicates
                if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    alert(`Plik "${file.name}" już został dodany`);
                    return false;
                }
                return true;
            } else {
                alert(`Plik "${file.name}" nie jest plikiem .dem`);
                return false;
            }
        }).map(file => ({
            file,
            name: file.name,
            size: formatFileSize(file.size),
            id: Date.now() + Math.random()
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (id) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== id));
    };

    const clearAll = () => {
        if (window.confirm('Czy na pewno chcesz usunąć wszystkie wybrane pliki?')) {
            setUploadedFiles([]);
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
        <div>
            <div className={styles.welcomeMessage}>
                <h1>Prześlij Demo</h1>
                <p>Przesyłaj pliki .dem do analizy</p>
            </div>

            <form
                className={`${styles.dropArea} ${dragActive ? styles.dragover : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onSubmit={(e) => e.preventDefault()}
            >
                {uploadedFiles.length === 0 ? (
                    <div className={styles.dropContent}>
                        <i className={`fas fa-cloud-upload-alt ${styles.uploadIcon}`}></i>
                        <div className={styles.dropText}>Przeciągnij i upuść pliki .dem tutaj</div>
                        <div className={styles.dropOr}>lub</div>
                        <button className={styles.selectBtn} onClick={onButtonClick} type="button">
                            <i className="fas fa-folder-open"></i>
                            Wybierz pliki
                        </button>
                        <div className={styles.fileInfo}>Akceptowane pliki: .dem (maks. 50MB każdy)</div>
                    </div>
                ) : (
                    <div className={styles.uploadedFiles}>
                        <div className={styles.filesHeader}>
                            <h3><i className="fas fa-check-circle"></i> Wybrane pliki ({uploadedFiles.length})</h3>
                            <button className={styles.addMoreBtn} onClick={onButtonClick} type="button">
                                <i className="fas fa-plus"></i> Dodaj więcej
                            </button>
                        </div>
                        <div className={styles.fileList}>
                            {uploadedFiles.map(file => (
                                <div className={styles.fileItem} key={file.id}>
                                    <div className={styles.fileInfoSection}>
                                        <i className={`fas fa-file-code ${styles.fileIcon}`}></i>
                                        <div className={styles.fileDetails}>
                                            <span className={styles.fileName}>{file.name}</span>
                                            <span className={styles.fileSize}>{file.size}</span>
                                        </div>
                                    </div>
                                    <div className={styles.fileActions}>
                                        <button className={styles.removeBtn} onClick={() => removeFile(file.id)} type="button">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.uploadActions}>
                            <button className={styles.uploadBtn} type="button">
                                <i className="fas fa-upload"></i>
                                Analizuj pliki ({uploadedFiles.length})
                            </button>
                            <button className={styles.clearBtn} onClick={clearAll} type="button">
                                <i className="fas fa-trash"></i>
                                Wyczyść wszystkie
                            </button>
                        </div>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    id="fileInput"
                    multiple
                    accept=".dem"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                />
            </form>
        </div>
    );
};

export default SendDemo;
