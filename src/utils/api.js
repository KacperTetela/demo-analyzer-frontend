const BASE_URL = 'https://develop.api.demoanalyzer.kacpertetela.ddns.net';

export const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('jwt_token');
    const headers = { ...options.headers };

    if (token) {
        headers['Authorization'] = token;
    }

    const config = {
        ...options,
        headers,
    };

    if (options.body && !(options.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Attempt to parse JSON only if there is content
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

export const saveTokens = (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('jwt_token', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

export const apiPost = (endpoint, body) => {
    return request(endpoint, {
        method: 'POST',
        body
    });
};

export const apiPatch = (endpoint, body) => {
    return request(endpoint, {
        method: 'PATCH',
        body
    });
};

export const apiDelete = (endpoint) => {
    return request(endpoint, {
        method: 'DELETE'
    });
};
