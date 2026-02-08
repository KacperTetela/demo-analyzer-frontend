import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './DemoHistory.module.css';
import { Search, Map, Calendar, Eye, Download, Trash2, Trophy, Frown, Minus, RotateCcw, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx'; // Make sure you have clsx installed or use template literals

const DemoHistory = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [demos, setDemos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDemoData();
    }, []);

    const loadDemoData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/dem/history');
            let data = response.data || [];

            // Sort by date desc
            data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Fetch details for COMPLETED demos to get score/players if missing
            const enrichedData = await Promise.all(data.map(async (demo) => {
                if (demo.status === 'COMPLETED' && demo.scoreA === undefined) {
                    try {
                        const detailRes = await api.get(`/api/dem/${demo.demId}/details`);
                        const detail = detailRes.data;
                        if (detail) {
                            return {
                                ...demo,
                                scoreA: detail.teamA?.finalScore,
                                scoreB: detail.teamB?.finalScore,
                                teamA: detail.teamA, // Object with players
                                teamB: detail.teamB  // Object with players
                            };
                        }
                    } catch (err) {
                        console.warn(`Failed to enrich demo ${demo.demId}`, err);
                    }
                }
                return demo;
            }));

            setDemos(enrichedData);

        } catch (error) {
            console.error("Failed to load demo history", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredDemos = demos.filter(demo => {
        const term = searchTerm.toLowerCase();
        const mapName = (demo.mapName || '').toLowerCase();
        const dateStr = new Date(demo.createdAt).toLocaleDateString().toLowerCase();
        // Backend might not send opponent/score in header, adjust if needed
        return mapName.includes(term) || dateStr.includes(term);
    });

    const getStatusIcon = (status) => {
        if (status === 'COMPLETED') return <CheckCircle size={14} />;
        if (status === 'PROCESSING' || status === 'PENDING') return <Loader size={14} className="animate-spin" />;
        return <XCircle size={14} />;
    };

    const getStatusLabel = (status) => {
        if (status === 'COMPLETED') return 'Zakończono';
        if (status === 'PROCESSING' || status === 'PENDING') return 'W toku';
        return 'Błąd';
    }

    const getMapDisplayName = (rawName) => {
        if (!rawName) return 'Unknown';
        const name = rawName.replace('de_', '');
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const getPlayers = (team) => {
        if (!team) return [];
        if (Array.isArray(team)) return team;
        // Handle object map (e.g. {player1: "Nick", ...})
        return Object.values(team).filter(v => typeof v === 'string' && !v.includes('Team'));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Historia gier</h1>
                <p>Przeglądaj wcześniej przeanalizowane dema z gry Counter-Strike 2</p>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Szukaj po mapie lub dacie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <button onClick={loadDemoData} className={styles.refreshBtn}>
                    <RotateCcw size={18} /> Odśwież
                </button>
            </div>

            {loading ? (
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Ładowanie historii...</p>
                </div>
            ) : filteredDemos.length === 0 ? (
                <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📂</div>
                        <h3>Brak historii</h3>
                        <p>Nie masz żadnych przesłanych demek. Prześlij pierwsze demo aby zobaczyć statystyki.</p>
                        <button onClick={() => navigate('/senddemo')} className={styles.ctaBtn}>
                            Prześlij Demo
                        </button>
                </div>
            ) : (
                        <div className={styles.grid}>
                            {filteredDemos.map((demo) => (
                                <div key={demo.demId} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.mapBadge}>
                                            <Map size={16} />
                                            <span>{getMapDisplayName(demo.mapName)}</span>
                                        </div>
                                        <span className={styles.date}>
                                            <Calendar size={14} />
                                            {new Date(demo.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.statusRow}>
                                            <span className={clsx(
                                                styles.statusBadge,
                                                demo.status === 'COMPLETED' && styles.statusSuccess,
                                                (demo.status === 'PROCESSING' || demo.status === 'PENDING') && styles.statusProcessing,
                                                demo.status === 'ERROR' && styles.statusError
                                            )}>
                                                {getStatusIcon(demo.status)}
                                                {getStatusLabel(demo.status)}
                                            </span>
                                        </div>

                                        {/* Display Score and Players if available */}
                                        {demo.status === 'COMPLETED' && (demo.scoreA !== undefined) && (
                                            <div className={styles.matchSummary}>
                                                {/* Team A Players */}
                                                <div className={styles.teamList}>
                                                    {getPlayers(demo.teamA).slice(0, 5).map((player, idx) => (
                                                        <div key={idx} className={styles.playerItem}>{player}</div>
                                                    ))}
                                                </div>

                                                {/* Score */}
                                                <div className={styles.scoreDisplay}>
                                                    <span className={demo.scoreA > demo.scoreB ? styles.winScore : (demo.scoreA < demo.scoreB ? styles.lossScore : '')}>{demo.scoreA}</span>
                                                    <span> : </span>
                                                    <span className={demo.scoreB > demo.scoreA ? styles.winScore : (demo.scoreB < demo.scoreA ? styles.lossScore : '')}>{demo.scoreB}</span>
                                                </div>

                                                {/* Team B Players */}
                                                <div className={clsx(styles.teamList, styles.teamListRight)}>
                                                    {getPlayers(demo.teamB).slice(0, 5).map((player, idx) => (
                                                        <div key={idx} className={styles.playerItem}>{player}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <button
                                            onClick={() => navigate(`/demo/${demo.demId}`)}
                                            className={styles.detailsBtn}
                                        >
                                            <Eye size={18} /> Szczegóły
                                        </button>
                                        {/* Future: Download button if backend provides link */}
                                    </div>
                                </div>
                            ))}
                        </div>
            )}
        </div>
    );
};

export default DemoHistory;
