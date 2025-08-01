// pH color mapping
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


// DOM Elements
const elements = {
    modeToggle: document.getElementById('modeToggle'),
    modeIndicator: document.getElementById('modeIndicator'),
    confirmModal: document.getElementById('confirmModal'),
    confirmBtn: document.getElementById('confirmBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    modalMessage: document.getElementById('modalMessage'),
    controlsPanel: document.getElementById('controlsPanel'),
    tempValue: document.getElementById('tempValue'),
    tempLixValue: document.getElementById('tempLixValue'),
    // tempSetpoint: document.getElementById('tempSetpoint'),
    tempLixSetpoint: document.getElementById('tempLixSetpoint'),
    tempProgress: document.getElementById('tempProgress'),
    tempLixProgress: document.getElementById('tempLixProgress'),
    pressureValue: document.getElementById('pressureValue'),
    pressureSetpoint: document.getElementById('pressureSetpoint'),
    pressureProgress: document.getElementById('pressureProgress'),
    phValue: document.getElementById('phValue'),
    phSetpoint: document.getElementById('phSetpoint'),
    phProgress: document.getElementById('phProgress'),
    header: document.querySelector('.header'),
    toggleSlider: document.querySelector('.toggle-slider'),
    //botones reproducir
    controlsPanel: document.querySelector('.controls-panel'),
    toggleButton: document.getElementById('togglePanel'),
    playButton: document.getElementById('playBtn'),
    pauseButton: document.getElementById('pauseBtn'),
    stopButton: document.getElementById('stopBtn'),
    //elementos RECIRCULACION, PRESION Y CONTROL T
    recirculationToggle: document.getElementById('recirculationToggle'),
    naturalPressureBtn: document.getElementById('naturalPressureBtn'),
    carbonicMacerationBtn: document.getElementById('carbonicMacerationBtn'),
    temperatureBtn: document.getElementById('temperatureBtn'),
    naturalPressureInput: document.getElementById('naturalPressureInput'),
    carbonicMacerationInput: document.getElementById('carbonicMacerationInput'),
    temperatureInput: document.getElementById('temperatureInput'),
    //quita los controles manuales
    controlCards: document.getElementById('controlCards'),
    mainContent: document.querySelector('.main-content'), // Usando una clase
};

