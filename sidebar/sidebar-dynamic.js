// Dynamiczny sidebar - generowany z już zastosowanymi ustawieniami z localStorage

// Konfiguracja
const SIDEBAR_CONFIG = {
    widths: { collapsed: '80px', expanded: '250px' },
    icons: { collapse: 'fa-angle-double-left', expand: 'fa-angle-double-right' },
    pages: {
        home: { icon: 'fa-home', text: 'Prześlij demo', url: '/senddemo', mainMenu: true },
        history: { icon: 'fa-chart-bar', text: 'Historia gier', url: '/demohistory', mainMenu: true },
        login: { icon: 'fa-sign-in-alt', text: 'Zaloguj się', url: '/login', mainMenu: false },
        account: { icon: 'fa-user', text: 'Konto', url: '/account', mainMenu: false }
    }
};

// Utility functions
const getSavedSettings = () => ({
    theme: localStorage.getItem('theme') === 'dark',
    collapsed: localStorage.getItem('sidebarCollapsed') === 'true'
});

const getCurrentPage = () => {
    const path = window.location.pathname;
    const pageMap = {
        '/senddemo': 'home',
        '/demohistory': 'history',
        '/account': 'account',
        '/login': 'login'
    };

    // Sprawdź bezpośrednie dopasowania
    if (pageMap[path]) return pageMap[path];

    // Sprawdź częściowe dopasowania
    if (path.includes('senddemo')) return 'home';
    if (path.includes('demohistory')) return 'history';
    if (path.includes('account')) return 'account';
    if (path.includes('login')) return 'login';

    return 'home';
};

// HTML generation functions
const createMenuItem = (pageKey, page, isActive) =>
    `<div class="menu-item${isActive ? ' active' : ''}" data-page="${pageKey}">
        <i class="fas ${page.icon}"></i><span>${page.text}</span>
    </div>`;

const createSidebarHTML = (settings, activePage) => {
    const { theme, collapsed } = settings;
    const { widths, icons, pages } = SIDEBAR_CONFIG;

    const classes = `sidebar${theme ? ' dark' : ''}${collapsed ? ' collapsed' : ''}`;
    const width = collapsed ? widths.collapsed : widths.expanded;
    const collapseIcon = collapsed ? icons.expand : icons.collapse;

    // Generuj menu główne
    const mainMenuHTML = Object.entries(pages)
        .filter(([, page]) => page.mainMenu)
        .map(([key, page]) => createMenuItem(key, page, key === activePage))
        .join('');

    // Generuj menu dolne
    const bottomMenuHTML = Object.entries(pages)
        .filter(([, page]) => !page.mainMenu)
        .map(([key, page]) => createMenuItem(key, page, key === activePage))
        .join('') +
        `<div class="menu-item"><i class="fas fa-sign-out-alt"></i><span>Wyloguj się</span></div>`;

    return `
        <div class="${classes}" id="sidebar" style="width: ${width};">
            <div>
                <div class="header">
                    <img src="/sidebar/user.png" alt="usuario">
                    <div class="info">
                        <strong>Kacper</strong><br>
                        v0.1.0
                    </div>
                </div>
                <div class="menu">${mainMenuHTML}</div>
            </div>
            <div class="bottom">
                ${bottomMenuHTML}
                <div class="toggle-theme">
                    <i class="fas fa-moon"></i><span>Tryb nocny</span>
                    <label class="switch">
                        <input type="checkbox" id="theme-toggle"${theme ? ' checked' : ''}>
                    </label>
                </div>
                <div class="toggle-sidebar">
                    <i class="fas ${collapseIcon}" id="collapse-icon"></i><span>Zwiń</span>
                </div>
            </div>
        </div>`;
};

// Event handlers
const setupNavigation = () => {
    document.querySelectorAll('.menu-item[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            const pageKey = item.dataset.page;
            const page = SIDEBAR_CONFIG.pages[pageKey];
            if (page?.url) {
                window.location.href = page.url;
            }
        });
    });
};

const setupThemeToggle = () => {
    const toggleTheme = document.getElementById('theme-toggle');
    const sidebar = document.getElementById('sidebar');

    if (!toggleTheme) return;

    toggleTheme.addEventListener('change', () => {
        const isDark = toggleTheme.checked;

        sidebar.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
};

const setupCollapseToggle = () => {
    const collapseBtn = document.querySelector('.toggle-sidebar');
    const collapseIcon = document.getElementById('collapse-icon');
    const sidebar = document.getElementById('sidebar');

    if (!collapseBtn) return;

    collapseBtn.addEventListener('click', () => {
        const isCollapsed = !sidebar.classList.contains('collapsed');
        const { widths, icons } = SIDEBAR_CONFIG;

        sidebar.classList.toggle('collapsed', isCollapsed);
        sidebar.style.width = isCollapsed ? widths.collapsed : widths.expanded;

        collapseIcon.className = `fas ${isCollapsed ? icons.expand : icons.collapse}`;
        localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    });
};

const attachEventListeners = () => {
    setupNavigation();
    setupThemeToggle();
    setupCollapseToggle();
};

// Main initialization
const initializeSidebar = () => {
    const settings = getSavedSettings();
    const activePage = getCurrentPage();
    const placeholder = document.getElementById('sidebar-placeholder');

    if (!placeholder) return;

    // Stwórz i wstaw sidebar (motyw już zastosowany przez inline skrypt)
    placeholder.innerHTML = createSidebarHTML(settings, activePage);

    // Skonfiguruj event handlers
    attachEventListeners();

    // Włącz animacje po inicjalizacji
    setTimeout(() => {
        document.getElementById('sidebar')?.classList.add('animations-enabled');
    }, 100);
};

// Initialize sidebar
initializeSidebar();