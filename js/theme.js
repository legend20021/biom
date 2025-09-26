// Sistema de cambio de tema
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.chartReady = false;
        this.init();
        this.setupChartListener();
    }

    setupChartListener() {
        // Escuchar cuando el chart esté listo
        document.addEventListener('chartReady', () => {
            this.chartReady = true;

            this.updateChartThemeIfAvailable();
        });
    }

    init() {
        // Aplicar tema guardado sin intentar actualizar chart
        this.applyTheme(this.currentTheme, false);
        
        // Actualizar interfaz del botón
        this.updateThemeButton();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme, true);
        this.updateThemeButton();
        
        // Guardar preferencia
        localStorage.setItem('theme', this.currentTheme);
        
        // Mostrar notificación
        this.showThemeNotification();
    }

    applyTheme(theme, updateChart = false) {
        const htmlElement = document.documentElement;
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
        
        // Solo actualizar colores de la gráfica si se solicita explícitamente
        if (updateChart) {
            this.updateChartThemeIfAvailable();
        }
    }

    updateChartThemeIfAvailable() {
        // Verificar si la función y myChart están disponibles
        if (typeof updateChartTheme === 'function' && typeof myChart !== 'undefined' && myChart) {
            try {
                updateChartTheme();

            } catch (error) {

                // Reintentar después de un breve delay
                setTimeout(() => {
                    if (typeof myChart !== 'undefined' && myChart) {
                        try {
                            updateChartTheme();

                        } catch (retryError) {

                        }
                    }
                }, 200);
            }
        } else {

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
        if (typeof notificationManager.show === 'function') {
            notificationManager.show(`Tema ${themeName} activado`, 'success');
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
