// Account page functionality
class AccountManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPasswordToggles();
        this.setupPasswordForm();
        this.loadUserData();
    }

    // Setup password visibility toggles
    setupPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-password');

        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetInput = document.getElementById(targetId);
                const icon = button.querySelector('i');

                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    targetInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    // Setup password change form
    setupPasswordForm() {
        const passwordForm = document.getElementById('passwordForm');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        // Real-time password validation
        newPasswordInput.addEventListener('input', () => {
            this.validatePassword(newPasswordInput.value);
        });

        confirmPasswordInput.addEventListener('input', () => {
            this.validatePasswordMatch();
        });

        // Form submission
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordChange();
        });
    }

    // Validate password strength
    validatePassword(password) {
        const requirements = document.querySelector('.password-requirements small');
        const isValid = password.length >= 8;

        if (password.length === 0) {
            requirements.textContent = 'Hasło musi mieć minimum 8 znaków';
            requirements.style.color = '#666';
        } else if (isValid) {
            requirements.textContent = '✓ Hasło spełnia wymagania';
            requirements.style.color = '#4caf50';
        } else {
            requirements.textContent = '✗ Hasło jest za krótkie (minimum 8 znaków)';
            requirements.style.color = '#f44336';
        }

        return isValid;
    }

    // Validate password match
    validatePasswordMatch() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');

        if (confirmPassword.length === 0) {
            confirmInput.style.borderColor = '#ddd';
            return false;
        }

        if (newPassword === confirmPassword) {
            confirmInput.style.borderColor = '#4caf50';
            return true;
        } else {
            confirmInput.style.borderColor = '#f44336';
            return false;
        }
    }

    // Handle password change
    async handlePasswordChange() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Remove any existing messages
        this.removeMessages();

        // Validate form
        if (!this.validatePassword(newPassword)) {
            this.showMessage('Nowe hasło nie spełnia wymagań', 'error');
            return;
        }

        if (!this.validatePasswordMatch()) {
            this.showMessage('Hasła nie są identyczne', 'error');
            return;
        }

        if (!currentPassword) {
            this.showMessage('Wprowadź obecne hasło', 'error');
            return;
        }

        // Simulate API call
        try {
            this.showLoadingState(true);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate API response (for demo purposes)
            const success = Math.random() > 0.3; // 70% success rate for demo

            if (success) {
                this.showMessage('Hasło zostało pomyślnie zmienione', 'success');
                this.clearPasswordForm();
            } else {
                this.showMessage('Obecne hasło jest nieprawidłowe', 'error');
            }
        } catch (error) {
            this.showMessage('Wystąpił błąd podczas zmiany hasła. Spróbuj ponownie.', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    // Show loading state on submit button
    showLoadingState(loading) {
        const submitBtn = document.querySelector('.change-password-btn');
        const originalText = submitBtn.innerHTML;

        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Zmieniam hasło...';
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Zmień hasło';
            submitBtn.style.opacity = '1';
        }
    }

    // Clear password form
    clearPasswordForm() {
        document.getElementById('passwordForm').reset();
        document.getElementById('confirmPassword').style.borderColor = '#ddd';
        this.validatePassword('');
    }

    // Show success/error messages
    showMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        messageDiv.innerHTML = `
            <i class="fas ${icon}"></i>
            ${text}
        `;

        const passwordSection = document.querySelector('.account-section:last-child');
        passwordSection.insertBefore(messageDiv, passwordSection.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Remove existing messages
    removeMessages() {
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(message => message.remove());
    }

    // Load user data (simulate API call)
    loadUserData() {
        // Simulate loading user data from API
        const userData = {
            email: 'jan.kowalski@example.com',
            registrationDate: '15 marca 2024'
        };

        // Update UI with user data
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('registrationDate').textContent = userData.registrationDate;
    }
}

// Initialize account manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AccountManager();
});