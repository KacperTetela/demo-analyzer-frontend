import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();


    const publicRoutes = ['/', '/login', '/register', '/auth'];


    const showSidebar = !publicRoutes.includes(location.pathname);


    useEffect(() => {
        if (!showSidebar) {

            document.documentElement.classList.remove('dark');
        } else {

            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [location.pathname, showSidebar]);

    return (
        <div className={styles.layoutContainer}>
            {showSidebar && <Sidebar onCollapse={setIsCollapsed} />}
            <div className={styles.mainContent}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
