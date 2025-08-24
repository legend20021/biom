// Sistema de modo demo
class DemoManager {
    constructor() {
        this.isDemoMode = localStorage.getItem('demoMode') === 'true' || false;
        this.init();
    }

    init() {
        // Aplicar modo demo guardado
        this.applyDemoMode(this.isDemoMode);
        
        // Actualizar interfaz del botón
        this.updateDemoButton();
    }

    toggleDemoMode() {
        // Verificar si el botón está bloqueado
        const demoBtn = document.getElementById('demoToggle');
        if (demoBtn && demoBtn.disabled) {
            return; // No hacer nada si está bloqueado
        }
        
        this.isDemoMode = !this.isDemoMode;
        this.applyDemoMode(this.isDemoMode);
        this.updateDemoButton();
        
        // Guardar preferencia
        localStorage.setItem('demoMode', this.isDemoMode);
        
        // Mostrar notificación
        this.showDemoNotification();
        
        // Reiniciar WebSocket con el nuevo modo
        this.restartWebSocket();
    }

    applyDemoMode(isDemo) {
        // Actualizar el estado global del modo demo
        if (typeof window !== 'undefined') {
            window.isDemoMode = isDemo;
        }
    }

    updateDemoButton() {
        const demoIcon = document.getElementById('demoIcon');
        const demoText = document.getElementById('demoText');
        const demoBtn = document.getElementById('demoToggle');
        
        if (this.isDemoMode) {
            demoIcon.textContent = '🧪';
            demoText.textContent = 'Demo: Activado';
            demoBtn.classList.add('active');
            this.showDemoWatermark();
        } else {
            demoIcon.textContent = '🧪';
            demoText.textContent = 'Demo: Desactivado';
            demoBtn.classList.remove('active');
            this.hideDemoWatermark();
            // Resetear valores inmediatamente cuando se desactiva el modo demo
            this.resetValuesToZero();
        }
    }



    showDemoWatermark() {
        const demoWatermark = document.getElementById('demoWatermark');
        if (demoWatermark) {
            demoWatermark.style.display = 'flex';
        }
    }

    hideDemoWatermark() {
        const demoWatermark = document.getElementById('demoWatermark');
        if (demoWatermark) {
            demoWatermark.style.display = 'none';
        }
    }



    setButtonDisabled(disabled) {
        const demoBtn = document.getElementById('demoToggle');
        if (demoBtn) {
            // No bloquear el botón si estamos en modo demo
            if (this.isDemoMode) {
                demoBtn.disabled = false;
                demoBtn.style.opacity = '1';
                demoBtn.style.cursor = 'pointer';
                demoBtn.title = '';
                return;
            }
            
            // Solo bloquear si el proceso está activo (start = true)
            const isProcessActive = typeof state !== 'undefined' && state.start === true;
            
            demoBtn.disabled = isProcessActive;
            if (isProcessActive) {
                demoBtn.style.opacity = '0.5';
                demoBtn.style.cursor = 'not-allowed';
                demoBtn.title = 'Demo: Bloqueado';
            } else {
                demoBtn.style.opacity = '1';
                demoBtn.style.cursor = 'pointer';
                demoBtn.title = '';
            }
        }
    }

    showDemoNotification() {
        const modeName = this.isDemoMode ? 'activado' : 'desactivado';
        
        // Usar el sistema de notificaciones existente si está disponible
        if (typeof showNotification === 'function') {
            showNotification(`Modo demo ${modeName}`, 'success');
        } else {
            // Crear notificación simple
            const notification = document.createElement('div');
            notification.textContent = `Modo demo ${modeName}`;
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

    restartWebSocket() {
        // Cerrar conexión WebSocket existente si hay una
        if (typeof websocket !== 'undefined' && websocket) {
            websocket.close();
        }
        
        // Reiniciar después de un delay de 1 segundo para evitar cruces de estado
        setTimeout(() => {
            if (this.isDemoMode) {
                if (typeof initWebSocketSimulated === 'function') {
                    initWebSocketSimulated();
                }
            } else {
                // Resetear valores a cero cuando se desactiva el modo demo
                this.resetValuesToZero();
                // NO iniciar WebSocket real aquí, solo resetear valores
                // El WebSocket real se maneja por la lógica inicial del websocket.js
            }
        }, 1000);
    }

    resetValuesToZero() {
        // Resetear todos los valores de sensores a cero
        if (typeof state !== 'undefined') {
            // Temperaturas
            state.temperature = 0;
            state.temperatureLix = 0;
            state.tempSetpoint = 0;
            state.tempLixSetpoint = 0;
            
            // Presión
            state.pressure = 0;
            state.pressureSetpoint = 0;
            
            // pH
            state.ph = 0;
            
            // Estados de control
            state.recirculacion = false;
            state.presion_natural = false;
            state.maceracion = false;
            state.control_temperatura = false;
            
            // Estados de proceso
            state.start = false;
            
            // Tiempo
            state.tiempo_horas = 0;
            state.tiempo_minutos = 0;
            
            // Limpiar gráficas en el estado
            state.grafica_temperatura_masa = [];
            state.grafica_temperatura_lixiviados = [];
            state.grafica_presion = [];
            state.grafica_ph = [];
            
            // Actualizar la interfaz
            this.updateUIWithZeroValues();
            
            // Actualizar temporizador
            if (typeof updateTimer === 'function') {
                updateTimer();
            }
        }
    }

    updateUIWithZeroValues() {
        // Usar la función existente de actualización de indicadores
        if (typeof updateIndicators === 'function') {
            updateIndicators();
        }
        
        // Actualizar elementos específicos que no están en updateIndicators
        const tempElements = document.querySelectorAll('.tempValue');
        tempElements.forEach(element => {
            element.textContent = '0.0';
        });

        const tempLixElements = document.querySelectorAll('.tempLixValue');
        tempLixElements.forEach(element => {
            element.textContent = '0.0';
        });

        const pressureElements = document.querySelectorAll('.pressureValue');
        pressureElements.forEach(element => {
            element.textContent = '0.0';
        });

        const phElements = document.querySelectorAll('.phValue');
        phElements.forEach(element => {
            element.textContent = '0.0';
        });

        // Poner las barras de progreso en blanco
        this.resetProgressBars();
        
        // Actualizar estados de control
        this.updateControlStates(false);
        
        // Resetear tiempo de proceso a "Inactivo"
        this.resetProcessTime();
        
        // Limpiar gráficas
        this.clearCharts();
    }

    resetProgressBars() {
        // Resetear barras de progreso a 0% y color blanco
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.backgroundColor = 'transparent';
        });

        // Resetear barras de temperatura
        const tempProgressBars = document.querySelectorAll('.temp-progress, .tempLix-progress');
        tempProgressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.backgroundColor = 'transparent';
        });

        // Resetear barra de presión
        const pressureProgressBars = document.querySelectorAll('.pressure-progress');
        pressureProgressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.backgroundColor = 'transparent';
        });

        // Resetear barra de pH
        const phProgressBars = document.querySelectorAll('.ph-progress');
        phProgressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.backgroundColor = 'transparent';
        });
    }

    updateControlStates(active) {
        // Actualizar indicadores de estado de control
        const controlElements = document.querySelectorAll('.status-ready');
        controlElements.forEach(element => {
            if (active) {
                element.classList.add('active');
                element.textContent = 'Activo';
            } else {
                element.classList.remove('active');
                element.textContent = 'Inactivo';
            }
        });
    }
    
    resetProcessTime() {
        // Resetear el tiempo de proceso a "Inactivo"
        const processTimeElement = document.getElementById('processTime');
        if (processTimeElement) {
            processTimeElement.textContent = 'Inactivo';
            processTimeElement.classList.remove('active');
        }
        
        // Resetear también el elemento de tiempo si existe
        const timeElement = document.querySelector('.time-value');
        if (timeElement) {
            timeElement.textContent = '00:00';
        }
    }
    
    clearCharts() {
        // Limpiar todas las gráficas
        if (typeof window !== 'undefined' && window.charts) {
            Object.values(window.charts).forEach(chart => {
                if (chart && typeof chart.clear === 'function') {
                    chart.clear();
                }
            });
        }
        
        // También limpiar gráficas específicas si existen
        const chartContainers = document.querySelectorAll('.chart-container canvas');
        chartContainers.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    }

    getCurrentDemoMode() {
        return this.isDemoMode;
    }




}

// Instancia global del gestor de demo
let demoManager;

// Función global para el botón
function toggleDemoMode() {
    if (demoManager) {
        demoManager.toggleDemoMode();
    }
}



// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    demoManager = new DemoManager();
});

// También inicializar si el script se carga después del DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!demoManager) {
            demoManager = new DemoManager();
        }
    });
} else {
    demoManager = new DemoManager();
}

 