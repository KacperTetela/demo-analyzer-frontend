import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const contentStyle = {
        marginLeft: isCollapsed ? '80px' : '250px',
        transition: 'margin-left 0.3s ease',
        padding: '20px 40px',
        minHeight: '100vh',
    };

    return (
        <div>
            <Sidebar onCollapse={setIsCollapsed} />
            <div style={contentStyle} className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
