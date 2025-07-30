function getPhColor(ph) {
    return phColors[Math.round(ph)] || phColors[7];
}
function updateIndicators() {


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


    // Temperatura
    elements.tempValue.textContent = `${state.temperature.toFixed(1)}°C`;
    const tempDiff = state.temperature - state.tempLixSetpoint;
    const tempProgress = (state.temperature / state.tempLixSetpoint) * 100;

    elements.tempProgress.style.width = `${tempProgress}%`;
    if (tempDiff < -2) {
        elements.tempProgress.style.backgroundColor = 'var(--cold)';
    } else if (tempDiff > 2) {
        elements.tempProgress.style.backgroundColor = 'var(--warning)';
    } else {
        elements.tempProgress.style.backgroundColor = 'var(--success)';
    }


    // Temperatura
    elements.tempLixValue.textContent = `${state.temperatureLix.toFixed(1)}°C`;
    const tempLixDiff = state.temperatureLix - state.tempLixSetpoint;
    const tempLixProgress = (state.temperatureLix / state.tempLixSetpoint) * 100;

    elements.tempLixProgress.style.width = `${tempLixProgress}%`;
    if (tempLixDiff < -2) {
        elements.tempLixProgress.style.backgroundColor = 'var(--cold)';
    } else if (tempLixDiff > 2) {
        elements.tempLixProgress.style.backgroundColor = 'var(--warning)';
    } else {
        elements.tempLixProgress.style.backgroundColor = 'var(--success)';
    }


    // Presión
    elements.pressureValue.textContent = `${state.pressure.toFixed(1)} PSI`;
    elements.pressureProgress.style.width = `${(state.pressure / state.pressureSetpoint) * 100}%`;
    // Diferencia relativa con el punto de consigna
    const pressureDiff = (state.pressure - state.pressureSetpoint);
    // Cambiar color basado en el porcentaje de diferencia
    if (pressureDiff < -2) {
        elements.pressureProgress.style.backgroundColor = 'var(--cold)'; // Azul
    } else if (pressureDiff > 2) {
        elements.pressureProgress.style.backgroundColor = 'var(--warning)'; // Rojo
    } else {
        elements.pressureProgress.style.backgroundColor = 'var(--success)'; // Verde
    }

    // pH
    elements.phValue.textContent = state.ph.toFixed(1);
    const phProgress = (state.ph / 14) * 100;
    elements.phProgress.style.width = `${phProgress}%`;
    elements.phProgress.style.backgroundColor = getPhColor(state.ph);

    elements.tempLixSetpoint.textContent = 'SP: ' + state.tempLixSetpoint.toFixed(1) + '°C';
    // elements.tempSetpoint.textContent = 'SP: ' + state.tempSetpoint.toFixed(1) + '°C';

    elements.pressureSetpoint.textContent = 'SP: ' + state.pressureSetpoint.toFixed(1) + 'PSI';
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

let isPinned = false;

// Función para pin/unpin el header
function toggleHeaderPin(button) {
    isPinned = !isPinned;
    const headerInfo = document.querySelector('.header-info');
    const mainContent = document.querySelector('.main-content');
    const content = document.querySelector('.content');
    
    headerInfo.classList.toggle('pinned');
    button.classList.toggle('pinned');
    mainContent.classList.toggle('pinned');
    content.classList.toggle('pinned');
    
    if (isPinned) {
        headerInfo.classList.add('visible');
        window.removeEventListener('scroll', handleScrollForHeader);
    } else {
        window.addEventListener('scroll', handleScrollForHeader);
    }
}

// Función para mostrar/ocultar el header
function handleScrollForHeader() {
    // let lastScrollTop = 0;
    // if (isPinned) return;
    // const headerInfo = document.querySelector('.header-info');
    // let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // if (scrollTop > lastScrollTop) {
    //     // Scrolling down
    //     headerInfo.classList.remove('visible');
    // } else {
    //     // Scrolling up
    //     headerInfo.classList.add('visible');
    // }
    // lastScrollTop = scrollTop;
}

function initializeHeader() {
    // Inicializar
    window.addEventListener('scroll', handleScrollForHeader);
    const headerInfos = document.querySelectorAll('.header-info');
    headerInfos.forEach(headerInfo => {
        headerInfo.classList.add('visible'); 
    });
    //
    updateTimer(state.tiempo_horas, state.tiempo_minutos, 0); // Inicializar el timer a 00:00:00
}

function updateControlVariables() {
    const recirculacion = document.getElementById('recirculationToggle');
    recirculacion.checked = state.recirculacion;

    const presion_natural = document.getElementById('naturalPressureBtn');
    presion_natural.checked = state.presion_natural;

    const maceracion = document.getElementById('carbonicMacerationBtn');
    maceracion.checked = state.maceracion;

    const control_temperatura = document.getElementById('temperatureBtn');
    control_temperatura.checked = state.control_temperatura;
    
    clickOnCarbonicMaceration(state.maceracion, true);
    clickOnTemperature(state.control_temperatura, true);
    clickOnNaturalPressure(state.presion_natural, true);
    clickOnRecirculation(state.recirculacion, true);
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
    const recirculationToggle = document.getElementById('recirculationToggle');
    const naturalPressureBtn = document.getElementById('naturalPressureBtn');
    const carbonicMacerationBtn = document.getElementById('carbonicMacerationBtn');
    const temperatureBtn = document.getElementById('temperatureBtn');

    recirculationToggle.checked = false;
    naturalPressureBtn.checked= false;
    carbonicMacerationBtn.checked= false;
    temperatureBtn.checked= false;
}
resetInputs();