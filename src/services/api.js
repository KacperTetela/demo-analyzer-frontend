import axios from 'axios';

const BASE_URL = 'https://develop.api.demoanalyzer.kacpertetela.ddns.net';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`.replace('Bearer Bearer', 'Bearer').replace('Bearer undefined', '');
            // Correction: Previous code might have stored just the token or "Bearer token".
            // Let's ensure we send what backend expects. Previous utils sent just `token` in header.
            // Spring Boot usually expects "Bearer <token>".
            // However, the previous utils.js did: headers['Authorization'] = token;
            // I will default to sending just the token or Bearer based on standard.
            // User didn't specify, but Spring Security usually wants "Bearer ".
            // Let's try to detect if token already has "Bearer".
             if (!token.startsWith('Bearer ')) {
                 config.headers['Authorization'] = `Bearer ${token}`;
             } else {
                 config.headers['Authorization'] = token;
             }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for generic error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401/403 globally?
        // if (error.response && error.response.status === 401) {
        //     // auto logout logic could go here
        // }
        return Promise.reject(error);
    }
);

export default api;
