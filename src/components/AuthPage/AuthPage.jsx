import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { apiPost, saveTokens } from '../../utils/api';

const AuthPage = () => {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const navigate = useNavigate();

    // Register State
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await apiPost("/api/auth/register", {
                email: registerEmail,
                password: registerPassword,
                name: registerName
            });

            saveTokens(res.accessToken, res.refreshToken);
            navigate('/senddemo');
        } catch (error) {
            alert("Rejestracja nieudana: " + error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await apiPost("/api/auth/login", {
                email: loginEmail,
                password: loginPassword
            });

            saveTokens(res.accessToken, res.refreshToken);
            navigate('/senddemo');
        } catch (error) {
            alert("Logowanie nieudane: " + error.message);
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
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    <button type="submit">Zarejestruj się</button>
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
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
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
