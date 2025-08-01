/**
 * BIOMASTER Pro V2 IA - Global State Management
 * Gestión centralizada del estado de la aplicación
 */

// pH color mapping - Constantes de colores para valores de pH
const phColors = {
    0: 'rgb(255, 0, 0)',
    1: 'rgb(255, 51, 51)',
    2: 'rgb(255, 102, 0)',
    3: 'rgb(255, 153, 51)',
    4: 'rgb(255, 204, 102)',
    5: 'rgb(255, 255, 51)',
    6: 'rgb(204, 255, 153)',
    7: 'rgb(0, 255, 0)',
    8: 'rgb(102, 255, 178)',
    9: 'rgb(0, 255, 255)',
    10: 'rgb(102, 204, 255)',
    11: 'rgb(51, 102, 255)',
    12: 'rgb(0, 51, 255)',
    13: 'rgb(102, 0, 204)',
    14: 'rgb(128, 0, 128)'
};

// Estado global de la aplicación
const appState = {
    // Modo de operación
    mode: "manual", // "automatic" o "manual"
    isAutomatic: false,
    isManual: true,
    
    // Valores de sensores
    temperature: 0,
    temperatureLix: 0,
    pressure: 0,
    ph: 0,
    
    // Setpoints (valores objetivo)
    tempLixSetpoint: 27,
    pressureSetpoint: 50,
    phSetpoint: 7.0,
    
    // Control de tiempo
    tiempo_horas: 0,
    tiempo_minutos: 0,
    temperatura_sp: 0,
    
    // Datos para gráficas
    grafica_temperatura_masa: [],
    grafica_temperatura_lixiviados: [],
    grafica_presion: [],
    grafica_ph: [],
    
    // Control de procesos
    recirculacion: false,
    control_temperatura: false,
    presion_natural: false,
    maceracion: false,
    
    // Datos externos
    users: [],
    wifiNetworks: [],
    
    // Función modal (callback)
    modalFunction: function () {}
};

// Referencia global para compatibilidad con código existente
// TODO: Migrar todo el código para usar appState en lugar de state
window.state = appState;

// Cache de elementos DOM - Se inicializa cuando el DOM esté listo
let elements = {};

/**
 * Inicializa las referencias a elementos DOM
 * Solo debe llamarse cuando el DOM esté completamente cargado
 */
function initializeDOMElements() {
    try {
        elements = {
            // Elementos de modo
            modeToggle: document.getElementById('modeToggle'),
            modeIndicator: document.getElementById('modeIndicator'),
            
            // Modal de confirmación
            confirmModal: document.getElementById('confirmModal'),
            confirmBtn: document.getElementById('confirmBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            modalMessage: document.getElementById('modalMessage'),
            
            // Panel de controles
            controlsPanel: document.getElementById('controlsPanel'),
            
            // Elementos de temperatura
            tempValue: document.getElementById('tempValue'),
            tempLixValue: document.getElementById('tempLixValue'),
            tempLixSetpoint: document.getElementById('tempLixSetpoint'),
            tempProgress: document.getElementById('tempProgress'),
            tempLixProgress: document.getElementById('tempLixProgress'),
            
            // Elementos de presión
            pressureValue: document.getElementById('pressureValue'),
            pressureSetpoint: document.getElementById('pressureSetpoint'),
            pressureProgress: document.getElementById('pressureProgress'),
            
            // Elementos de pH
            phValue: document.getElementById('phValue'),
            phSetpoint: document.getElementById('phSetpoint'),
            phProgress: document.getElementById('phProgress'),
            
            // Elementos de layout
            header: document.querySelector('.header'),
            toggleSlider: document.querySelector('.toggle-slider'),
            controlsPanel: document.querySelector('.controls-panel'),
            mainContent: document.querySelector('.main-content'),
            
            // Botones de control
            toggleButton: document.getElementById('togglePanel'),
            playButton: document.getElementById('playBtn'),
            pauseButton: document.getElementById('pauseBtn'),
            stopButton: document.getElementById('stopBtn'),
            
            // Controles de proceso
            recirculationToggle: document.getElementById('recirculationToggle'),
            naturalPressureBtn: document.getElementById('naturalPressureBtn'),
            carbonicMacerationBtn: document.getElementById('carbonicMacerationBtn'),
            temperatureBtn: document.getElementById('temperatureBtn'),
            naturalPressureInput: document.getElementById('naturalPressureInput'),
            carbonicMacerationInput: document.getElementById('carbonicMacerationInput'),
            temperatureInput: document.getElementById('temperatureInput'),
            
            // Contenedores
            controlCards: document.getElementById('controlCards')
        };
        
        console.log('Elementos DOM inicializados correctamente');
        return true;
    } catch (error) {
        console.error('Error al inicializar elementos DOM:', error);
        return false;
    }
}

/**
 * Obtiene un elemento DOM de forma segura
 * @param {string} elementKey - Clave del elemento en el objeto elements
 * @returns {HTMLElement|null} - Elemento DOM o null si no existe
 */
function getElement(elementKey) {
    if (!elements[elementKey]) {
        console.warn(`Elemento '${elementKey}' no encontrado en el cache de elementos`);
        return null;
    }
    return elements[elementKey];
}

/**
 * Resetea el estado a los valores iniciales
 */
function resetAppState() {
    appState.mode = "manual";
    appState.temperature = 0;
    appState.temperatureLix = 0;
    appState.tempLixSetpoint = 27;
    appState.pressure = 0;
    appState.pressureSetpoint = 50;
    appState.ph = 0;
    appState.phSetpoint = 7.0;
    appState.isAutomatic = false;
    appState.isManual = true;
    appState.tiempo_horas = 0;
    appState.tiempo_minutos = 0;
    appState.temperatura_sp = 0;
    appState.grafica_temperatura_masa = [];
    appState.grafica_temperatura_lixiviados = [];
    appState.grafica_presion = [];
    appState.grafica_ph = [];
    appState.users = [];
    appState.wifiNetworks = [];
    appState.recirculacion = false;
    appState.presion_natural = false;
    appState.maceracion = false;
    appState.control_temperatura = false;
    appState.modalFunction = function () {};
    
    console.log('Estado de la aplicación reseteado');
}

/**
 * Actualiza múltiples propiedades del estado de forma segura
 * @param {Object} updates - Objeto con las propiedades a actualizar
 */
function updateAppState(updates) {
    try {
        Object.keys(updates).forEach(key => {
            if (appState.hasOwnProperty(key)) {
                appState[key] = updates[key];
            } else {
                console.warn(`Propiedad '${key}' no existe en el estado de la aplicación`);
            }
        });
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
    }
}

// Inicializar elementos DOM cuando el documento esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDOMElements);
} else {
    // El documento ya está cargado
    initializeDOMElements();
}

