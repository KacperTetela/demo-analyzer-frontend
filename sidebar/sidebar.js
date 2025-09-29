const sidebar = document.getElementById('sidebar');
const toggleTheme = document.getElementById('theme-toggle');
const collapseBtn = document.querySelector('.toggle-sidebar');
const collapseIcon = document.getElementById('collapse-icon');
const homeBtn = document.getElementById('home-btn');
const historyBtn = document.getElementById('history-btn');
const accountBtn = document.getElementById('account-btn');
const loginBtn = document.getElementById('login-btn');

// Funkcja wykrywająca aktualną stronę i ustawiająca aktywny element menu
function setActiveMenuItem() {
    // Pobierz nazwę aktualnego pliku z URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Usuń klasę active ze wszystkich elementów menu (z głównego menu i z bottom)
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Ustaw klasę active na odpowiednim elemencie w zależności od strony
    switch (currentPage) {
        case 'index.html':
        case '':
            if (homeBtn) homeBtn.classList.add('active');
            break;
        case 'demohistory.html':
            if (historyBtn) historyBtn.classList.add('active');
            break;
        case 'account.html':
            if (accountBtn) accountBtn.classList.add('active');
            break;
        case 'login.html':
            if (loginBtn) loginBtn.classList.add('active');
            break;
        default:
            // Jeśli nie rozpoznano strony, podświetl Home jako domyślną
            if (homeBtn) homeBtn.classList.add('active');
    }
}

// Wywołaj funkcję po załadowaniu sidebara
setTimeout(setActiveMenuItem, 100);

// Sprawdzanie, czy elementy istnieją, przed dodaniem detektora zdarzeń
if (toggleTheme) {
    toggleTheme.addEventListener('change', () => {
        sidebar.classList.toggle('dark');
        document.body.classList.toggle('dark');
    });
}

if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            collapseIcon.classList.remove('fa-angle-double-left');
            collapseIcon.classList.add('fa-angle-double-right');
        } else {
            collapseIcon.classList.remove('fa-angle-double-right');
            collapseIcon.classList.add('fa-angle-double-left');
        }
    });
}

homeBtn.addEventListener('click', () => {
    console.log('Home button clicked');
    window.location.href = 'index.html';
});

historyBtn.addEventListener('click', () => {
    console.log('History button clicked');
    window.location.href = '/demohistory';
});

accountBtn.addEventListener('click', () => {
    console.log('Account button clicked');
    window.location.href = 'account.html';
});

loginBtn.addEventListener('click', () => {
    console.log('Login button clicked');
    window.location.href = 'login.html';
});