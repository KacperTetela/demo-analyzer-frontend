const sidebar = document.getElementById('sidebar');
const toggleTheme = document.getElementById('theme-toggle');
const collapseBtn = document.querySelector('.toggle-sidebar');
const collapseIcon = document.getElementById('collapse-icon');

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