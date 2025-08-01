// Sistema de cambio de tema
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Aplicar tema guardado
        this.applyTheme(this.currentTheme);
        
        // Actualizar interfaz del botón
        this.updateThemeButton();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateThemeButton();
        
        // Guardar preferencia
        localStorage.setItem('theme', this.currentTheme);
        
        // Mostrar notificación
        this.showThemeNotification();
    }

    applyTheme(theme) {
        const htmlElement = document.documentElement;
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
        
        // Actualizar colores de la gráfica si existe
        if (typeof updateChartTheme === 'function') {
            // Usar setTimeout para asegurar que el DOM se haya actualizado
            setTimeout(() => {
                updateChartTheme();
            }, 50);
        }
    }

    updateThemeButton() {
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        
        if (this.currentTheme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Tema Claro';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Tema Oscuro';
        }
    }

    showThemeNotification() {
        const themeName = this.currentTheme === 'dark' ? 'oscuro' : 'claro';
        
        // Usar el sistema de notificaciones existente si está disponible
        if (typeof showNotification === 'function') {
            showNotification(`Tema ${themeName} activado`, 'success');
        } else {
            // Crear notificación simple
            const notification = document.createElement('div');
            notification.textContent = `Tema ${themeName} activado`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 9999;
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Instancia global del gestor de temas
let themeManager;

// Función global para el botón
function toggleTheme() {
    if (themeManager) {
        themeManager.toggleTheme();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    themeManager = new ThemeManager();
});

// También inicializar si el script se carga después del DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!themeManager) {
            themeManager = new ThemeManager();
        }
    });
} else {
    themeManager = new ThemeManager();
}
