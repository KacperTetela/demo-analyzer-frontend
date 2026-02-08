import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './DemoDetails.module.css';
import { ArrowLeft, Map, Calendar, Server } from 'lucide-react';
import { clsx } from 'clsx';

const DemoDetails = () => {
    const { demId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/api/dem/${demId}/details`);
                setDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch demo details", error);
            } finally {
                setLoading(false);
            }
        };

        if (demId) {
            fetchDetails();
        }
    }, [demId]);

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <div className="spinner"></div>
                <p>Ładowanie szczegółów meczu...</p>
            </div>
        );
    }

    if (!details) {
        return (
            <div className={styles.container}>
                <button onClick={() => navigate('/demohistory')} className={styles.backBtn}>
                    <ArrowLeft size={18} /> Powrót
                </button>
                <div className={styles.errorState}>Nie znaleziono szczegółów dla tego meczu.</div>
            </div>
        );
    }

    const { teamA, teamB, mapName, serverName, createdAt, sideWins, playerStats } = details;

    // 1. LOGIKA MAPOWANIA DRUŻYN
    const getTeamPlayerNames = (teamObj) => {
        if (!teamObj) return [];
        return Object.keys(teamObj)
            .filter(key => key.startsWith('player'))
            .map(key => teamObj[key]);
    };

    const teamANames = getTeamPlayerNames(teamA);
    const teamBNames = getTeamPlayerNames(teamB);

    const teamAStats = playerStats.filter(p => teamANames.includes(p.playerName));
    const teamBStats = playerStats.filter(p => teamBNames.includes(p.playerName));

    // Force standard Team names as requested
    const teamAName = "Team A";
    const teamBName = "Team B";

    // Capitalize map name helper
    const formatMapName = (name) => {
        if (!name) return 'Unknown Map';
        const cleanName = name.replace('de_', '');
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    };

    const getSideWinsText = (sideData) => {
        if (!sideData) return '';
        return `(CT: ${sideData.ctWins} / T: ${sideData.tWins})`;
    };

    const renderStatsTable = (stats) => (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: '25%' }}>Gracz</th>
                        <th>Kills</th>
                        <th>Deaths</th>
                        <th>Rating</th>
                        <th>ADR</th>
                        <th>KAST</th>
                        <th>Entry (K)</th>
                        <th>Clutch</th>
                        <th>Trade</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((player, idx) => (
                        <tr key={player.playerName || idx}>
                            <td className={styles.playerName}>{player.playerName}</td>
                            <td>{player.kills}</td>
                            <td>{player.deaths}</td>
                            <td className={player.rating >= 1.0 ? styles.winColor : styles.lossColor} style={{ fontWeight: 'bold' }}>
                                {player.rating?.toFixed(2)}
                            </td>
                            <td>{player.adr?.toFixed(1)}</td>
                            <td>{player.kast?.toFixed(0)}%</td>
                            <td>{player.entryKills}</td>
                            <td>{player.clutchesWon}</td>
                            <td>{player.totalTrades}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => navigate('/demohistory')} className={styles.backBtn}>
                    <ArrowLeft size={18} /> Powrót do historii
                </button>

                <div className={styles.titleRow}>
                    <h1>{formatMapName(mapName)}</h1>
                    <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                            <Map size={16} />
                            <span>{formatMapName(mapName)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Server size={16} />
                            <span>{serverName}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Calendar size={16} />
                            <span>{new Date(createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className={styles.statsSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.accentBlock}></div>
                    <h2>Statystyki Graczy</h2>
                    <div className={styles.decorativeLine}></div>
                </div>
                <div className={styles.splitTableContainer}>
                    <div className={styles.teamColumn}>
                        <div className={styles.teamColumnHeader}>
                            <span>{teamAName}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                                {getSideWinsText(sideWins?.[0])}
                            </span>
                        </div>
                        {renderStatsTable(teamAStats)}
                    </div>
                    <div className={styles.teamColumn}>
                        <div className={styles.teamColumnHeader}>
                            <span>{teamBName}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                                {getSideWinsText(sideWins?.[1])}
                            </span>
                        </div>
                        {renderStatsTable(teamBStats)}
                    </div>
                </div>
            </div>

            {/* Key Stats Section (Trivia) */}
            <div className={styles.keyStatsSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.accentBlock}></div>
                    <h2>Najlepsze Wyniki Meczu</h2>
                    <div className={styles.decorativeLine}></div>
                </div>
                <div className={styles.statsGrid}>
                    <StatCard
                        label="Top Fragger"
                        stat={getBestStat(playerStats, 'kills')}
                        valueLabel="Kills"
                    />
                    <StatCard
                        label="Najlepszy K/D"
                        stat={getBestStat(playerStats, 'kdRatio', (p) => p.kills / (p.deaths || 1))}
                        valueFormatter={(v) => v.toFixed(2)}
                    />
                    <StatCard
                        label="Najwyższy Rating"
                        stat={getBestStat(playerStats, 'rating')}
                        valueFormatter={(v) => v.toFixed(2)}
                    />
                    <StatCard
                        label="Największy ADR"
                        stat={getBestStat(playerStats, 'adr')}
                        valueFormatter={(v) => v.toFixed(1)}
                    />
                    <StatCard
                        label="Entry Fragger"
                        stat={getBestStat(playerStats, 'entryKills')}
                        valueLabel="Entries"
                    />
                    <StatCard
                        label="Clutch Minister"
                        stat={getBestStat(playerStats, 'clutchesWon')}
                        valueLabel="Clutches"
                    />
                    <StatCard
                        label="Support (Trades)"
                        stat={getBestStat(playerStats, 'totalTrades')}
                        valueLabel="Trades"
                    />
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ label, stat, valueLabel, valueFormatter }) => {
    if (!stat) return null;
    const { player, value } = stat;

    // If value is 0, maybe don't show or show differently? For now show all.
    // Actually for things like clutches, if max is 0, maybe skip?
    if (value === 0 && label !== 'K/D' && label !== 'Rating') return null;

    return (
        <div className={styles.statCard}>
            <div className={styles.statLabel}>{label}</div>
            <div className={styles.statPlayer}>{player.playerName}</div>
            <div className={styles.statValue}>
                {valueFormatter ? valueFormatter(value) : value}
                {valueLabel && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '4px' }}>{valueLabel}</span>}
            </div>
        </div>
    );
};

// Helper logic
const getBestStat = (stats, key, customGetter) => {
    if (!stats || stats.length === 0) return null;

    let bestPlayer = null;
    let bestValue = -Infinity;

    stats.forEach(player => {
        const value = customGetter ? customGetter(player) : player[key];
        if (value > bestValue) {
            bestValue = value;
            bestPlayer = player;
        }
    });

    return { player: bestPlayer, value: bestValue };
};

export default DemoDetails;
