import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import userIcon from '../../assets/user.png';

const Sidebar = ({ onCollapse }) => {
    const [isDark, setIsDark] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }

        const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
        setIsCollapsed(savedSidebarState);
        onCollapse(savedSidebarState);

        const token = localStorage.getItem('jwt_token');
        const email = localStorage.getItem('user_email');
        setIsLoggedIn(!!token);
        if (email) setUserEmail(email);
    }, [onCollapse, location]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', newState.toString());
        onCollapse(newState);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path ? styles.active : '';
    };

    return (
        <div className={`${styles.sidebar} ${isDark ? styles.dark : ''} ${isCollapsed ? styles.collapsed : ''}`}>
            <div>
                <div className={styles.header}>
                    <img src={userIcon} alt="usuario" />
                    <div className={styles.info}>
                        <strong>{userEmail || 'Użytkownik'}</strong>
                    </div>
                </div>
                <div className={styles.menu}>
                    {isLoggedIn && (
                        <>
                            <Link to="/senddemo" className={`${styles.menuItem} ${isActive('/senddemo')}`}>
                                <i className="fas fa-cloud-upload-alt"></i>
                                <span>Prześlij demo</span>
                            </Link>
                            <Link to="/demohistory" className={`${styles.menuItem} ${isActive('/demohistory')}`}>
                                <i className="fas fa-chart-bar"></i>
                                <span>Historia gier</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.bottom}>
                {!isLoggedIn ? (
                    <Link to="/login" className={styles.menuItem}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Zaloguj się</span>
                    </Link>
                ) : (
                    <>
                            <Link to="/account" className={`${styles.menuItem} ${isActive('/account')}`}>
                                <i className="fas fa-user-circle"></i>
                                <span>Konto</span>
                            </Link>
                            <div className={styles.menuItem} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Wyloguj się</span>
                            </div>
                    </>
                )}
                <div className={styles.toggleTheme} onClick={toggleTheme}>
                    <i className="fas fa-moon"></i>
                    <span>Tryb nocny</span>
                    <label className={styles.switch} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={isDark}
                            onChange={toggleTheme}
                        />
                    </label>
                </div>
                <div className={styles.toggleSidebar} onClick={toggleSidebar}>
                    <i className={`fas ${isCollapsed ? 'fa-angle-double-right' : 'fa-angle-double-left'}`}></i>
                    <span>Zwiń</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
