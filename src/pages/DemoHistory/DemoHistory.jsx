import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './DemoHistory.module.css';
import { request } from '../../utils/api';

const DemoHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mapFilter, setMapFilter] = useState('');
    const [resultFilter, setResultFilter] = useState('');
    const [demos, setDemos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDemoData();
    }, []);



    const loadDemoData = async () => {
        setLoading(true);
        try {
            // Fetch list of demos. Endpoint assumed to be /api/dem/history based on context.
            // If this fails, we might need to adjust the endpoint.
            const response = await request('/api/dem/history', { method: 'GET' });

            // Map backend data to UI format
            // Backend: { demId, mapName, createdAt, status, ... }
            const mappedData = (Array.isArray(response) ? response : []).map(d => ({
                id: d.demId,
                filename: `demo_${d.demId}.dem`, // Backend doesn't seem to verify filename in list?
                map: d.mapName ? d.mapName.replace('de_', '') : 'unknown',
                mapDisplayName: d.mapName || 'Unknown',
                date: d.createdAt,
                dateDisplay: new Date(d.createdAt).toLocaleDateString(),
                score: d.teamA && d.teamB ? `${d.teamA.score}:${d.teamB.score}` : 'N/A',
                result: 'unknown', // Logic to determine result requires knowing user's team
                resultDisplay: d.status,
                kills: d.statsRating ? d.statsRating[0]?.kills : 0, // Heuristic mapping
                deaths: d.statsRating ? d.statsRating[0]?.deaths : 0,
                assists: d.statsRating ? d.statsRating[0]?.assists : 0,
                kd: d.statsRating ? d.statsRating[0]?.kdRatio?.toFixed(2) : '0.00',
                adr: d.statsAdr ? d.statsAdr[0]?.adr?.toFixed(1) : '0.0',
                duration: d.finishedAt ? 'Completed' : 'Processing', // Duration not explicitly in simple mock
                opponent: d.teamB ? d.teamB.name : 'Opponent'
            }));

            // Filter out those that are strictly not processed if necessary, or show them with status
            setDemos(mappedData);
        } catch (error) {
            console.error("Failed to load demo history", error);
            // Optional: set error state
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadDemoData();
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this demo?")) {
            setDemos(demos.filter(d => d.id !== id));
        }
    };

    const filteredDemos = demos.filter(demo => {
        const matchesSearch = searchTerm === '' ||
            demo.mapDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demo.dateDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demo.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demo.filename.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMap = mapFilter === '' || demo.map === mapFilter;
        const matchesResult = resultFilter === '' || demo.result === resultFilter;

        return matchesSearch && matchesMap && matchesResult;
    });

    return (
        <div className={styles.demoHistoryContainer}>
            <h1>Historia Demo</h1>
            <p className={styles.subtitle}>Twoje przeanalizowane powtórki meczów CS2</p>

            <div className={styles.filtersSection}>
                <div className={styles.searchBar}>
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Szukaj demo po nazwie mapy, dacie lub przeciwniku..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterOptions}>
                    <select
                        className={styles.filterSelect}
                        value={mapFilter}
                        onChange={(e) => setMapFilter(e.target.value)}
                    >
                        <option value="">Wszystkie mapy</option>
                        <option value="dust2">Dust2</option>
                        <option value="mirage">Mirage</option>
                        <option value="inferno">Inferno</option>
                        <option value="cache">Cache</option>
                        <option value="overpass">Overpass</option>
                    </select>
                    <select
                        className={styles.filterSelect}
                        value={resultFilter}
                        onChange={(e) => setResultFilter(e.target.value)}
                    >
                        <option value="">Wszystkie wyniki</option>
                        <option value="win">Wygrane</option>
                        <option value="loss">Przegrane</option>
                        <option value="tie">Remisy</option>
                    </select>
                    <button className={styles.refreshBtn} onClick={handleRefresh}>
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                        Odśwież
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingState}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Ładowanie demo...</p>
                </div>
            ) : filteredDemos.length === 0 ? (
                <div className={styles.emptyState}>
                    <i className="fas fa-folder-open"></i>
                    <h3>Brak demo</h3>
                    <p>Nie znaleziono żadnych demo spełniających kryteria wyszukiwania.</p>
                    <Link to="/senddemo" className={styles.uploadLink}>
                        <i className="fas fa-upload"></i>
                        Prześlij nowe demo
                    </Link>
                </div>
            ) : (
                <div className={styles.demoList}>
                    {filteredDemos.map(demo => (
                        <div key={demo.id} className={`${styles.demoItem} ${styles[demo.result]}`}>
                            <div className={styles.demoHeader}>
                                <div className={styles.demoInfo}>
                                    <div className={styles.demoTitle}>
                                        <div className={styles.mapIcon}>{demo.mapDisplayName.charAt(0).toUpperCase()}</div>
                                        {demo.mapDisplayName} vs {demo.opponent}
                                    </div>
                                    <div className={styles.demoDate}>{demo.dateDisplay}</div>
                                </div>
                                <div className={styles.demoScore}>
                                    <div className={`${styles.scoreDisplay} ${styles[demo.result]}`}>{demo.score}</div>
                                    <div className={`${styles.resultLabel} ${styles[demo.result]}`}>{demo.resultDisplay}</div>
                                </div>
                            </div>

                            <div className={styles.demoStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{demo.kills}</span>
                                    <span className={styles.statLabel}>Zabójstwa</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{demo.deaths}</span>
                                    <span className={styles.statLabel}>Śmierci</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{demo.assists}</span>
                                    <span className={styles.statLabel}>Asysty</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{demo.kd}</span>
                                    <span className={styles.statLabel}>K/D</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{demo.adr}</span>
                                    <span className={styles.statLabel}>ADR</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statValue}>{demo.duration}</span>
                                    <span className={styles.statLabel}>Czas</span>
                                </div>
                            </div>

                            <div className={styles.demoActions}>
                                <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
                                    <i className="fas fa-eye"></i>
                                    Analizuj
                                </button>
                                <button className={`${styles.actionBtn} ${styles.downloadBtn}`}>
                                    <i className="fas fa-download"></i>
                                    Pobierz
                                </button>
                                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(demo.id)}>
                                    <i className="fas fa-trash"></i>
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DemoHistory;
