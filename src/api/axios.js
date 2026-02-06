import axios from 'axios';

const api = axios.create({
    baseURL: 'https://develop.api.demoanalyzer.kacpertetela.ddns.net',
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('jwt_token');

        if (!token) {
            token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        }

        console.log("DEBUG AXIOS (Raw Token):", token);

        if (token) {
            // Check if token is stringified JSON
            try {
                if (token.startsWith('{') || token.startsWith('"')) {
                    const parsed = JSON.parse(token);
                    token = parsed.token || parsed.accessToken || parsed.jwt || parsed;
                }
            } catch (e) {
                // Not JSON, assume raw string
            }

            config.headers['Authorization'] = token;
        } else {
            console.warn("DEBUG AXIOS - BRAK TOKENA! Użytkownik niezalogowany lub błąd zapisu.");
        }

        console.log("DEBUG AXIOS - Nagłówki:", config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
