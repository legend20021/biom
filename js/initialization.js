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
        element.textContent = `${state.temperature.toFixed(1)}`;
    });

    // Temperatura - usando acceso seguro a elementos
    const tempValueElement = getElement('tempValue');
    if (tempValueElement) {
        tempValueElement.textContent = `${state.temperature.toFixed(1)}°C`;
    }
    
    const tempProgressElement = getElement('tempProgress');
    if (tempProgressElement) {
        const tempDiff = state.temperature - state.tempLixSetpoint;
        const tempProgress = (state.temperature / state.tempLixSetpoint) * 100;
        
        tempProgressElement.style.width = `${tempProgress}%`;
        if (tempDiff < -2) {
            tempProgressElement.style.backgroundColor = 'var(--cold)';
        } else if (tempDiff > 2) {
            tempProgressElement.style.backgroundColor = 'var(--warning)';
        } else {
            tempProgressElement.style.backgroundColor = 'var(--success)';
        }
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

        tempLixProgressElement.style.width = `${tempLixProgress}%`;
        if (tempLixDiff < -2) {
            tempLixProgressElement.style.backgroundColor = 'var(--cold)';
        } else if (tempLixDiff > 2) {
            tempLixProgressElement.style.backgroundColor = 'var(--warning)';
        } else {
            tempLixProgressElement.style.backgroundColor = 'var(--success)';
        }
    }

    // Presión
    const pressureValueElement = getElement('pressureValue');
    const pressureProgressElement = getElement('pressureProgress');
    
    if (pressureValueElement) {
        pressureValueElement.textContent = `${state.pressure.toFixed(1)} PSI`;
    }
    
    if (pressureProgressElement) {
        pressureProgressElement.style.width = `${(state.pressure / state.pressureSetpoint) * 100}%`;
        // Diferencia relativa con el punto de consigna
        const pressureDiff = (state.pressure - state.pressureSetpoint);
        // Cambiar color basado en el porcentaje de diferencia
        if (pressureDiff < -2) {
            pressureProgressElement.style.backgroundColor = 'var(--cold)'; // Azul
        } else if (pressureDiff > 2) {
            pressureProgressElement.style.backgroundColor = 'var(--warning)'; // Rojo
        } else {
            pressureProgressElement.style.backgroundColor = 'var(--success)'; // Verde
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
        phProgressElement.style.width = `${phProgress}%`;
        phProgressElement.style.backgroundColor = getPhColor(state.ph);
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
    const sp = document.getElementById('temp_sp');
    sp.textContent = (state.temperatura_sp ? state.temperatura_sp: '0') + '°C';
}
// FIN  Función para actualizar un valor específico del timer con animación



//HEADERS

function initializeHeader() {
    // Inicializar
    const headerInfos = document.querySelectorAll('.header-info');
    headerInfos.forEach(headerInfo => {
        headerInfo.classList.add('visible'); 
    });
    //
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
  
  // Remover el loader del DOM después de la animación
  setTimeout(() => {
    loader.remove();
  }, 500);
}

// Esperar a que todo el contenido esté cargado
window.addEventListener('load', () => {
  // Simular un tiempo mínimo de carga para mejor UX
  setTimeout(hideLoader, 2000);
  setTimeout(initializeHeader, 1500);
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