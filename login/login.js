const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const registerConfirm = document.getElementById('register-confirm');
const loginConfirm = document.getElementById('login-confirm');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

registerConfirm.addEventListener('click', async () => {
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;

    try {
        const res = await apiPost(
            "http://localhost:8080/api/auth/register",
            { email, password }
        );

        saveTokens(res.accessToken, res.refreshToken);

        alert("Rejestracja udana!");
    } catch (e) {
        alert("Rejestracja nieudana: " + e.message);
    }
});


loginConfirm.addEventListener('click', async () => {
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;

    try {
        const res = await apiPost(
            "http://localhost:8080/api/auth/login",
            { email, password }
        );

        saveTokens(res.accessToken, res.refreshToken);

        alert("Logowanie udane!");
    } catch (e) {
        alert("Logowanie nieudane: " + e.message);
    }
});
