import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('jwt_token');

    if (token) {
        return <Navigate to="/senddemo" replace />;
    }

    return children;
};

export default PublicRoute;
