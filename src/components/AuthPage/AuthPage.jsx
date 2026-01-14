import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import { apiPost, saveTokens } from '../../utils/api';

const AuthPage = () => {
    const [isSignUpActive, setIsSignUpActive] = useState(false);

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
            // Note: The original generic form used 'Name' input but the API request in JS mainly sent email/password.
            // I'm including name in the payload in case the backend supports it, if not it will just be ignored or can be removed.
            const res = await apiPost("http://localhost:8080/api/auth/register", {
                email: registerEmail,
                password: registerPassword,
                name: registerName
            });

            saveTokens(res.accessToken, res.refreshToken);
            window.location.href = '/index.html'; // Or use React Router navigation if available
        } catch (error) {
            alert("Rejestracja nieudana: " + error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await apiPost("http://localhost:8080/api/auth/login", {
                email: loginEmail,
                password: loginPassword
            });

            saveTokens(res.accessToken, res.refreshToken);
            window.location.href = '/index.html'; // Or use React Router navigation
        } catch (error) {
            alert("Logowanie nieudane: " + error.message);
        }
    };

    return (
        <div className={`${styles.container} ${isSignUpActive ? styles.active : ''}`} id="container">
            <div className={`${styles.formContainer} ${styles.signUp}`}>
                <form onSubmit={handleRegister}>
                    <h1>Create Account</h1>
                    <div className={styles.socialIcons}>
                        {/* Social icons can be added here if needed */}
                    </div>
                    <span>or use your email for registration</span>
                    <input
                        type="text"
                        placeholder="Name"
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
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <div className={`${styles.formContainer} ${styles.signIn}`}>
                <form onSubmit={handleLogin}>
                    <h1>Sign In</h1>
                    <div className={styles.socialIcons}>
                        {/* Social icons */}
                    </div>
                    <span>or use your email password</span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <a href="#">Forget Your Password?</a>
                    <button type="submit">Sign In</button>
                </form>
            </div>
            <div className={styles.toggleContainer}>
                <div className={styles.toggle}>
                    <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button
                            className={styles.hidden}
                            onClick={() => setIsSignUpActive(false)}
                            id="login"
                        >
                            Sign In
                        </button>
                    </div>
                    <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                        <button
                            className={styles.hidden}
                            onClick={() => setIsSignUpActive(true)}
                            id="register"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
