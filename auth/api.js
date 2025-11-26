async function apiPost(url, body, authorized = false) {
    const headers = { "Content-Type": "application/json" };

    if (authorized) {
        const token = getAccessToken();
        if (token) headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        console.error("API error:", await res.text());
        throw new Error("API returned error " + res.status);
    }

    return res.json();
}

async function refreshAccessToken() {
    try {
        const res = await apiPost(
            "http://localhost:8080/api/auth/refresh",
            { refreshToken: getRefreshToken() }
        );

        saveTokens(res.accessToken, res.refreshToken);
        return true;
    } catch (e) {
        console.error("Refresh failed", e);
        return false;
    }
}

async function callProtectedApi() {
    try {
        return await apiPost(
            "http://localhost:8080/api/protected-endpoint",
            {},
            true
        );
    } catch (e) {
        // jeśli 401 → próbuj odświeżyć token
        if (e.message.includes("401")) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                return await apiPost(
                    "http://localhost:8080/api/protected-endpoint",
                    {},
                    true
                );
            }
        }

        throw e;
    }
}
