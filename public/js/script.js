// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.body.className = `${theme}-theme`;
        
        const icon = this.themeToggle.querySelector('.theme-icon');
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
        
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Password Toggle Functionality
class PasswordToggle {
    constructor() {
        this.passwordInput = document.getElementById('apiKey');
        this.toggleButton = document.getElementById('passwordToggle');
        this.eyeIcon = this.toggleButton.querySelector('.eye-icon');
        
        this.init();
    }
    
    init() {
        this.toggleButton.addEventListener('click', () => this.toggle());
    }
    
    toggle() {
        const isPassword = this.passwordInput.type === 'password';
        
        this.passwordInput.type = isPassword ? 'text' : 'password';
        this.eyeIcon.textContent = isPassword ? '🙈' : '👁️';
        
        // Focus back on input after toggle
        this.passwordInput.focus();
    }
}

// Tab Management
class TabManager {
    constructor() {
        this.tabs = document.querySelectorAll('.tab');
        this.modelTypeInput = document.getElementById('modelType');
        
        this.init();
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target));
        });
    }
    
    switchTab(clickedTab) {
        // Remove active class from all tabs
        this.tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');
        
        // Update hidden input value
        this.modelTypeInput.value = clickedTab.dataset.model;
    }
}

// Prompt Form Handler
class PromptFormHandler {
    constructor() {
        this.form = document.getElementById('promptForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.resultSection = document.getElementById('resultSection');
        this.resultContent = document.getElementById('resultContent');
        this.copyBtn = document.getElementById('copyBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.copyBtn.addEventListener('click', () => this.copyResult());
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            apiKey: formData.get('apiKey'),
            modelType: formData.get('modelType'),
            originalPrompt: formData.get('originalPrompt')
        };
        
        this.setLoading(true);
        
        try {
            const response = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showResult(result.safePrompt);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('An error occurred while generating the safe prompt. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(isLoading) {
        this.submitBtn.disabled = isLoading;
        this.submitBtn.classList.toggle('loading', isLoading);
    }
    
    showResult(safePrompt) {
        this.resultContent.textContent = safePrompt;
        this.resultSection.style.display = 'block';
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    showError(message) {
        this.resultContent.textContent = `Error: ${message}`;
        this.resultContent.style.color = '#dc3545';
        this.resultSection.style.display = 'block';
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    async copyResult() {
        try {
            await navigator.clipboard.writeText(this.resultContent.textContent);
            
            // Temporary feedback
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'Copied!';
            this.copyBtn.style.background = '#28a745';
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.style.background = '';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.resultContent.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy to Clipboard';
            }, 2000);
        }
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new PasswordToggle();
    new TabManager();
    new PromptFormHandler();
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading animation to page transitions
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0.7';
});