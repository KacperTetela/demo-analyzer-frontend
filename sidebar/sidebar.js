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
    // Pobierz pełną ścieżkę z URL
    const currentPath = window.location.pathname;

    // Usuń klasę active ze wszystkich elementów menu (z głównego menu i z bottom)
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Ustaw klasę active na odpowiednim elemencie w zależności od strony
    // Obsługuje zarówno formaty .html jak i bez rozszerzenia (nginx deployment)
    if (currentPath === '/' || currentPath === '/index' || currentPath.includes('index.html')) {
        if (homeBtn) homeBtn.classList.add('active');
    } else if (currentPath.includes('/demohistory') || currentPath.includes('demohistory.html')) {
        if (historyBtn) historyBtn.classList.add('active');
    } else if (currentPath.includes('/account') || currentPath.includes('account.html')) {
        if (accountBtn) accountBtn.classList.add('active');
    } else if (currentPath.includes('/login') || currentPath.includes('login.html')) {
        if (loginBtn) loginBtn.classList.add('active');
    } else {
        // Jeśli nie rozpoznano strony, podświetl Home jako domyślną
        if (homeBtn) homeBtn.classList.add('active');
    }
}

// Funkcja do włączania animacji (dodaje klasę animations-enabled)
function enableAnimations() {
    if (sidebar) {
        setTimeout(() => {
            sidebar.classList.add('animations-enabled');
        }, 300);
    }
}

// Funkcja do ładowania zapisanego motywu dla sidebara (bez animacji)
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';

    if (isDark) {
        if (sidebar) sidebar.classList.add('dark');
        if (toggleTheme) toggleTheme.checked = true;
    } else {
        if (sidebar) sidebar.classList.remove('dark');
        if (toggleTheme) toggleTheme.checked = false;
    }
}

// Funkcja do ładowania zapisanego stanu sidebara (bez animacji)
function loadSavedSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

    if (isCollapsed && sidebar) {
        sidebar.classList.add('collapsed');
        if (collapseIcon) {
            collapseIcon.classList.remove('fa-angle-double-left');
            collapseIcon.classList.add('fa-angle-double-right');
        }
    }
}

// Funkcja do zapisywania motywu
function saveTheme(isDark) {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Funkcja do zapisywania stanu sidebara
function saveSidebarState(isCollapsed) {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
}

// Wywołaj funkcję po załadowaniu sidebara
setTimeout(() => {
    setActiveMenuItem();
    loadSavedTheme();
    loadSavedSidebarState();

    // Przywróć animacje po załadowaniu wszystkich ustawień (z jeszcze dłuższym opóźnieniem)
    enableAnimations();
}, 200);

// Sprawdzanie, czy elementy istnieją, przed dodaniem detektora zdarzeń
if (toggleTheme) {
    toggleTheme.addEventListener('change', () => {
        const isDark = toggleTheme.checked;

        if (isDark) {
            sidebar.classList.add('dark');
            document.documentElement.classList.add('dark');
        } else {
            sidebar.classList.remove('dark');
            document.documentElement.classList.remove('dark');
        }

        // Zapisz wybór użytkownika
        saveTheme(isDark);
    });
}

if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');

        if (isCollapsed) {
            collapseIcon.classList.remove('fa-angle-double-left');
            collapseIcon.classList.add('fa-angle-double-right');
        } else {
            collapseIcon.classList.remove('fa-angle-double-right');
            collapseIcon.classList.add('fa-angle-double-left');
        }

        // Zapisz stan sidebara
        saveSidebarState(isCollapsed);
    });
}

homeBtn.addEventListener('click', () => {
    console.log('Home button clicked');
    window.location.href = '/';
});

historyBtn.addEventListener('click', () => {
    console.log('History button clicked');
    window.location.href = '/demohistory';
});

accountBtn.addEventListener('click', () => {
    console.log('Account button clicked');
    window.location.href = '/account';
});

loginBtn.addEventListener('click', () => {
    console.log('Login button clicked');
    window.location.href = '/login';
});