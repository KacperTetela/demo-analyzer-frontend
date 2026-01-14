import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './DemoHistory.module.css';

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
        // Simulate API call
        setTimeout(() => {
            const mockData = [
                {
                    id: 1,
                    filename: "match_dust2_2024_10_15.dem",
                    map: "dust2",
                    mapDisplayName: "Dust2",
                    date: "2024-10-15",
                    dateDisplay: "15 października 2024",
                    score: "16:12",
                    result: "win",
                    resultDisplay: "Wygrana",
                    kills: 24,
                    deaths: 18,
                    assists: 7,
                    kd: 1.33,
                    adr: 78.5,
                    duration: "32:45",
                    opponent: "Team Alpha"
                },
                {
                    id: 2,
                    filename: "match_mirage_2024_10_14.dem",
                    map: "mirage",
                    mapDisplayName: "Mirage",
                    date: "2024-10-14",
                    dateDisplay: "14 października 2024",
                    score: "14:16",
                    result: "loss",
                    resultDisplay: "Porażka",
                    kills: 19,
                    deaths: 21,
                    assists: 5,
                    kd: 0.90,
                    adr: 65.2,
                    duration: "38:12",
                    opponent: "Team Beta"
                },
                {
                    id: 3,
                    filename: "match_inferno_2024_10_13.dem",
                    map: "inferno",
                    mapDisplayName: "Inferno",
                    date: "2024-10-13",
                    dateDisplay: "13 października 2024",
                    score: "15:15",
                    result: "tie",
                    resultDisplay: "Remis",
                    kills: 22,
                    deaths: 20,
                    assists: 8,
                    kd: 1.10,
                    adr: 72.1,
                    duration: "41:33",
                    opponent: "Team Gamma"
                },
                {
                    id: 4,
                    filename: "match_cache_2024_10_12.dem",
                    map: "cache",
                    mapDisplayName: "Cache",
                    date: "2024-10-12",
                    dateDisplay: "12 października 2024",
                    score: "16:8",
                    result: "win",
                    resultDisplay: "Wygrana",
                    kills: 28,
                    deaths: 15,
                    assists: 4,
                    kd: 1.87,
                    adr: 89.3,
                    duration: "28:21",
                    opponent: "Team Delta"
                },
                {
                    id: 5,
                    filename: "match_overpass_2024_10_11.dem",
                    map: "overpass",
                    mapDisplayName: "Overpass",
                    date: "2024-10-11",
                    dateDisplay: "11 października 2024",
                    score: "10:16",
                    result: "loss",
                    resultDisplay: "Porażka",
                    kills: 16,
                    deaths: 23,
                    assists: 6,
                    kd: 0.70,
                    adr: 58.7,
                    duration: "35:44",
                    opponent: "Team Echo"
                }
            ];
            setDemos(mockData);
            setLoading(false);
        }, 1000);
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
