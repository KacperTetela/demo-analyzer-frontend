// Nowa implementacja sidebara - generowany dynamicznie z już zastosowanymi ustawieniami

// Funkcja do pobierania ustawień z localStorage
function getSavedSettings() {
    return {
        theme: localStorage.getItem('theme') === 'dark',
        collapsed: localStorage.getItem('sidebarCollapsed') === 'true'
    };
}

// Funkcja do wykrywania aktualnej strony
function getCurrentPage() {
    const currentPath = window.location.pathname;

    if (currentPath === '/' || currentPath === '/index' || currentPath.includes('index.html')) {
        return 'home';
    } else if (currentPath.includes('/demohistory') || currentPath.includes('demohistory.html')) {
        return 'history';
    } else if (currentPath.includes('/account') || currentPath.includes('account.html')) {
        return 'account';
    } else if (currentPath.includes('/login') || currentPath.includes('login.html')) {
        return 'login';
    }
    return 'home';
}

// Funkcja do tworzenia HTML sidebara z zastosowanymi ustawieniami
function createSidebarHTML(settings, activePage) {
    const darkClass = settings.theme ? ' dark' : '';
    const collapsedClass = settings.collapsed ? ' collapsed' : '';
    const width = settings.collapsed ? '80px' : '250px';

    const collapseIcon = settings.collapsed ? 'fa-angle-double-right' : 'fa-angle-double-left';

    const menuItems = {
        home: { icon: 'fa-home', text: 'Prześlij demo', url: '/' },
        history: { icon: 'fa-chart-bar', text: 'Historia gier', url: '/demohistory' },
        account: { icon: 'fa-user', text: 'Konto', url: '/account' },
        login: { icon: 'fa-sign-in-alt', text: 'Zaloguj się', url: '/login' }
    };

    let menuHTML = '';
    Object.keys(menuItems).forEach(key => {
        const item = menuItems[key];
        const activeClass = key === activePage ? ' active' : '';
        if (key !== 'login' && key !== 'account') { // Nie dodajemy login ani account do głównego menu
            menuHTML += `<div class="menu-item${activeClass}" data-page="${key}"><i class="fas ${item.icon}"></i><span>${item.text}</span></div>`;
        }
    });

    const bottomMenuHTML = `
        <div class="menu-item${activePage === 'login' ? ' active' : ''}" data-page="login"><i class="fas fa-sign-in-alt"></i><span>Zaloguj się</span></div>
        <div class="menu-item${activePage === 'account' ? ' active' : ''}" data-page="account"><i class="fas fa-user"></i><span>Konto</span></div>
        <div class="menu-item"><i class="fas fa-sign-out-alt"></i><span>Wyloguj się</span></div>
    `;

    return `
        <div class="sidebar${darkClass}${collapsedClass}" id="sidebar" style="width: ${width};">
            <div>
                <div class="header">
                    <img src="/sidebar/user.png" alt="usuario">
                    <div class="info">
                        <strong>Kacper</strong><br>
                        v0.1.0
                    </div>
                </div>
                <div class="menu">
                    ${menuHTML}
                </div>
            </div>
            <div class="bottom">
                ${bottomMenuHTML}
                <div class="toggle-theme">
                    <i class="fas fa-moon"></i><span>Tryb nocny</span>
                    <label class="switch">
                        <input type="checkbox" id="theme-toggle"${settings.theme ? ' checked' : ''}>
                    </label>
                </div>
                <div class="toggle-sidebar">
                    <i class="fas ${collapseIcon}" id="collapse-icon"></i><span>Zwiń</span>
                </div>
            </div>
        </div>
    `;
}

// Funkcja do dodawania event listenerów
function attachEventListeners() {
    const toggleTheme = document.getElementById('theme-toggle');
    const collapseBtn = document.querySelector('.toggle-sidebar');
    const collapseIcon = document.getElementById('collapse-icon');
    const sidebar = document.getElementById('sidebar');

    // Menu navigation
    document.querySelectorAll('.menu-item[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            const urls = {
                home: '/',
                history: '/demohistory',
                account: '/account',
                login: '/login'
            };
            if (urls[page]) {
                window.location.href = urls[page];
            }
        });
    });

    // Theme toggle
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

            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Sidebar collapse toggle
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');

            // Zmień szerokość z animacją (jeśli animacje są włączone)
            if (sidebar.classList.contains('animations-enabled')) {
                sidebar.style.width = isCollapsed ? '80px' : '250px';
            } else {
                // Bez animacji (podczas inicjalizacji)
                sidebar.style.width = isCollapsed ? '80px' : '250px';
            }

            if (isCollapsed) {
                collapseIcon.classList.remove('fa-angle-double-left');
                collapseIcon.classList.add('fa-angle-double-right');
            } else {
                collapseIcon.classList.remove('fa-angle-double-right');
                collapseIcon.classList.add('fa-angle-double-left');
            }

            localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
        });
    }
}

// Główna funkcja inicjalizująca sidebar
function initializeSidebar() {
    const settings = getSavedSettings();
    const activePage = getCurrentPage();

    // Zastosuj motyw do dokumentu przed stworzeniem sidebara
    if (settings.theme) {
        document.documentElement.classList.add('dark');
    }

    // Stwórz HTML sidebara
    const sidebarHTML = createSidebarHTML(settings, activePage);

    // Wstaw sidebar do DOM
    const placeholder = document.getElementById('sidebar-placeholder');
    if (placeholder) {
        placeholder.innerHTML = sidebarHTML;

        // Dodaj event listenery
        attachEventListeners();

        // Włącz animacje po krótkim opóźnieniu (tylko dla przyszłych interakcji)
        setTimeout(() => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.add('animations-enabled');
            }
        }, 100);
    }
}

// Uruchom inicjalizację sidebara
initializeSidebar();