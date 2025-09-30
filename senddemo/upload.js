// Upload functionality for demo files
class DemoUploader {
    constructor() {
        this.dropArea = document.querySelector('.drop-area');
        this.fileInput = document.getElementById('fileInput');
        this.fileSelectBtn = document.getElementById('fileSelectBtn');
        this.uploadedFiles = [];

        this.init();
    }

    init() {
        // Bind events
        this.fileSelectBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and drop events
        this.dropArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropArea.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragOver(e) {
        e.preventDefault();
        this.dropArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.dropArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.dropArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            if (file.name.toLowerCase().endsWith('.dem')) {
                return true;
            } else {
                this.showError(`Plik "${file.name}" nie jest plikiem .dem`);
                return false;
            }
        });

        validFiles.forEach(file => this.addFile(file));
        this.updateUI();
    }

    addFile(file) {
        // Sprawdź czy plik już nie jest dodany
        if (this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
            this.showError(`Plik "${file.name}" już został dodany`);
            return;
        }

        const fileInfo = {
            file: file,
            name: file.name,
            size: this.formatFileSize(file.size),
            id: Date.now() + Math.random()
        };

        this.uploadedFiles.push(fileInfo);
    }

    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
        this.updateUI();
    }

    updateUI() {
        if (this.uploadedFiles.length === 0) {
            this.showDropArea();
        } else {
            this.showFileList();
        }
    }

    showDropArea() {
        this.dropArea.innerHTML = `
            <div class="drop-content">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <p class="drop-text">Przeciągnij i upuść pliki .dem tutaj</p>
                <p class="drop-or">lub</p>
                <button id="fileSelectBtn" class="select-btn">
                    <i class="fas fa-folder-open"></i>
                    Przeglądaj pliki
                </button>
                <input type="file" id="fileInput" multiple accept=".dem" style="display: none;">
                <p class="file-info">Akceptowane formaty: .dem</p>
            </div>
        `;

        // Re-bind events
        this.fileInput = document.getElementById('fileInput');
        this.fileSelectBtn = document.getElementById('fileSelectBtn');
        this.fileSelectBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
    }

    showFileList() {
        const fileListHTML = this.uploadedFiles.map(fileInfo => `
            <div class="file-item" data-file-id="${fileInfo.id}">
                <div class="file-info-section">
                    <i class="fas fa-file-code file-icon"></i>
                    <div class="file-details">
                        <span class="file-name">${fileInfo.name}</span>
                        <span class="file-size">${fileInfo.size}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="remove-btn" onclick="uploader.removeFile(${fileInfo.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.dropArea.innerHTML = `
            <div class="uploaded-files">
                <div class="files-header">
                    <h3><i class="fas fa-check-circle"></i> Wybrane pliki (${this.uploadedFiles.length})</h3>
                    <button class="add-more-btn" onclick="uploader.showAddMore()">
                        <i class="fas fa-plus"></i> Dodaj więcej
                    </button>
                </div>
                <div class="file-list">
                    ${fileListHTML}
                </div>
                <div class="upload-actions">
                    <button class="upload-btn">
                        <i class="fas fa-upload"></i>
                        Analizuj pliki (${this.uploadedFiles.length})
                    </button>
                    <button class="clear-btn" onclick="uploader.clearAll()">
                        <i class="fas fa-trash"></i>
                        Wyczyść wszystkie
                    </button>
                </div>
            </div>
        `;
    }

    showAddMore() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.dem';
        input.style.display = 'none';
        input.addEventListener('change', (e) => this.handleFiles(e.target.files));
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    clearAll() {
        if (confirm('Czy na pewno chcesz usunąć wszystkie wybrane pliki?')) {
            this.uploadedFiles = [];
            this.updateUI();
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;

        document.body.appendChild(errorDiv);

        // Remove after 4 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 4000);
    }
}

// Initialize uploader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uploader = new DemoUploader();
});