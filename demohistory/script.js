// Demo History functionality
class DemoHistoryManager {
    constructor() {
        this.demos = [];
        this.filteredDemos = [];
        this.init();
    }

    init() {
        this.loadDemoData();
        this.setupEventListeners();
        this.renderDemos();
    }

    // Setup event listeners
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const mapFilter = document.getElementById('mapFilter');
        const resultFilter = document.getElementById('resultFilter');
        const refreshBtn = document.getElementById('refreshBtn');

        searchInput.addEventListener('input', () => this.filterDemos());
        mapFilter.addEventListener('change', () => this.filterDemos());
        resultFilter.addEventListener('change', () => this.filterDemos());
        refreshBtn.addEventListener('click', () => this.refreshDemos());
    }

    // Load demo data (simulate API call)
    loadDemoData() {
        // Simulate demo data - replace with actual API call
        this.demos = [
            {
                id: 1,
                filename: "match_dust2_2024_10_15.dem",
                map: "dust2",
                mapDisplayName: "Dust2",
                date: "2024-10-15",
                dateDisplay: "15 października 2024",
                score: "16:12",
                result: "win",
                resultDisplay: "Wygrana",
                kills: 24,
                deaths: 18,
                assists: 7,
                kd: 1.33,
                adr: 78.5,
                duration: "32:45",
                opponent: "Team Alpha"
            },
            {
                id: 2,
                filename: "match_mirage_2024_10_14.dem",
                map: "mirage",
                mapDisplayName: "Mirage",
                date: "2024-10-14",
                dateDisplay: "14 października 2024",
                score: "14:16",
                result: "loss",
                resultDisplay: "Porażka",
                kills: 19,
                deaths: 21,
                assists: 5,
                kd: 0.90,
                adr: 65.2,
                duration: "38:12",
                opponent: "Team Beta"
            },
            {
                id: 3,
                filename: "match_inferno_2024_10_13.dem",
                map: "inferno",
                mapDisplayName: "Inferno",
                date: "2024-10-13",
                dateDisplay: "13 października 2024",
                score: "15:15",
                result: "tie",
                resultDisplay: "Remis",
                kills: 22,
                deaths: 20,
                assists: 8,
                kd: 1.10,
                adr: 72.1,
                duration: "41:33",
                opponent: "Team Gamma"
            },
            {
                id: 4,
                filename: "match_cache_2024_10_12.dem",
                map: "cache",
                mapDisplayName: "Cache",
                date: "2024-10-12",
                dateDisplay: "12 października 2024",
                score: "16:8",
                result: "win",
                resultDisplay: "Wygrana",
                kills: 28,
                deaths: 15,
                assists: 4,
                kd: 1.87,
                adr: 89.3,
                duration: "28:21",
                opponent: "Team Delta"
            },
            {
                id: 5,
                filename: "match_overpass_2024_10_11.dem",
                map: "overpass",
                mapDisplayName: "Overpass",
                date: "2024-10-11",
                dateDisplay: "11 października 2024",
                score: "10:16",
                result: "loss",
                resultDisplay: "Porażka",
                kills: 16,
                deaths: 23,
                assists: 6,
                kd: 0.70,
                adr: 58.7,
                duration: "35:44",
                opponent: "Team Echo"
            }
        ];

        this.filteredDemos = [...this.demos];
    }

    // Filter demos based on search and filters
    filterDemos() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const mapFilter = document.getElementById('mapFilter').value;
        const resultFilter = document.getElementById('resultFilter').value;

        this.filteredDemos = this.demos.filter(demo => {
            const matchesSearch = searchTerm === '' ||
                demo.mapDisplayName.toLowerCase().includes(searchTerm) ||
                demo.dateDisplay.toLowerCase().includes(searchTerm) ||
                demo.opponent.toLowerCase().includes(searchTerm) ||
                demo.filename.toLowerCase().includes(searchTerm);

            const matchesMap = mapFilter === '' || demo.map === mapFilter;
            const matchesResult = resultFilter === '' || demo.result === resultFilter;

            return matchesSearch && matchesMap && matchesResult;
        });

        this.renderDemos();
    }

    // Refresh demos (simulate API call)
    async refreshDemos() {
        const refreshBtn = document.getElementById('refreshBtn');
        const originalHTML = refreshBtn.innerHTML;

        // Show loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Odświeżanie...';
        refreshBtn.disabled = true;

        this.showLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Reload data (in real app, this would be an API call)
            this.loadDemoData();
            this.filterDemos();

        } catch (error) {
            console.error('Error refreshing demos:', error);
        } finally {
            // Restore button state
            refreshBtn.innerHTML = originalHTML;
            refreshBtn.disabled = false;
            this.showLoading(false);
        }
    }

    // Show/hide loading state
    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        const demoList = document.getElementById('demoList');
        const emptyState = document.getElementById('emptyState');

        if (show) {
            loadingState.style.display = 'block';
            demoList.style.display = 'none';
            emptyState.style.display = 'none';
        } else {
            loadingState.style.display = 'none';
            demoList.style.display = 'grid';
        }
    }

    // Render demos list
    renderDemos() {
        const demoList = document.getElementById('demoList');
        const emptyState = document.getElementById('emptyState');

        if (this.filteredDemos.length === 0) {
            demoList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        demoList.style.display = 'grid';

        const demosHTML = this.filteredDemos.map(demo => this.createDemoHTML(demo)).join('');
        demoList.innerHTML = demosHTML;

        // Add event listeners to action buttons
        this.setupDemoActions();
    }

    // Create HTML for a single demo
    createDemoHTML(demo) {
        return `
            <div class="demo-item ${demo.result}" data-demo-id="${demo.id}">
                <div class="demo-header">
                    <div class="demo-info">
                        <div class="demo-title">
                            <div class="map-icon">${demo.mapDisplayName.charAt(0).toUpperCase()}</div>
                            ${demo.mapDisplayName} vs ${demo.opponent}
                        </div>
                        <div class="demo-date">${demo.dateDisplay}</div>
                    </div>
                    <div class="demo-score">
                        <div class="score-display ${demo.result}">${demo.score}</div>
                        <div class="result-label ${demo.result}">${demo.resultDisplay}</div>
                    </div>
                </div>
                
                <div class="demo-stats">
                    <div class="stat-item">
                        <span class="stat-value">${demo.kills}</span>
                        <span class="stat-label">Zabójstwa</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${demo.deaths}</span>
                        <span class="stat-label">Śmierci</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${demo.assists}</span>
                        <span class="stat-label">Asysty</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${demo.kd}</span>
                        <span class="stat-label">K/D</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${demo.adr}</span>
                        <span class="stat-label">ADR</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${demo.duration}</span>
                        <span class="stat-label">Czas</span>
                    </div>
                </div>
                
                <div class="demo-actions">
                    <button class="action-btn view-btn" data-action="view" data-demo-id="${demo.id}">
                        <i class="fas fa-eye"></i>
                        Analizuj
                    </button>
                    <button class="action-btn download-btn" data-action="download" data-demo-id="${demo.id}">
                        <i class="fas fa-download"></i>
                        Pobierz
                    </button>
                    <button class="action-btn delete-btn" data-action="delete" data-demo-id="${demo.id}">
                        <i class="fas fa-trash"></i>
                        Usuń
                    </button>
                </div>
            </div>
        `;
    }

    // Setup event listeners for demo actions
    setupDemoActions() {
        const actionButtons = document.querySelectorAll('.action-btn');

        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                const demoId = parseInt(e.currentTarget.getAttribute('data-demo-id'));
                this.handleDemoAction(action, demoId);
            });
        });
    }

    // Handle demo actions
    handleDemoAction(action, demoId) {
        const demo = this.demos.find(d => d.id === demoId);
        if (!demo) return;

        switch (action) {
            case 'view':
                this.viewDemo(demo);
                break;
            case 'download':
                this.downloadDemo(demo);
                break;
            case 'delete':
                this.deleteDemo(demo);
                break;
        }
    }

    // View demo analysis
    viewDemo(demo) {
        // In a real app, this would navigate to a detailed analysis page
        alert(`Otwieranie analizy demo: ${demo.filename}\nMapa: ${demo.mapDisplayName}\nWynik: ${demo.score}`);
    }

    // Download demo file
    downloadDemo(demo) {
        // In a real app, this would trigger a file download
        alert(`Pobieranie demo: ${demo.filename}`);
    }

    // Delete demo
    async deleteDemo(demo) {
        const confirmed = confirm(`Czy na pewno chcesz usunąć demo "${demo.filename}"?\nTej operacji nie można cofnąć.`);

        if (confirmed) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                // Remove demo from array
                this.demos = this.demos.filter(d => d.id !== demo.id);
                this.filterDemos();

                // Show success message
                this.showNotification(`Demo "${demo.filename}" zostało usunięte.`, 'success');

            } catch (error) {
                this.showNotification('Błąd podczas usuwania demo.', 'error');
            }
        }
    }

    // Show notification
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // Get demos data (for external use)
    getDemos() {
        return this.demos;
    }

    // Get filtered demos data (for external use)
    getFilteredDemos() {
        return this.filteredDemos;
    }
}

// Notification styles (add to CSS if needed)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    }
    
    .notification.error {
        background: #f44336;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize demo history manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.demoHistoryManager = new DemoHistoryManager();
});