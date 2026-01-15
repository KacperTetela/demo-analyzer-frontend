import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>Demo Analyzer</h1>
                <p className={styles.subtitle}>
                    Deep insights into your CS2 matches. Advanced analytics, detailed stats, and performance tracking.
                </p>
                <div className={styles.ctaContainer}>
                    <Link to="/login" className={`${styles.ctaButton} ${styles.primaryBtn}`}>
                        Zaloguj się
                    </Link>
                    <Link to="/login" className={`${styles.ctaButton} ${styles.secondaryBtn}`}>
                        Zarejestruj się
                    </Link>
                </div>
            </section>

            {/* What is this Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Czym jest Demo Analyzer?</h2>
                <div className={styles.featureGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3 className={styles.cardTitle}>Zaawansowane Statystyki</h3>
                        <p>Odkryj dane, których nie znajdziesz w grze. Analizuj celność, rzuty granatami, pozycjonowanie i wiele więcej.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <i className="fas fa-history"></i>
                        </div>
                        <h3 className={styles.cardTitle}>Historia Meczów</h3>
                        <p>Przechowuj historię swoich gier i śledź postępy w czasie. Wróć do dowolnego meczu, aby zobaczyć szczegóły.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <i className="fas fa-crosshairs"></i>
                        </div>
                        <h3 className={styles.cardTitle}>Analiza Gry</h3>
                        <p>Zrozum swoje błędy i dowiedz się, jak grać lepiej. Nasze narzędzie pomoże Ci wejść na wyższy poziom.</p>
                    </div>
                </div>
            </section>

            {/* What are Demos Section */}
            <section className={styles.section} style={{ background: 'rgba(0,0,0,0.02)' }}>
                <h2 className={styles.sectionTitle}>Czym są Dema?</h2>
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Demo to plik z rozszerzeniem <strong>.dem</strong>, który zawiera pełne nagranie meczu CS2.
                        Dzięki temu plikowi możemy odtworzyć każdy ruch, strzał i wydarzenie z gry z perspektywy każdego gracza.
                    </p>
                    <div className={styles.card} style={{ display: 'inline-block', textAlign: 'left' }}>
                        <h3 className={styles.cardTitle} style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', display: 'inline-block' }}>Gdzie znaleźć dema?</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                            <li style={{ marginBottom: '1rem' }}><i className="fas fa-check" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> Faceit Match Rooms</li>
                            <li style={{ marginBottom: '1rem' }}><i className="fas fa-check" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> Premier Match History</li>
                            <li><i className="fas fa-check" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> Twoja biblioteka Steam</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Jak to działa?</h2>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <h3>Pobierz Demo</h3>
                        <p>Pobierz plik .dem ze swojego ostatniego meczu.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <h3>Załóż konto</h3>
                        <p>Zarejestruj się lub zaloguj, aby uzyskać dostęp do narzędzi.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <h3>Prześlij plik</h3>
                        <p>Użyj zakładki "Prześlij demo", aby wgrać plik na serwer.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>4</div>
                        <h3>Odbierz wynik</h3>
                        <p>Otrzymaj szczegółowy raport i analizę swojego występu.</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <Link to="/login" className={`${styles.ctaButton} ${styles.primaryBtn}`}>
                        Zacznij Analizę Teraz <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
