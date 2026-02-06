import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPatch, saveTokens } from '../../utils/api';
import styles from './Account.module.css';

const Account = () => {
    // User Data State
    const [userData, setUserData] = useState({
        email: ''
    });
    const navigate = useNavigate();

    // Form State
    const [newEmail, setNewEmail] = useState('');
    const [passwordForEmail, setPasswordForEmail] = useState(''); // New: Password for email change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Delete Account State REMOVED

    // UI State
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false); // New: Show password toggle for email change

    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Initial Data Load (Mock)
    // Initial Data Load
    useEffect(() => {
        // Pomiń mockowanie danych w tym momencie, zakładamy że są one już w aplikacji
        // lub należałoby je pobrać. Ponieważ API usera nie miało GET /me w opisie,
        // zostawiam to placeholdery lub można by pobrać z localStorage jeśli tam są.
        // Dla demo ustawiam przykładowy email jeśli pusty.
        const storedEmail = localStorage.getItem('user_email'); // Przykład
        setUserData(prev => ({
            ...prev,
            email: storedEmail || 'user@example.com'
        }));
    }, []);

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!passwordForEmail) {
            setMessage({ text: 'Podaj hasło, aby zmienić email', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const res = await apiPatch('/api/auth/email', {
                email: userData.email, // Current email
                password: passwordForEmail,
                newEmail: newEmail
            });

            if (res.accessToken && res.refreshToken) {
                saveTokens(res.accessToken, res.refreshToken);
                localStorage.setItem('user_email', newEmail);
            }
            // Aktualizuj stan lokalny
            setUserData(prev => ({ ...prev, email: newEmail }));
            setNewEmail('');
            setPasswordForEmail('');
            setMessage({ text: 'Adres email został zmieniony pomyślnie', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Błąd zmiany emaila: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    // Validation Helpers

    // Validation Helpers
    const isPasswordLengthValid = newPassword.length >= 8;
    const isPasswordMatch = newPassword === confirmPassword && confirmPassword !== '';

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!isPasswordLengthValid) {
            setMessage({ text: 'Nowe hasło nie spełnia wymagań', type: 'error' });
            return;
        }
        if (!isPasswordMatch) {
            setMessage({ text: 'Hasła nie są identyczne', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const res = await apiPatch("/api/auth/password", {
                email: userData.email, // Current email
                oldPassword: currentPassword,
                newPassword: newPassword
            });

            if (res.accessToken && res.refreshToken) {
                saveTokens(res.accessToken, res.refreshToken);
            }

            setMessage({ text: 'Hasło zostało pomyślnie zmienione', type: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ text: 'Zmiana hasła nieudana: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
            // Clear message after 5 seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    return (
        <div className={styles.accountContainer}>
            <h1>Twoje Konto</h1>

            <div className={styles.accountLayout}>
                {/* Info Section */}
                <div className={`${styles.accountSection} ${styles.accountInfoSection}`}>
                    <h2><i className="fas fa-user"></i> Informacje o koncie</h2>
                    <div className={styles.accountInfo}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <div className={styles.infoLabel}>Adres email</div>
                                <div className={styles.infoValue}>{userData.email}</div>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <div className={styles.infoLabel}>Status konta</div>
                                <div className={`${styles.infoValue} ${styles.statusActive}`}>Aktywne</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Change Section */}
                <div className={`${styles.accountSection} ${styles.emailSection}`}>
                    <h2><i className="fas fa-envelope-open-text"></i> Zmiana adresu email</h2>
                    <form onSubmit={handleEmailChange} className={styles.passwordForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="newEmail">Nowy adres email:</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type="email"
                                    id="newEmail"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Wprowadź nowy email"
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="passwordForEmail">Hasło (do potwierdzenia):</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showEmailPassword ? "text" : "password"}
                                    id="passwordForEmail"
                                    value={passwordForEmail}
                                    onChange={(e) => setPasswordForEmail(e.target.value)}
                                    placeholder="Twoje obecne hasło"
                                    required
                                />
                                <button type="button" className={styles.togglePassword} onClick={() => setShowEmailPassword(!showEmailPassword)}>
                                    <i className={`fas ${showEmailPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" className={styles.changePasswordBtn} disabled={isLoading}>
                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                            {isLoading ? ' Zmieniam...' : ' Zmień email'}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className={`${styles.accountSection} ${styles.passwordSection}`}>
                    <h2><i className="fas fa-lock"></i> Zmiana hasła</h2>

                    {message.text && (
                        <div className={`${styles.message} ${styles[message.type]}`}>
                            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="currentPassword">Obecne hasło:</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className={styles.togglePassword} onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                    <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">Nowe hasło:</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                                <button type="button" className={styles.togglePassword} onClick={() => setShowNewPassword(!showNewPassword)}>
                                    <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            <div className={styles.passwordRequirements}>
                                <small className={newPassword.length > 0 ? (isPasswordLengthValid ? styles.validReq : styles.invalidReq) : ''}>
                                    Hasło musi mieć minimum 8 znaków
                                </small>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Potwierdź nowe hasło:</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ borderColor: confirmPassword.length > 0 ? (isPasswordMatch ? '#4caf50' : '#f44336') : '' }}
                                />
                                <button type="button" className={styles.togglePassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.changePasswordBtn} disabled={isLoading}>
                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                            {isLoading ? ' Zmieniam hasło...' : ' Zmień hasło'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;
