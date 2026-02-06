import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { apiPost, saveTokens } from '../../utils/api';

const AuthPage = () => {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const navigate = useNavigate();

    // Register State
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerApiError, setRegisterApiError] = useState('');

    // Password Validation State
    const [registerPasswordError, setRegisterPasswordError] = useState('');


    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginApiError, setLoginApiError] = useState('');

    const validatePassword = (password) => {
        if (password.length < 5 || password.length > 20) {
            return "Hasło musi mieć od 5 do 20 znaków.";
        }
        if (!/[a-z]/.test(password)) {
            return "Hasło musi zawierać małą literę.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Hasło musi zawierać wielką literę.";
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return "Hasło musi zawierać znak specjalny (!@#$%^&*).";
        }
        return "";
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterApiError('');

        const error = validatePassword(registerPassword);
        if (error) {
            setRegisterPasswordError(error);
            return;
        }

        try {
            const res = await apiPost("/api/auth/register", {
                email: registerEmail,
                password: registerPassword
            });

            const accessToken = res.accessToken || res.token || res.jwt;
            saveTokens(accessToken, res.refreshToken);
            localStorage.setItem('user_email', registerEmail);
            navigate('/senddemo');
        } catch (error) {
            setRegisterApiError(error.message || "Rejestracja nieudana.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginApiError('');

        try {
            const res = await apiPost("/api/auth/login", {
                email: loginEmail,
                password: loginPassword
            });

            const accessToken = res.accessToken || res.token || res.jwt;
            saveTokens(accessToken, res.refreshToken);
            localStorage.setItem('user_email', loginEmail);
            navigate('/senddemo');
        } catch (error) {
            let errorMsg = "Wystąpił błąd logowania. Spróbuj ponownie.";
            const rawError = (error.message || "").toLowerCase();

            if (rawError.includes("bad credentials") || rawError.includes("credentials are wrong") || [401, 403].includes(error.status)) {
                errorMsg = "Nieprawidłowy email lub hasło.";
            } else if (rawError.includes("locked") || rawError.includes("disabled")) {
                errorMsg = "Konto jest nieaktywne.";
            } else if (rawError.includes("network") || rawError.includes("failed to fetch")) {
                errorMsg = "Błąd połączenia z serwerem.";
            } else if (error.message) {
                // Fallback to backend message if it's something specific but not caught above, 
                // but typically we want to hide it.
                // For now, let's keep the generic one for unknown backend errors to be safe UI-wise.
            }

            setLoginApiError(errorMsg);
        }
    };

    return (
        <div className={`${styles.container} ${isSignUpActive ? styles.active : ''}`} id="container">
            <div className={`${styles.formContainer} ${styles.signUp}`}>
                <form onSubmit={handleRegister}>
                    <h1>Utwórz Konto</h1>
                    <div className={styles.socialIcons}>

                    </div>
                    <span>Wrowadź dane w celu rejestracji</span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => {
                            setRegisterEmail(e.target.value);
                            setRegisterApiError(''); // Clear error on typing
                        }}
                    />
                    {registerApiError && <span className={styles.validationError}>{registerApiError}</span>}
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={registerPassword}
                        onChange={(e) => {
                            setRegisterPassword(e.target.value);
                            setRegisterPasswordError(validatePassword(e.target.value));
                        }}
                    />
                    {registerPasswordError && <span className={styles.validationError}>{registerPasswordError}</span>}
                    <button type="submit" disabled={!!registerPasswordError}>Zarejestruj się</button>
                </form>
            </div>
            <div className={`${styles.formContainer} ${styles.signIn}`}>
                <form onSubmit={handleLogin}>
                    <h1>Zaloguj się</h1>
                    <div className={styles.socialIcons}>

                    </div>
                    <span>Wprowadź dane w celu logowania</span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => {
                            setLoginEmail(e.target.value);
                            setLoginApiError(''); // Clear error on typing
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={loginPassword}
                        onChange={(e) => {
                            setLoginPassword(e.target.value);
                            setLoginApiError(''); // Clear error on typing
                        }}
                    />
                    {loginApiError && <span className={styles.validationError}>{loginApiError}</span>}
                    <a href="#"></a>
                    <button type="submit">Zaloguj się</button>
                </form>
            </div>
            <div className={styles.toggleContainer}>
                <div className={styles.toggle}>
                    <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                        <h1>Witaj ponownie!</h1>
                        <p>Zaloguj się, aby uzyskać dostęp do swoich statystyk i panelu analiz.</p>
                        <button
                            className={styles.hidden}
                            onClick={() => setIsSignUpActive(false)}
                            id="login"
                        >
                            Zaloguj się
                        </button>
                    </div>
                    <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                        <h1>Witaj!</h1>
                        <p>Zarejestruj się, aby zacząć analizować mecze.</p>
                        <button
                            className={styles.hidden}
                            onClick={() => setIsSignUpActive(true)}
                            id="register"
                        >
                            Zarejestruj się
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
