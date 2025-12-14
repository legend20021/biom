function getPhColor(ph) {
    return phColors[Math.round(ph)] || phColors[7];
}

function updateIndicators() {
    // Verificar que el estado y los elementos estén disponibles
    if (!window.state) {
        console.warn('Estado global no disponible');
        return;
    }

    //actualizar header 
    const pressureElements = document.querySelectorAll('.pressureValue');
    pressureElements.forEach((element) => {
        element.textContent = `${state.pressure.toFixed(1)}`;
    });
    const phElements = document.querySelectorAll('.phValue');
    phElements.forEach((element) => {
        element.textContent = `${state.ph.toFixed(1)}`;
    });
    const tmElements = document.querySelectorAll('.tempValue');
    tmElements.forEach((element) => {
        element.textContent = `${state.temperature.toFixed(1)}`;
    });
    const tlElements = document.querySelectorAll('.tempLixValue');
    tlElements.forEach((element) => {
        element.textContent = `${state.temperatureLix.toFixed(1)}`;
    });

    const stageElements = document.querySelectorAll('.stageValue');
    stageElements.forEach((element) => {
        if (state.modo === 0) {
            element.textContent = `🕒${state.tiempo_horas}h ${state.tiempo_minutos}m`;
        } else if (state.modo === 1) {
            element.textContent = `📋 ${state.etapa} de ${state.total_etapas}`;
        }
        
    });

    // Temperatura - usando acceso seguro a elementos
    const tempValueElement = getElement('tempValue');
    if (tempValueElement) {
        tempValueElement.textContent = `${state.temperature.toFixed(1)}°C`;
    }
    
    const tempProgressElement = getElement('tempProgress');
    if (tempProgressElement) {
        tempProgressElement.style.width = `100%`;
        if (state.temperature.toFixed(1) == 0) {
            tempProgressElement.style.width = `0%`;
        }
        tempProgressElement.style.backgroundColor = 'var(--success)';
    }

    // Temperatura Lixiviados
    const tempLixValueElement = getElement('tempLixValue');
    if (tempLixValueElement) {
        tempLixValueElement.textContent = `${state.temperatureLix.toFixed(1)}°C`;
    }
    
    const tempLixProgressElement = getElement('tempLixProgress');
    if (tempLixProgressElement) {
        const tempLixDiff = state.temperatureLix - state.tempLixSetpoint;
        const tempLixProgress = (state.temperatureLix / state.tempLixSetpoint) * 100;

        if (isNaN(tempLixProgress)) {
            tempLixProgressElement.style.width = `0%`;
            tempLixProgressElement.style.backgroundColor = 'var(--cold)';
        } else {
            tempLixProgressElement.style.width = `${tempLixProgress}%`;
            if (tempLixDiff < -1) {
                tempLixProgressElement.style.backgroundColor = 'var(--cold)';
            } else if (tempLixDiff > 1) {
                tempLixProgressElement.style.backgroundColor = 'var(--warning)';
            } else {
                tempLixProgressElement.style.backgroundColor = 'var(--success)';
            }

        }

    }

    // Presión
    const pressureValueElement = getElement('pressureValue');
    const pressureProgressElement = getElement('pressureProgress');
    
    if (pressureValueElement) {
        pressureValueElement.textContent = `${state.pressure.toFixed(1)} PSI`;
    }
    
    if (pressureProgressElement) {
        const pressureProgress = (state.pressure / state.pressureSetpoint) * 100;


        if (isNaN(pressureProgress)) {
            pressureProgressElement.style.width = `0%`;
            pressureProgressElement.style.backgroundColor = 'var(--cold)';
        } else {
            pressureProgressElement.style.width = `${pressureProgress}%`;
            const pressureDiff = (state.pressure - state.pressureSetpoint);
            // Cambiar color basado en el porcentaje de diferencia
            if (pressureDiff < -1) {
                pressureProgressElement.style.backgroundColor = 'var(--cold)'; // Azul
            } else if (pressureDiff > 1) {
                pressureProgressElement.style.backgroundColor = 'var(--warning)'; // Rojo
            } else {
                pressureProgressElement.style.backgroundColor = 'var(--success)'; // Verde
            }
        }

    }

    // pH
    const phValueElement = getElement('phValue');
    const phProgressElement = getElement('phProgress');
    
    if (phValueElement) {
        phValueElement.textContent = state.ph.toFixed(1);
    }
    
    if (phProgressElement) {
        const phProgress = (state.ph / 14) * 100;

        if (isNaN(phProgress)) {
            phProgressElement.style.width = `0%`;
            phProgressElement.style.backgroundColor = 'var(--cold)';
        } else {
            phProgressElement.style.width = `${phProgress}%`;
            phProgressElement.style.backgroundColor = getPhColor(state.ph);
        }
    }

    // Setpoints
    const tempLixSetpointElement = getElement('tempLixSetpoint');
    if (tempLixSetpointElement) {
        tempLixSetpointElement.textContent = 'SP: ' + state.tempLixSetpoint.toFixed(1) + '°C';
    }

    const pressureSetpointElement = getElement('pressureSetpoint');
    if (pressureSetpointElement) {
        pressureSetpointElement.textContent = 'SP: ' + state.pressureSetpoint.toFixed(1) + 'PSI';
    }
}


// Seleccionar los elementos del temporizador
let hoursElement = document.getElementById('timer-hours');
let minutesElement = document.getElementById('timer-minutes');

// Función para actualizar un valor específico del temporizador con formato
function updateTimerValue(element, value) {
    let formattedValue = String(value).padStart(2, '0'); // Asegurar que tenga 2 dígitos
    element.textContent = formattedValue;
}

// Función para actualizar los valores del temporizador
function updateTimer() {
    updateTimerValue(hoursElement, state.tiempo_horas); // Actualizar las horas
    updateTimerValue(minutesElement, state.tiempo_minutos); // Actualizar los minutos
}

function upateTemperature() {
    // const sp = document.getElementById('temp_sp');
    // sp.textContent = (state.temperatura_sp ? state.temperatura_sp: '0') + '°C';
}
// FIN  Función para actualizar un valor específico del timer con animación



//HEADERS

function initializeHeader() {
    // Determinar qué sección está activa
    const activeSection = document.querySelector('.main-content .content[style*="block"]');
    const globalHeaderInfo = document.getElementById('globalHeaderInfo');
    
    if (!globalHeaderInfo) return;
    
    // Lista de secciones que necesitan el header-info
    const sectionsWithHeader = ['graficas', 'usuarios', 'conexiones', 'ayuda', 'curvas', 'recetas'];
    
    if (activeSection && sectionsWithHeader.includes(activeSection.id)) {
        // Mostrar el header global
        globalHeaderInfo.style.display = 'flex';
        globalHeaderInfo.classList.add('visible');
    } else {
        // Ocultar el header global
        globalHeaderInfo.style.display = 'none';
        globalHeaderInfo.classList.remove('visible');
    }
    
    updateTimer(state.tiempo_horas, state.tiempo_minutos, 0); // Inicializar el timer a 00:00:00
}

function updateControlVariables() {
    // Verificar que el estado esté disponible
    if (!window.state) {
        console.warn('Estado global no disponible para actualizar variables de control');
        return;
    }

    // Usar getElementById directamente como fallback seguro
    const recirculacion = document.getElementById('recirculationToggle');
    if (recirculacion) {
        recirculacion.checked = state.recirculacion;
    }

    const presion_natural = document.getElementById('naturalPressureBtn');
    if (presion_natural) {
        presion_natural.checked = state.presion_natural;
    }

    const maceracion = document.getElementById('carbonicMacerationBtn');
    if (maceracion) {
        maceracion.checked = state.maceracion;
    }

    const control_temperatura = document.getElementById('temperatureBtn');
    if (control_temperatura) {
        control_temperatura.checked = state.control_temperatura;
    }
    
    // Estas funciones deben ser definidas en otros archivos
    if (typeof clickOnCarbonicMaceration === 'function') {
        clickOnCarbonicMaceration(state.maceracion, true);
    }
    if (typeof clickOnTemperature === 'function') {
        clickOnTemperature(state.control_temperatura, true);
    }
    if (typeof clickOnNaturalPressure === 'function') {
        clickOnNaturalPressure(state.presion_natural, true);
    }
    if (typeof clickOnRecirculation === 'function') {
        clickOnRecirculation(state.recirculacion, true);
    }
}

// Función para ocultar el loader cuando todo esté cargado
function hideLoader() {
  document.body.classList.remove('loading');
  const loader = document.querySelector('.initial-loader');
  loader.classList.add('hidden');
  
  setTimeout(() => {
    loader.remove();
  }, 500);
}

// Esperar a que todo el contenido esté cargado
window.addEventListener('load', () => {
  // Simular un tiempo mínimo de carga para mejor UX
  setTimeout(hideLoader, 2000);
  setTimeout(initializeHeader, 1500);
  
  // Inicializar sincronización de fecha con Microcontrolador
  setTimeout(initializeDateSync, 3000); // Después de que se inicialice el ApiManager
});

function resetInputs() {
    // Resetear inputs de forma segura
    const elementsToReset = [
        'recirculationToggle',
        'naturalPressureBtn', 
        'carbonicMacerationBtn',
        'temperatureBtn'
    ];
    
    elementsToReset.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.checked = false;
        } else {
            console.warn(`Elemento ${elementId} no encontrado para reset`);
        }
    });
}

// Solo ejecutar resetInputs si el DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resetInputs);
} else {
    resetInputs();
}

// ============ FUNCIONES DE FECHA ============

/**
 * Obtiene la fecha actual en formato DD-MM-YYYY
 * @returns {string} Fecha en formato DD-MM-YYYY
 */
function getCurrentDateFormatted() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = now.getFullYear();
    
    return `${day}-${month}-${year}`;
}

/**
 * Envía la fecha actual al Microcontrolador para su almacenamiento
 */
async function sendCurrentDateToMicrocontrolador() {
    try {
        const currentDate = getCurrentDateFormatted();
        console.log('📅 Enviando fecha actual al Microcontrolador:', currentDate);
        
        // Verificar que apiManager esté disponible
        if (!window.apiManager || !window.setCurrentDate) {
            console.warn('⚠️ ApiManager no disponible, reintentando en 2 segundos...');
            setTimeout(sendCurrentDateToMicrocontrolador, 2000);
            return;
        }
        
        // Enviar fecha al Microcontrolador
        const response = await window.setCurrentDate(currentDate);
        
        if (response && response.success) {
            console.log('✅ Fecha enviada correctamente al Microcontrolador:', response);
        } else {
            console.error('❌ Error en respuesta del Microcontrolador:', response);
        }
        
    } catch (error) {
        console.error('❌ Error enviando fecha al Microcontrolador:', error);
        
        // Reintentar en caso de error
        setTimeout(() => {
            console.log('🔄 Reintentando envío de fecha al Microcontrolador...');
            sendCurrentDateToMicrocontrolador();
        }, 5000);
    }
}

/**
 * Inicializa la sincronización de fecha cuando la página carga
 */
function initializeDateSync() {
    console.log('📅 Inicializando sincronización de fecha con Microcontrolador...');
    
    // Enviar fecha inmediatamente al cargar
    sendCurrentDateToMicrocontrolador();
    
    // También enviar fecha cada vez que el usuario regrese a la pestaña
    // (en caso de que haya cambiado de día)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            const currentDate = getCurrentDateFormatted();
            console.log('👁️ Pestaña visible - verificando fecha:', currentDate);
            sendCurrentDateToMicrocontrolador();
        }
    });
}