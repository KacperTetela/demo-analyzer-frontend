import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './DemoDetails.module.css';
import { ArrowLeft, Map, Calendar, Server, Clock, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

const DemoDetails = () => {
    const { demId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('rating'); // rating, adr, kast
    const [selectedSide, setSelectedSide] = useState('ALL');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // GET /api/dem/{id}/details
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

    const { teamA, teamB, mapName, serverName, createdAt, statsRating, statsAdr, statsKast } = details;

    const getTeamPlayers = (teamObj) => {
        if (!teamObj) return [];
        // Extract values that look like player names (assuming keys like player1, player2 or just matching values)
        // Simplest strategy: collect all string values from the team object that are not 'Team A' etc.
        // Or better: filter stats by checking if player.name exists in teamA values.
        return Object.values(teamObj).map(v => String(v));
    };

    const teamAPlayers = getTeamPlayers(teamA);
    const teamBPlayers = getTeamPlayers(teamB);

    const splitStats = (statsArray) => {
        if (!statsArray) return { teamAStats: [], teamBStats: [] };

        const teamAStats = [];
        const teamBStats = [];

        statsArray.forEach(player => {
            // Check if player name is in Team A's values
            if (teamAPlayers.includes(player.name)) {
                teamAStats.push(player);
            } else if (teamBPlayers.includes(player.name)) {
                teamBStats.push(player);
            } else {
                // Fallback: simple heuristic or add to both? Start with A if unknown or maybe generic list.
                // For now, let's assume valid data.
                // Optional: Check if index < 5 -> A, else B (common in CS demos if ordered)
                teamAStats.push(player); // Defaulting to A if not found might be wrong, but safer than hiding.
            }
        });

        // If one is empty and other full, maybe the matching failed. Try index based split if 10 players?
        if (teamAStats.length === 0 && teamBStats.length === 0 && statsArray.length === 10) {
            return {
                teamAStats: statsArray.slice(0, 5),
                teamBStats: statsArray.slice(5)
            }
        }

        return { teamAStats, teamBStats };
    };

    const renderTableContent = (stats, type) => {
        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Gracz</th>
                        {type === 'rating' && <><th>K/D</th><th>Rating</th></>}
                        {type === 'adr' && <><th>Dmg</th><th>ADR</th></>}
                        {type === 'kast' && <><th>KAST</th><th>%</th></>}
                    </tr>
                </thead>
                <tbody>
                    {stats.map((player, idx) => (
                        <tr key={idx}>
                            <td className={styles.playerName}>{player.name}</td>

                            {type === 'rating' && (
                                <>
                                    <td>{player.kills}/{player.deaths}</td>
                                    <td style={{ color: player.rating >= 1.0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {player.rating?.toFixed(2)}
                                    </td>
                                </>
                            )}

                            {type === 'adr' && (
                                <>
                                    <td>{player.dmg?.toFixed(0)}</td>
                                    <td>{player.adr?.toFixed(1)}</td>
                                </>
                            )}

                            {type === 'kast' && (
                                <>
                                    <td>{player.kastRounds}</td>
                                    <td>{player.kast?.toFixed(1)}%</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderStatsTable = () => {
        let currentStats = [];
        if (activeTab === 'rating') currentStats = statsRating;
        if (activeTab === 'adr') currentStats = statsAdr;
        if (activeTab === 'kast') currentStats = statsKast;

        // Filter by selected side if property exists
        const filteredStats = currentStats?.filter(stat =>
            stat.side && stat.side.toUpperCase() === selectedSide
        ) || [];

        const { teamAStats, teamBStats } = splitStats(filteredStats);

        return (
            <div className={styles.splitTableContainer}>
                <div className={styles.teamColumn}>
                    <div className={styles.teamColumnHeader}>Team A</div>
                    <div className={styles.tableContainer}>
                        {renderTableContent(teamAStats, activeTab)}
                    </div>
                </div>
                <div className={styles.teamColumn}>
                    <div className={styles.teamColumnHeader}>Team B</div>
                    <div className={styles.tableContainer}>
                        {renderTableContent(teamBStats, activeTab)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate('/demohistory')} className={styles.backBtn}>
                    <ArrowLeft size={18} /> Powrót do historii
                </button>

                <div className={styles.titleRow}>
                    <h1>{mapName?.replace('de_', '') || 'Unknown Map'}</h1>
                    <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                            <Map size={16} />
                            <span>{mapName}</span>
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

            <div className={styles.scoreboard}>
                <div className={styles.team}>
                    <div className={styles.teamName}>Team A</div>
                    <div className={styles.players}>
                        {/* Assuming teamA has specific player fields based on JSON example, 
                            but optimally it should be a list. JSON example showed: "player1": "Nick"... 
                            We'll extract values or simpler just show score for now unless we iterate keys */}
                        {Object.keys(teamA).filter(k => k.startsWith('player')).map(k => (
                            <span key={k}>{teamA[k]}</span>
                        ))}
                    </div>
                </div>

                <div className={styles.scoreContainer}>
                    <span className={clsx(styles.score, teamA.finalScore > teamB.finalScore ? styles.winColor : '')}>
                        {teamA.finalScore}
                    </span>
                    <span className={styles.scoreDivider}>:</span>
                    <span className={clsx(styles.score, teamB.finalScore > teamA.finalScore ? styles.winColor : '')}>
                        {teamB.finalScore}
                    </span>
                </div>

                <div className={styles.team}>
                    <div className={styles.teamName}>Team B</div>
                    <div className={styles.players}>
                        {Object.keys(teamB).filter(k => k.startsWith('player')).map(k => (
                            <span key={k}>{teamB[k]}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.statsSection}>
                <h2>Statystyki Graczy</h2>
                <div className={styles.filterRow}>
                    <div className={styles.tabs}>
                        <button
                            className={clsx(styles.tab, activeTab === 'rating' && styles.active)}
                            onClick={() => setActiveTab('rating')}
                        >
                            Rating
                        </button>
                        <button
                            className={clsx(styles.tab, activeTab === 'adr' && styles.active)}
                            onClick={() => setActiveTab('adr')}
                        >
                            ADR
                        </button>
                        <button
                            className={clsx(styles.tab, activeTab === 'kast' && styles.active)}
                            onClick={() => setActiveTab('kast')}
                        >
                            KAST
                        </button>
                    </div>

                    <div className={styles.sideTabs}>
                        <button
                            className={clsx(styles.sideTab, selectedSide === 'ALL' && styles.active)}
                            onClick={() => setSelectedSide('ALL')}
                        >
                            ALL
                        </button>
                        <button
                            className={clsx(styles.sideTab, selectedSide === 'CT' && styles.active)}
                            onClick={() => setSelectedSide('CT')}
                        >
                            CT
                        </button>
                        <button
                            className={clsx(styles.sideTab, selectedSide === 'T' && styles.active)}
                            onClick={() => setSelectedSide('T')}
                        >
                            T
                        </button>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    {renderStatsTable()}
                </div>
            </div>
        </div>
    );
};

export default DemoDetails;
