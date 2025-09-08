// ========================================
// SISTEMA HTTP POLLING PARA BIOMASTER ESP32
// Reemplaza WebSocket con fetch() cada 3 segundos
// ========================================

// Variables para control de HTTP Polling
let pollingInterval = null;
let userInteractionLock = false;
let simulationInterval = null;
let isDemoMode = false;

// URLs de las APIs
const API_BASE_URL = `http://${window.location.hostname}`;
const ENDPOINTS = {
  sensors: `${API_BASE_URL}/api/sensors`,
  commands: `${API_BASE_URL}/api/commands`,
  graphData: `${API_BASE_URL}/api/graph/data`,
  graphTempMasa: `${API_BASE_URL}/api/graph/temperatura-masa`,
  graphTempLix: `${API_BASE_URL}/api/graph/temperatura-lixiviados`,
  graphPresion: `${API_BASE_URL}/api/graph/presion`,
  graphPH: `${API_BASE_URL}/api/graph/ph`,
  
  // ============ NUEVAS APIs OPTIMIZADAS ============
  graphRecent: `${API_BASE_URL}/api/graph/recent`,
  graphFull: `${API_BASE_URL}/api/graph/full`,
  graphStats: `${API_BASE_URL}/api/graph/stats`
};

// Configuración de polling
const POLLING_CONFIG = {
  interval: 4000,        // 3 segundos
  timeout: 6000,         // 5 segundos timeout
  retryDelay: 2000       // 2 segundos entre reintentos
};

const NUM_PUNTOS = 6 * 4 * 1; //6 puntos/hora (cada 10 min) * hora * día

// ============ SISTEMA OPTIMIZADO DE GRÁFICAS ============
class OptimizedGraphManager {
  constructor() {
    this.cache = new Map();
    this.recentDataInterval = null;
    this.isLoadingFull = false;
  }
  
  // ============ ESTRATEGIA OPTIMIZADA ============
  
  // 1. Iniciar gráficas con datos recientes (rápido)
  async initializeGraphs() {
    console.log("🚀 Inicializando gráficas con datos recientes");
    
    try {
      const response = await fetch(`${ENDPOINTS.graphRecent}?limit=30`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      // Actualizar todas las gráficas con datos recientes
      this.updateAllCharts({
        grafica_presion: data.presion_reciente || [],
        grafica_temperatura_masa: data.temp_masa_reciente || [],
        grafica_temperatura_lixiviados: data.temp_lix_reciente || [],
        grafica_ph: data.ph_reciente || []
      });
      
      console.log("✅ Gráficas inicializadas con últimos 30 puntos");
      
      // Iniciar polling de datos recientes cada 30 segundos
      this.startRecentDataPolling();
      
    } catch (error) {
      console.error("❌ Error inicializando gráficas:", error);
    }
  }
  
  // 2. Polling de datos recientes (cada 30s, no cada 10min)
  startRecentDataPolling() {
    if (this.recentDataInterval) {
      clearInterval(this.recentDataInterval);
    }
    
    // Polling más frecuente para datos recientes (menos datos)
    this.recentDataInterval = setInterval(async () => {
      try {
        const response = await fetch(`${ENDPOINTS.graphRecent}?limit=5`); // Solo últimos 5
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        // Agregar nuevos puntos a las gráficas existentes
        this.appendNewDataToCharts({
          new_data_presion: data.presion_reciente,
          new_data_temperatura_masa: data.temp_masa_reciente,
          new_data_temperatura_lixiviados: data.temp_lix_reciente,
          new_data_ph: data.ph_reciente
        });
        
        console.log("📊 Datos recientes actualizados");
        
      } catch (error) {
        console.error("❌ Error actualizando datos recientes:", error);
      }
    }, 30000); // Cada 30 segundos
  }
  
  // 3. Cargar gráfica completa SOLO cuando el usuario la solicite
  async loadFullGraph(graphType, showProgress = true) {
    if (this.isLoadingFull) {
      if (typeof showNotification === 'function') {
        showNotification("Carga en progreso...", "info");
      }
      return;
    }
    
    this.isLoadingFull = true;
    
    try {
      if (showProgress && typeof showNotification === 'function') {
        showNotification("Cargando historial completo...", "info");
      }
      
      // Primero obtener estadísticas para mostrar progreso
      const statsResponse = await fetch(ENDPOINTS.graphStats);
      if (!statsResponse.ok) throw new Error(`HTTP ${statsResponse.status}`);
      
      const stats = await statsResponse.json();
      const graphStats = stats[graphType];
      
      if (!graphStats || graphStats.count === 0) {
        if (typeof showNotification === 'function') {
          showNotification("No hay datos históricos", "warning");
        }
        return;
      }
      
      // Calcular páginas necesarias
      const pageSize = 50;
      const totalPages = Math.ceil(graphStats.count / pageSize);
      let allData = [];
      
      // Cargar página por página
      for (let page = 0; page < totalPages; page++) {
        const response = await fetch(`${ENDPOINTS.graphFull}?type=${graphType}&page=${page}&size=${pageSize}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const pageData = await response.json();
        allData = allData.concat(pageData.data);
        
        // Actualizar progreso
        const progress = ((page + 1) / totalPages) * 100;
        console.log(`📈 Cargando ${graphType}: ${progress.toFixed(1)}% (${allData.length}/${graphStats.count})`);
        
        // Pausa para no saturar ESP32
        if (page < totalPages - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // Actualizar gráfica con datos completos
      const fullGraphData = {};
      fullGraphData[`grafica_${graphType}`] = allData;
      this.updateAllCharts(fullGraphData);
      
      if (typeof showNotification === 'function') {
        showNotification(`Historial completo cargado: ${allData.length} puntos`, "success");
      }
      
    } catch (error) {
      console.error(`❌ Error cargando gráfica completa ${graphType}:`, error);
      if (typeof showNotification === 'function') {
        showNotification("Error cargando historial completo", "error");
      }
    } finally {
      this.isLoadingFull = false;
    }
  }
  
  // 4. Funciones de actualización de UI (mantener compatibilidad)
  updateAllCharts(data) {
    // Usar las funciones existentes de updateUIElements
    if (typeof updateUIElements === 'function') {
      updateUIElements(data);
    } else {
      console.warn('updateUIElements no está disponible');
    }
  }
  
  appendNewDataToCharts(newData) {
    // Implementar lógica para agregar puntos a gráficas existentes
    // sin reemplazar todo el dataset
    if (typeof updateUIElements === 'function') {
      updateUIElements({ automatic_updates_grafica: newData });
    }
  }
  
  // Detener polling
  stopPolling() {
    if (this.recentDataInterval) {
      clearInterval(this.recentDataInterval);
      this.recentDataInterval = null;
    }
  }
}

// Instancia global del gestor de gráficas optimizado
const graphManager = new OptimizedGraphManager();

// ============ FUNCIONES PRINCIPALES HTTP POLLING ============

// Inicializar estado inicial como en WebSocket
function setInitialStateValues() {
  if (typeof resetAppState === 'function') {
    resetAppState();
  } else {
    console.warn('resetAppState no está disponible - usando fallback');
    if (window.state) {
      Object.assign(window.state, {
        mode: "manual",
        temperature: 0,
        temperatureLix: 0,
        tempLixSetpoint: 27,
        pressure: 0,
        pressureSetpoint: 50,
        ph: 0,
        phSetpoint: 7.0,
        isAutomatic: false,
        isManual: true,
        tiempo_horas: 0,
        tiempo_minutos: 0,
        temperatura_sp: 0,
        grafica_temperatura_masa: [],
        grafica_temperatura_lixiviados: [],
        grafica_presion: [],
        grafica_ph: [],
        users: [],
        wifiNetworks: [],
        recirculacion: false,
        presion_natural: false,
        maceracion: false,
        control_temperatura: false,
        modalFunction: function () {}
      });
    }
  }
}

// Función principal de polling que reemplaza WebSocket
async function pollSensorData() {
  // Si hay bloqueo por interacción del usuario, omitir actualización
  if (userInteractionLock) {
    console.log("🔒 Polling pausado - modal abierto");
    return;
  }

  try {
    
    const response = await fetch(ENDPOINTS.sensors, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(POLLING_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📊 Datos recibidos:", data);

    // Procesar datos como en WebSocket (mantener compatibilidad)
    const webSocketData = {
      automatic_updates: {
        presion: data.presion,
        temperatura_masa: data.temperatura_masa,
        temperatura_lixiviados: data.temperatura_lixiviados,
        pH: data.pH,
        setpoint_presion: data.setpoint_presion,
        setpoint_temperatura: data.setpoint_temperatura,
        recirculacion: data.recirculacion,
        presion_natural: data.presion_natural,
        maceracion: data.maceracion,
        control_temperatura: data.control_temperatura,
        start: data.start,
        tiempo_horas: data.tiempo_horas,
        tiempo_minutos: data.tiempo_minutos,
        temperatura_sp: data.temperatura_sp || 0,
        num_clientes_conectados: data.num_clientes_conectados || 0
      }
    };

    if (window.state.start !== data.start) {
        if (data.start) {
            if (typeof resumeAutoRefresh === 'function') {
                resumeAutoRefresh();
            } else {
                console.warn('⚠️ Función resumeAutoRefresh no disponible');
            }
        } else {
            if (typeof pauseAutoRefresh === 'function') {
                pauseAutoRefresh();
            } else {
                console.warn('⚠️ Función pauseAutoRefresh no disponible');
            }
        }
    }

    // Actualizar UI usando las funciones existentes de WebSocket
    updateUIElements(webSocketData);
    updateConnectionStatus(true);

  } catch (error) {
    updateConnectionStatus(false);
    console.error("❌ Error en polling:", error);
  }
}

// Enviar comandos via HTTP POST (reemplaza sendValue)
async function sendCommand(command, success = false, text = "") {
  console.log("⚡ Enviando comando:", command);

  // Verificar si es modo demo
  if (isDemoMode) {
    console.log("🎭 Modo demo - simulando envío de comando");
    if (success && text) {
      showNotification(text, "success");
    }
    return;
  }

  try {
    const response = await fetch(ENDPOINTS.commands, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(POLLING_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Comando enviado exitosamente:", result);

    if (success && text) {
      showNotification(text, "success");
    }

  } catch (error) {
    console.error("❌ Error enviando comando:", error);
    
    const errorText = text || "Error al enviar el comando";
    showNotification(errorText, "error");
  }
}

// Función para cargar gráficas específicas (reemplaza los comandos notify)
async function loadGraphData(graphType) {
  if (isDemoMode) {
    // En modo demo, usar datos simulados
    return handleDemoGraphData(graphType);
  }

  const endpointMap = {
    'temperatura_masa': ENDPOINTS.graphTempMasa,
    'temperatura_lixiviados': ENDPOINTS.graphTempLix,
    'presion': ENDPOINTS.graphPresion,
    'ph': ENDPOINTS.graphPH
  };

  const endpoint = endpointMap[graphType];
  if (!endpoint) {
    console.error("Tipo de gráfica no válido:", graphType);
    return;
  }

  try {
    console.log(`📈 Cargando gráfica: ${graphType}`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(POLLING_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📊 Datos de gráfica ${graphType}:`, data);

    // Actualizar UI con los datos de la gráfica
    updateUIElements(data);

  } catch (error) {
    console.error(`❌ Error cargando gráfica ${graphType}:`, error);
    showNotification(`Error cargando gráfica ${graphType}`, "error");
  }
}

// ============ MANEJO DE DEMO MODE ============

function handleDemoGraphData(graphType) {
  const NUM_PUNTOS_DEMO = 24; // 24 puntos para demo
  
  const ranges = {
    'temperatura_masa': { min: 25, max: 30 },
    'temperatura_lixiviados': { min: 25, max: 30 },
    'presion': { min: 35, max: 65 },
    'ph': { min: 3.4, max: 3.7 }
  };

  const range = ranges[graphType];
  if (!range) return;

  const demoData = [];
  for (let i = 0; i < NUM_PUNTOS_DEMO; i++) {
    const valor = +(Math.random() * (range.max - range.min) + range.min).toFixed(2);
    demoData.push(valor);
  }

  const graphData = {};
  graphData[`grafica_${graphType}`] = demoData;

  updateUIElements(graphData);
}

function generarSerieAleatoria(min, max, cantidad) {
  const serie = [];
  for (let i = 0; i < cantidad; i++) {
    const valor = +(Math.random() * (max - min) + min).toFixed(2);
    serie.push(valor);
  }
  return serie;
}

// Variable para trackear si es la primera vez que se generan los datos
let isFirstDataGeneration = true;

function initDemoMode() {
  // isDemoMode = true;
  setInitialStateValues();
  
  // Generar datos iniciales solo la primera vez
  if (isFirstDataGeneration) {
    const graficas = {
      grafica_temperatura_masa: generarSerieAleatoria(25, 30, NUM_PUNTOS),
      grafica_temperatura_lixiviados: generarSerieAleatoria(25, 30, NUM_PUNTOS),
      grafica_presion: generarSerieAleatoria(35, 65, NUM_PUNTOS),
      grafica_ph: generarSerieAleatoria(3.4, 3.7, NUM_PUNTOS)
    };
    
    updateUIElements(graficas);
    isFirstDataGeneration = false;
  }
  
  console.log("🎭 Modo demo iniciado con HTTP polling simulado");
  
  // Simular datos cada 2.5 segundos como en WebSocket
  let updateGrafica = false;
  
  simulationInterval = setInterval(() => {
    // No actualizar si hay bloqueo de usuario
    if (userInteractionLock) {
      return;
    }

    // Datos de actualización principales
    const automatic_updates = {
      automatic_updates: {
        presion: parseFloat((Math.random() * (60 - 35) + 35).toFixed(1)),
        temperatura_masa: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
        temperatura_lixiviados: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
        pH: parseFloat((Math.random() * (14 - 7) + 7).toFixed(1)),
        setpoint_presion: 21,
        setpoint_temperatura: 28,
        recirculacion: false,
        presion_natural: true,
        maceracion: false,
        control_temperatura: false,
        start: true,
        tiempo_horas: 2,
        tiempo_minutos: 15,
        temperatura_sp: 90,
        num_clientes_conectados: 1,
      }
    };

    // Datos de gráficas
    const nuevoTempMasa = +(Math.random() * (30 - 25) + 25).toFixed(2);
    const nuevoTempLix = +(Math.random() * (30 - 25) + 25).toFixed(2);
    const nuevaPresion = +(Math.random() * (65 - 35) + 35).toFixed(2);
    const nuevoPh = +(Math.random() * (3.7 - 3.4) + 3.4).toFixed(2);
    
    const automatic_updates_grafica = {
      automatic_updates_grafica: {
        new_data_temperatura_masa: nuevoTempMasa,
        new_data_temperatura_lixiviados: nuevoTempLix,
        new_data_presion: nuevaPresion,
        new_data_ph: nuevoPh
      }
    };

    // Alternar entre datos principales y gráficas
    if (updateGrafica) {
      updateUIElements(automatic_updates_grafica);
    } else {
      updateUIElements(automatic_updates);
    }
    updateGrafica = !updateGrafica;

  }, 2500);


}

function stopDemoMode() {
  isDemoMode = false;
  
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  // Resetear estado como en WebSocket
  const resetData = {
    automatic_updates: {
      presion: 0,
      temperatura_masa: 0,
      temperatura_lixiviados: 0,
      pH: 0,
      setpoint_presion: 0,
      setpoint_temperatura: 0,
      recirculacion: false,
      presion_natural: false,
      maceracion: false,
      control_temperatura: false,
      start: false,
      tiempo_horas: 0,
      tiempo_minutos: 0,
      temperatura_sp: 24,
      num_clientes_conectados: 0,
    }
  };

  updateUIElements(resetData);

}

// ============ MANEJO DE RECONEXIÓN HTTP ============


// ============ CONTROL DE POLLING ============

function startPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  
  console.log(`🚀 Iniciando HTTP polling cada ${POLLING_CONFIG.interval}ms`);
  
  // Primera petición inmediata
  pollSensorData();
  
  // Configurar polling periódico
  pollingInterval = setInterval(pollSensorData, POLLING_CONFIG.interval);
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("⏹️ HTTP polling detenido");
  }
}

// ============ INTERFAZ COMPATIBLE CON WEBSOCKET ============

// Mantener compatibilidad con el código existente que espera funciones WebSocket
function sendValue(value, success = false, text = "") {
  sendCommand(value, success, text);
}


// Funciones para bloqueo de actualización durante interacción del usuario
function lockUserInteraction() {
  userInteractionLock = true;
  console.log("🔒 Actualizaciones pausadas: modal abierto");
}

function unlockUserInteraction() {
  userInteractionLock = false;
  console.log("🔓 Actualizaciones reanudadas: modal cerrado");
}

// ============ FUNCIONES DE GRÁFICAS ============

// Reemplazar las llamadas originales de WebSocket para gráficas
window.loadGraphData = loadGraphData;

// Interceptar comandos de gráficas que antes se enviaban por WebSocket
function requestGraphData(graphType) {
  // ============ SISTEMA OPTIMIZADO ============
  // Usar el gestor optimizado de gráficas
  console.log(`📈 Solicitud de gráfica optimizada: ${graphType}`);
  graphManager.loadFullGraph(graphType);
}

// ============ CONTROL DE DEMO MODE ============

function toggleDemoMode() {
  const wasDemo = localStorage.getItem("demoMode") === "true";
  localStorage.setItem("demoMode", !wasDemo);
  updateDemoButton();
  
  // Detener todos los procesos actuales
  stopPolling();
  stopDemoMode();
  
  // Inicializar el modo apropiado
  if (!wasDemo) {
    console.log("🎭 Cambiando a modo demo HTTP...");
    initDemoMode();
  } else {
    console.log("🌐 Cambiando a modo real HTTP...");
    initHttpPolling();
  }
}

function updateDemoButton() {
  const isDemoModeStored = localStorage.getItem("demoMode") === "true";
  const demoText = document.getElementById("demoText");
  
  if (demoText) {
    demoText.textContent = isDemoModeStored ? "Demo Activado" : "Demo Desactivado";
  }

  const actionButtonsContainer = document.getElementById("actionButtonsContainer");
  const demoIndicator = document.getElementById("demoIndicator");

  if (isDemoModeStored) {
    if (actionButtonsContainer) actionButtonsContainer.style.display = "flex";
    if (demoIndicator) demoIndicator.style.display = "block";
  } else {
    if (actionButtonsContainer) actionButtonsContainer.style.display = "none";
    if (demoIndicator) demoIndicator.style.display = "none";
  }
}

function simulateStart() {
  if (isDemoMode) {
    initDemoMode();
  }
}

function simulateStop() {
  if (isDemoMode) {
    stopDemoMode();
  }
}

// ============ FUNCIONES AUXILIARES ============

// Función para actualizar solo datos de sensores durante interacción del usuario
function updateSensorDataOnly(data) {
  // Solo actualizar valores de sensores, no controles
  if (data.automatic_updates) {
    state.temperature = data.automatic_updates.temperatura_masa;
    state.temperatureLix = data.automatic_updates.temperatura_lixiviados;
    state.pressure = data.automatic_updates.presion;
    state.ph = data.automatic_updates.pH;
  }
}

// ============ INICIALIZACIÓN ============

function initHttpPolling() {
  const isDemoModeStored = localStorage.getItem("demoMode") === "true";
  
  if (isDemoModeStored) {
    initDemoMode();
  } else {
    setInitialStateValues();
    startPolling();
  }
}

// ============ EVENT LISTENERS ============

// Inicializar cuando la página carga
window.addEventListener("load", () => {
  console.log("🚀 Iniciando sistema HTTP Polling para BIOMASTER");
  initHttpPolling();
});

// Limpiar al cerrar la página
window.addEventListener('beforeunload', () => {
  stopPolling();
  stopDemoMode();
});

// Actualizar botón demo al cargar
updateDemoButton();

// ============ EXPORTAR FUNCIONES GLOBALES PARA COMPATIBILIDAD ============
window.sendValue = sendValue;
window.toggleDemoMode = toggleDemoMode;
window.simulateStart = simulateStart;
window.simulateStop = simulateStop;
window.lockUserInteraction = lockUserInteraction;
window.unlockUserInteraction = unlockUserInteraction;
window.requestGraphData = requestGraphData;
window.updateSensorDataOnly = updateSensorDataOnly;

// UPDATE UI


// Actualizar elementos de la UI
function updateUIElements(data) {
  

  // Si recibe actualizaciones automaticas actualiza dashboard
  if (data.automatic_updates) {
    if (userInteractionLock) {
      console.log("Actualizaciones pausadas: usuario interactuando");
      // Solo actualizar datos de sensores, no los controles
      updateSensorDataOnly(data);
      return;
    }
    // Actualiza state del dashboard
    updateDashboardState(data);
    // Actualiza estado del proceso
    updateProcessState(data);
    // Deshabilita botones de control
    disableControlButtons(data);
    // Actualiza elementos UI con valores de state 
    updateControlVariables();
    upateTemperature();
    updateTimer();
    updateIndicators();
  }


  // Actualiza state de WIFI
    if (data.wifiNetworks) {
      state.wifiNetworks = data.wifiNetworks;
      renderWifiTable();
    }
  // Actualiza state de USERS
    if (data.users) {
      state.users = data.users;
      renderUserTable();
    }

  // Actualiza state de graficas
  if (data.grafica_temperatura_masa) {
    state.grafica_temperatura_masa = data.grafica_temperatura_masa;
    actualizarGrafica();
  }
  if (data.grafica_temperatura_lixiviados) {
    state.grafica_temperatura_lixiviados = data.grafica_temperatura_lixiviados;
    actualizarGrafica();
  }
  if (data.grafica_presion) {
    state.grafica_presion = data.grafica_presion;
    actualizarGrafica();
  }
  if (data.grafica_ph) {
    state.grafica_ph = data.grafica_ph;
    actualizarGrafica();
  }
  

  // Agrega puntos individuales a la grafica
  if (
      data.automatic_updates_grafica &&
      state.grafica_ph.length > 0 &&
      state.grafica_temperatura_masa.length > 0 &&
      state.grafica_temperatura_lixiviados.length > 0 &&
      state.grafica_presion.length > 0
    ) {
    state.grafica_ph.push(data.automatic_updates_grafica.new_data_ph);
    state.grafica_temperatura_masa.push(data.automatic_updates_grafica.new_data_temperatura_masa);
    state.grafica_temperatura_lixiviados.push(data.automatic_updates_grafica.new_data_temperatura_lixiviados);
    state.grafica_presion.push(data.automatic_updates_grafica.new_data_presion);
    actualizarGrafica();
  }
}


function updateConnectionStatus(connected) {
  isConnected = connected;
  const button = document.getElementById("connection-indicator");

  if (button) {
    if (connected) {
      button.classList.remove("offline");
      button.classList.add("online");
      const connectionTexts = document.querySelectorAll(".connection-text");
      connectionTexts.forEach((text) => {
        text.classList.remove("offline");
        text.textContent = "Online";
        text.classList.add("online");
      });
    } else {
      button.classList.remove("online");
      button.classList.add("offline");
      const connectionTexts = document.querySelectorAll(".connection-text");
      connectionTexts.forEach((text) => {
        //remueve la clase online
        text.classList.remove("online");
        text.textContent = "Offline";
        text.classList.add("offline");
      });
    }
  }
}

function updateDashboardState(data){
  // Cards
    state.pressureSetpoint = data.automatic_updates.setpoint_presion;
    state.tempLixSetpoint = data.automatic_updates.setpoint_temperatura;

    state.recirculacion = data.automatic_updates.recirculacion;
    state.presion_natural = data.automatic_updates.presion_natural;
    state.maceracion = data.automatic_updates.maceracion;
    state.control_temperatura = data.automatic_updates.control_temperatura;

    // Switches
    state.temperature = data.automatic_updates.temperatura_masa;
    state.temperatureLix = data.automatic_updates.temperatura_lixiviados;
    state.pressure = data.automatic_updates.presion;
    state.ph = data.automatic_updates.pH;

    // Proceso
    state.temperatura_sp = data.automatic_updates.temperatura_sp;
    state.tiempo_minutos = data.automatic_updates.start ? data.automatic_updates.tiempo_minutos : 0;
    state.tiempo_horas = data.automatic_updates.start ? data.automatic_updates.tiempo_horas : 0;
}

function updateProcessState(data) {

    if (window.state.start !== data.start) {
        window.state.start = data.automatic_updates.start;
        if (data.automatic_updates.start) {
            startProcess();

            const processTextStatus = document.querySelectorAll(".processTextStatus");
            processTextStatus.forEach((text) => {
                processTextStatus.textContent = "En progreso";
              processTextStatus.classList.add("started");
            });
          } else {
            stopProcess();
            const processTextStatus = document.querySelectorAll(".processTextStatus");
            processTextStatus.forEach((text) => {
                processTextStatus.textContent = "Detenido";
              processTextStatus.classList.add("stoped");
            });
            state.tiempo_minutos = 0;
            state.tiempo_horas = 0;
          }
    }
    
}

function disableControlButtons(data) {
  const naturalPressureBtn = document.getElementById("naturalPressureBtn");
    const carbonicMacerationBtn = document.getElementById("carbonicMacerationBtn");
    const calibratePressureBtn = document.getElementById("calibrate-pressure");
    const calibratePh4 = document.getElementById("ph4-btn");
    const calibratePh7 = document.getElementById("ph7-btn");
    const calibratePh10 = document.getElementById("ph10-btn");
    
    // Verificar si hay calibración de pH en progreso
    const isPhCalibrating = (typeof isPhCalibrationInProgress !== 'undefined' && isPhCalibrationInProgress);
    
    if (data.automatic_updates.start) {
      if (calibratePressureBtn) {
        calibratePressureBtn.disabled = true;
      }
      if (naturalPressureBtn) {
        naturalPressureBtn.disabled = true;
      }
      if (carbonicMacerationBtn) {
        carbonicMacerationBtn.disabled = true;
      }
      if (calibratePh4) {
        calibratePh4.disabled = true;
      }
      if (calibratePh7) {
        calibratePh7.disabled = true;
      }
      if (calibratePh10) {
        calibratePh10.disabled = true;
      }
    } else {
      if (calibratePressureBtn) {
        calibratePressureBtn.disabled = false;
      }
      if (naturalPressureBtn) {
        naturalPressureBtn.disabled = false;
      }
      if (carbonicMacerationBtn) {
        carbonicMacerationBtn.disabled = false;
      }
      
      // Solo habilitar botones de pH si no hay calibración en progreso
      if (!isPhCalibrating) {
        if (calibratePh4) {
          calibratePh4.disabled = false;
        }
        if (calibratePh7) {
          calibratePh7.disabled = false;
        }
        if (calibratePh10) {
          calibratePh10.disabled = false;
        }
      }
    }
}

// ============ INICIALIZACIÓN SISTEMA OPTIMIZADO ============

// Modificar las funciones existentes para usar el nuevo sistema
// window.requestGraphData = async function(graphType) {
//   await graphManager.loadFullGraph(graphType);
// };

// // Inicializar cuando carga la página
// window.addEventListener('load', () => {
//   console.log("🚀 Iniciando sistema HTTP Polling con optimizaciones");
  
//   // Inicializar gráficas con datos recientes
//   setTimeout(() => {
//     graphManager.initializeGraphs();
//   }, 2000); // Esperar 2 segundos para que termine la inicialización principal
// });

// Limpiar al cerrar
window.addEventListener('beforeunload', () => {
  graphManager.stopPolling();
});

// ============ EXPORTACIÓN DE FUNCIONES PÚBLICAS ============
// Para mantener compatibilidad con el código existente
if (typeof window !== 'undefined') {
  window.graphManager = graphManager;
  window.OptimizedGraphManager = OptimizedGraphManager;
}