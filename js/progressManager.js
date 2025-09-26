// Gestor de progreso y animaciones de botones
class ProgressManager {
    constructor() {
        this.progressBarContainer = null;
        this.progressBarFill = null;
        this.playButton = null;
        this.controlButton = null;
        this.timePanel = null;
        this.isProcessRunning = false;
        this.progressTimer = null;
        this.currentProgress = 0;
        
        this.init();
    }

    init() {
        // Inicializar elementos cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initElements());
        } else {
            this.initElements();
        }
    }

    initElements() {
        this.progressBarContainer = document.getElementById('progressBarContainer');
        this.progressBarFill = document.getElementById('progressBarFill');
        this.playButton = document.getElementById('playButton');
        this.controlButton = document.getElementById('controlButton');
        
        this.timePanel = document.getElementById('TimePanel');

        if (!this.progressBarContainer || !this.progressBarFill || !this.playButton || !this.timePanel) {
            console.warn('ProgressManager: No se pudieron encontrar todos los elementos necesarios');
        }
    }

    // Iniciar el proceso y mostrar animaciones
    startProcess() {
        if (!this.progressBarContainer || !this.progressBarFill || !this.playButton) {
            console.warn('ProgressManager: Elementos no inicializados');
            return;
        }

        this.isProcessRunning = true;
        this.currentProgress = 0;

        // Agregar clase in-progress al botón de play
        this.controlButton.classList.add('in-progress');
        
        // Agregar clase in-progress al panel de tiempo
        this.timePanel.classList.add('in-progress');

        // Mostrar la barra de progreso
        this.progressBarContainer.classList.add('active');
        
        // Iniciar progreso indeterminado
        this.setIndeterminateProgress();
    }

    // Detener el proceso y ocultar animaciones
    stopProcess() {
        if (!this.progressBarContainer || !this.progressBarFill || !this.playButton) {
            return;
        }

        this.isProcessRunning = false;
        
        // Remover clase in-progress del botón de play
        this.controlButton.classList.remove('in-progress');

        // Remover clase in-progress del panel de tiempo
        this.timePanel.classList.remove('in-progress');
        
        // Ocultar la barra de progreso
        this.progressBarContainer.classList.remove('active');
        
        // Limpiar el progreso
        this.progressBarFill.classList.remove('indeterminate');
        this.progressBarFill.style.width = '0%';
        
        // Limpiar timer si existe
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
    }

    // Establecer progreso indeterminado (animación continua)
    setIndeterminateProgress() {
        if (!this.progressBarFill) return;
        
        this.progressBarFill.classList.add('indeterminate');
        this.progressBarFill.style.width = '100%';
    }

    // Establecer progreso determinado (porcentaje específico)
    setDeterminateProgress(percentage) {
        if (!this.progressBarFill) return;
        
        this.progressBarFill.classList.remove('indeterminate');
        this.progressBarFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        this.currentProgress = percentage;
    }

}

// Crear instancia global del gestor de progreso
let progressManager;

// Funciones globales para compatibilidad
function startProcess() {
    if (progressManager) {
        progressManager.startProcess();
    }
}

function stopProcess() {
    if (progressManager) {
        progressManager.stopProcess();
    }
}

function setProgress(percentage) {
    if (progressManager) {
        progressManager.setDeterminateProgress(percentage);
    }
}

// Inicializar el gestor cuando se carga el script
document.addEventListener('DOMContentLoaded', function() {
    if (!progressManager) {
        progressManager = new ProgressManager();
    }
});

// También inicializar si el DOM ya está listo
if (document.readyState !== 'loading') {
    progressManager = new ProgressManager();
}

window.progressManager = progressManager;
