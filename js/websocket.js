// Variables para control de WebSocket
let isConnected = false;
let gateway = `ws://${window.location.hostname}/ws`;
let websocket;
let num_clientes_conectados = 0;
let simulationInterval = null; // Variable para guardar la referencia del setInterval
let userInteractionLock = false; // Bloquear actualizaciones durante interacción del usuario

// Variables para control de reconexión
let reconnectAttempts = 0;
let maxReconnectAttempts = 2;
let reconnectInterval = null;
let isReconnecting = false;
let lastMessageTimestamp = 0;
let connectionCheckInterval = null;

// NOTA: El estado global ahora se define en state.js como appState
// Esta función mantiene compatibilidad con el código existente
function setInitialStateValues() {
    if (typeof resetAppState === 'function') {
        resetAppState();
    } else {
        console.warn('resetAppState no está disponible - usando fallback');
        // Fallback para compatibilidad temporal
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

// Enviar un valor al WebSocket
function sendValue(value, success = false, text = "") {
  console.log(`Enviando valor al WebSocket: ${value}`);
  
  // Verificar si es un WebSocket real o simulado
  if (websocket && websocket instanceof WebSocket) {
    // WebSocket real
    if (websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(value));
    } else {
      console.log(`Error al enviar el comando: WebSocket no está abierto. Estado actual: ${websocket.readyState}`);
      const errorText = "Error al enviar el comando";
      showNotification(errorText, "error");
    }
  } else if (websocket && websocket.send) {
    // WebSocket simulado - siempre puede enviar
    websocket.send(JSON.stringify(value));
  } else {
    console.log("Error: WebSocket no está disponible");
    const errorText = "Error: WebSocket no está disponible";
    showNotification(errorText, "error");
  }

  if (success != null && text != null && text != "") {
    if (success) {
      showNotification(text, "success");
    } else {
      showNotification(text, "error");
    }
  }
}

// Actualizar elementos de la UI
function updateUIElements(data) {
  // Si hay una interacción del usuario activa, no actualizar los controles
  if (userInteractionLock) {
    console.log("Actualizaciones pausadas: usuario interactuando");
    // Solo actualizar datos de sensores, no los controles
    updateSensorDataOnly(data);
    return;
  }

    num_clientes_conectados = data.num_clientes_conectados || 0;
    updateConnectionStatus(true, num_clientes_conectados);

  if (data.wifiNetworks) {
    state.wifiNetworks = data.wifiNetworks;
    renderWifiTable();
  }
  if (data.users) {
    state.users = data.users;
    renderUserTable();
  }
  if (data.start) {
    startProcess();
    const processTextStatus = document.getElementById("processTextStatus");
    if (processTextStatus) {
      processTextStatus.textContent = "En progreso";
      processTextStatus.classList.add("started");
    }
    //agrega una clase 'en-progreso' al elemento
  } else {
    stopProcess();
    const processTextStatus = document.getElementById("processTextStatus");
    if (processTextStatus) {
      processTextStatus.textContent = "Detenido";
      processTextStatus.classList.add("stoped");
    }
  }

  const naturalPressureBtn = document.getElementById("naturalPressureBtn");
  const carbonicMacerationBtn = document.getElementById(
    "carbonicMacerationBtn"
  );
  const calibratePressureBtn = document.getElementById("calibrate-pressure");
  const calibratePh4 = document.getElementById("ph4-btn");
  const calibratePh7 = document.getElementById("ph7-btn");
  const calibratePh10 = document.getElementById("ph10-btn");

  if (data.start) {
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

  //faltan estos 3
  state.pressureSetpoint = data.setpoint_presion;
  // state.tempSetpoint = data.setpoint_temperatura;
  state.tempLixSetpoint = data.setpoint_temperatura;

  state.recirculacion = data.recirculacion;
  state.presion_natural = data.presion_natural;
  state.maceracion = data.maceracion;
  state.control_temperatura = data.control_temperatura;

  state.temperature = data.temperatura_masa;
  state.temperatureLix = data.temperatura_lixiviados;
  state.pressure = data.presion;
  state.ph = data.pH;

  state.grafica_temperatura_masa = data.grafica_temperatura_masa;
  state.grafica_temperatura_lixiviados = data.grafica_temperatura_lixiviados;
  state.grafica_presion = data.grafica_presion;
  state.grafica_ph = data.grafica_ph;

  state.tiempo_minutos = data.start ? data.tiempo_minutos : 0;
  state.tiempo_horas = data.start ? data.tiempo_horas : 0;
  state.temperatura_sp = data.temperatura_sp;

  updateControlVariables();
  upateTemperature();
  updateTimer();
  actualizarGrafica();
  updateIndicators();
}

// Función para actualizar solo datos de sensores durante interacción del usuario
function updateSensorDataOnly(data) {
  // Solo actualizar valores de sensores, no controles
  state.temperature = data.temperatura_masa;
  state.temperatureLix = data.temperatura_lixiviados;
  state.pressure = data.presion;
  state.ph = data.pH;
  state.temperatura_sp = data.temperatura_sp;
  
  // Actualizar gráficas si existen
  if (data.grafica_temperatura_masa) state.grafica_temperatura_masa = data.grafica_temperatura_masa;
  if (data.grafica_temperatura_lixiviados) state.grafica_temperatura_lixiviados = data.grafica_temperatura_lixiviados;
  if (data.grafica_presion) state.grafica_presion = data.grafica_presion;
  if (data.grafica_ph) state.grafica_ph = data.grafica_ph;
  
  // Solo actualizar indicadores visuales, no controles
  upateTemperature();
  updateTimer();
  actualizarGrafica();
  updateIndicators();
}

// Funciones para manejar el bloqueo de actualizaciones
function lockUserInteraction() {
  userInteractionLock = true;
  console.log("Actualizaciones pausadas: modal abierto");
}

function unlockUserInteraction() {
  userInteractionLock = false;
  console.log("Actualizaciones reanudadas: modal cerrado");
}

// Funciones para manejo de reconexión
function startReconnection() {
  const isDemoMode = localStorage.getItem("demoMode") === "true";
  
  // No intentar reconexión en modo demo
  if (isDemoMode) {
    console.log("Modo demo activo - no se intenta reconexión");
    return;
  }

  if (isReconnecting) {
    console.log("Ya hay un proceso de reconexión en curso");
    return;
  }

  isReconnecting = true;
  reconnectAttempts = 0;
  
  console.log("Iniciando proceso de reconexión...");
  showNotification("Conexión perdida. Intentando reconectar...", "warning");
  
  attemptReconnection();
}

function attemptReconnection() {
  const isDemoMode = localStorage.getItem("demoMode") === "true";
  
  // Verificar si cambió a modo demo durante la reconexión
  if (isDemoMode) {
    console.log("Modo demo activado durante reconexión - cancelando intentos");
    stopReconnection();
    return;
  }

  if (reconnectAttempts >= maxReconnectAttempts) {
    console.log("Máximo número de intentos de reconexión alcanzado");
    showNotification("No se pudo restablecer la conexión. Verifique su red.", "persistent");
    stopReconnection();
    return;
  }

  reconnectAttempts++;
  console.log(`Intento de reconexión ${reconnectAttempts}/${maxReconnectAttempts}`);
  
  // Limpiar la conexión anterior si existe
  if (websocket) {
    websocket.onopen = null;
    websocket.onclose = null;
    websocket.onerror = null;
    websocket.onmessage = null;
    
    if (websocket.readyState === WebSocket.CONNECTING || websocket.readyState === WebSocket.OPEN) {
      websocket.close();
    }
  }

  // Intentar nueva conexión
  try {
    initWebSocket();
    
    // Programar el siguiente intento si este falla
    reconnectInterval = setTimeout(() => {
      if (isReconnecting && !isConnected) {
        attemptReconnection();
      }
    }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)); // Backoff exponencial, máximo 30s
    
  } catch (error) {
    console.error("Error durante intento de reconexión:", error);
    setTimeout(() => {
      if (isReconnecting) {
        attemptReconnection();
      }
    }, 2000);
  }
}

function stopReconnection() {
  isReconnecting = false;
  reconnectAttempts = 0;
  
  if (reconnectInterval) {
    clearTimeout(reconnectInterval);
    reconnectInterval = null;
  }
  
  console.log("Proceso de reconexión detenido");
}

function onReconnectionSuccess() {
  console.log("Reconexión exitosa");
  showNotification("Conexión restablecida", "success");
  stopReconnection();
}

// Función para detectar conexión perdida por falta de mensajes
function startConnectionMonitoring() {
  const isDemoMode = localStorage.getItem("demoMode") === "true";
  
  if (isDemoMode) {
    return; // No monitorear en modo demo
  }

  // Verificar cada 10 segundos si hemos recibido mensajes recientes
  connectionCheckInterval = setInterval(() => {
    const isDemoMode = localStorage.getItem("demoMode") === "true";
    
    if (isDemoMode) {
      stopConnectionMonitoring();
      return;
    }

    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTimestamp;
    
    // Si han pasado más de 15 segundos sin mensajes y estamos "conectados"
    if (timeSinceLastMessage > 10000 && isConnected && websocket && websocket.readyState === WebSocket.OPEN) {
      console.log("Posible conexión perdida detectada - no se han recibido mensajes");
      updateConnectionStatus(false);
      startReconnection();
    }
  }, 10000);
}

function stopConnectionMonitoring() {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
    connectionCheckInterval = null;
  }
}

//Inicializar el WebSocket
function initWebSocket() {
  updateConnectionStatus(false);
  console.log("Intentando abrir una conexión WebSocket...", gateway);
  
  try {
    websocket = new WebSocket(gateway);
  } catch (error) {
    console.error("Error al crear WebSocket:", error);
    if (!isReconnecting) {
      showNotification("Error al conectar con el servidor", "error");
      startReconnection();
    }
    return;
  }

  // Solo mostrar notificación de conexión si no es un intento de reconexión
  if (!isReconnecting) {
    showNotification("Conectando al servidor...", "info");
  }

  websocket.onopen = () => {
    console.log("Conexión WebSocket abierta");
    updateConnectionStatus(true);
    lastMessageTimestamp = Date.now();
    
    if (isReconnecting) {
      onReconnectionSuccess();
    } else {
      showNotification("Conexión exitosa al servidor", "success");
    }
    
    // Iniciar monitoreo de conexión
    startConnectionMonitoring();
  };

  websocket.onerror = (event) => {
    console.error("Error en la conexión WebSocket:", event);
    updateConnectionStatus(false);
    
    if (!isReconnecting) {
      showNotification("Error en la conexión WebSocket", "error");
      startReconnection();
    }
  };

  websocket.onclose = (event) => {
    console.log("Conexión WebSocket cerrada:", event.code, event.reason);
    updateConnectionStatus(false);
    stopConnectionMonitoring();
    
    const isDemoMode = localStorage.getItem("demoMode") === "true";
    
    if (!isDemoMode && !isReconnecting) {
      showNotification("Conexión WebSocket cerrada", "warning");
      startReconnection();
    } else if (isDemoMode) {
      console.log("Modo demo activo - no se intenta reconexión");
    }
  };

  websocket.onmessage = (event) => {
    try {
      lastMessageTimestamp = Date.now();
      const data = JSON.parse(event.data);
      console.log(data);
      // Actualizar UI con los datos recibidos
      updateUIElements(data);
    } catch (error) {
      console.error("Error al procesar el mensaje:", error);
    }
  };
}

const NUM_PUNTOS = 6 * 4 * 1; //6 puntos/hora (cada 10 min) * hora * día

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

function initWebSocketSimulated() {
  setInitialStateValues();
  updateControlVariables();
  isFirstDataGeneration = true; // Resetear para la nueva simulación
  console.log("Simulando conexión WebSocket...");
  websocket = {
    readyState: WebSocket.OPEN,
    send: (message) => {
      console.log("Mensaje enviado al servidor simulado:", message);
    },
    onmessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        // Actualizar UI con los datos recibidos
        updateUIElements(data);
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    },
  };

  // Simular recepción de datos cada 5 segundos
  simulationInterval = setInterval(() => {
    let graficaData = {};
    
    if (isFirstDataGeneration) {
      // Primera vez: generar series completas
      graficaData = {
        grafica_temperatura_masa: generarSerieAleatoria(25, 30, NUM_PUNTOS),
        grafica_temperatura_lixiviados: generarSerieAleatoria(25, 30, NUM_PUNTOS),
        grafica_presion: generarSerieAleatoria(35, 65, NUM_PUNTOS),
        grafica_ph: generarSerieAleatoria(3.4, 3.7, NUM_PUNTOS),
      };
      isFirstDataGeneration = false;
    } else {
      // Siguientes veces: agregar solo un punto nuevo a cada serie
      const nuevoTempMasa = +(Math.random() * (30 - 25) + 25).toFixed(2);
      const nuevoTempLix = +(Math.random() * (30 - 25) + 25).toFixed(2);
      const nuevaPresion = +(Math.random() * (65 - 35) + 35).toFixed(2);
      const nuevoPh = +(Math.random() * (3.7 - 3.4) + 3.4).toFixed(2);
      
      // Crear las nuevas series agregando un punto al final para que crezca el array
      graficaData = {
        grafica_temperatura_masa: [...state.grafica_temperatura_masa, nuevoTempMasa],
        grafica_temperatura_lixiviados: [...state.grafica_temperatura_lixiviados, nuevoTempLix],
        grafica_presion: [...state.grafica_presion, nuevaPresion],
        grafica_ph: [...state.grafica_ph, nuevoPh],
      };
    }

    const data = {
      presion: parseFloat((Math.random() * (60 - 35) + 35).toFixed(1)),
      temperatura_masa: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
      temperatura_lixiviados: parseFloat(
        (Math.random() * (32 - 20) + 20).toFixed(1)
      ),
      pH: parseFloat((Math.random() * (14 - 7) + 7).toFixed(1)),

      recirculacion: false,
      presion_natural: true,
      maceracion: false,
      control_temperatura: false,

      calibrar_presion: false,
      calibrar_temperatura_masa: false,
      calibrar_temperatura_lixiviados: false,
      calibrar_ph_bajo: false,
      calibrar_ph_medio: false,
      calibrar_ph_alto: false,
      start: true,
      stop: false,
      tiempo_horas: 2,
      tiempo_minutos: 15,
      temperatura_sp: 90,
      guardar: false,
      num_clientes_conectados: 1,
      setpoint_presion: 51,
      setpoint_temperatura: 27,

      valor_temperatura_masa: 12,
      valor_temperatura_lixiviados: 15,
      ...graficaData,
      wifiNetworks: [
        { id: 1, name: "Red1", intensity: "Fuerte" },
        { id: 2, name: "Red2", intensity: "Media" },
        { id: 3, name: "Red3", intensity: "Débil" },
        { id: 4, name: "Red4", intensity: "Fuerte" },
      ],
      users: [
        { id: 4, name: "Juan Pérez" },
        { id: 5, name: "María López" },
        { id: 6, name: "Carlos García" },
      ],
    };
    if (websocket.onmessage) {
      websocket.onmessage({ data: JSON.stringify(data) });
    }
  }, 5000);

  console.log("Conexión WebSocket simulada abierta");
  updateConnectionStatus(false);
}

// Actualizar el estado de conexión
function updateConnectionStatus(connected, num_clientes_conectados = 0) {
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
      const connectionUsers = document.querySelectorAll(".conected-users");
      connectionUsers.forEach((text) => {
        text.textContent = num_clientes_conectados;
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
      const connectionUsers = document.querySelectorAll(".conected-users");
      connectionUsers.forEach((text) => {
        text.textContent = num_clientes_conectados;
      });
    }
  }
}

// Evento que se dispara cuando la página carga
window.addEventListener("load", () => {
  //valida si el modo demo está activado
  const isDemoMode = localStorage.getItem("demoMode") === "true";
  if (isDemoMode) {
    initWebSocketSimulated();
  } else {
    initWebSocket();
  }
});

function toggleDemoMode() {
  //guarda una variable en local storage
  const isDemoMode = localStorage.getItem("demoMode") === "true";
  localStorage.setItem("demoMode", !isDemoMode);
  updateDemoButton();
  
  // Detener procesos de reconexión si están activos
  stopReconnection();
  stopConnectionMonitoring();
  
  // Limpiar el intervalo de simulación si existe
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  // Cerrar la conexión actual antes de cambiar de modo
  if (websocket) {
    if (websocket instanceof WebSocket && websocket.readyState === WebSocket.OPEN) {
      console.log("Cerrando WebSocket real...");
      websocket.close();
    } else if (websocket.send) {
      console.log("Limpiando WebSocket simulado...");
      // Para websocket simulado, simplemente lo eliminamos
    }
    websocket = null; // Limpiar la referencia
  }
  
  // Resetear la generación de datos
  isFirstDataGeneration = true;
  
  // Inicializar el modo apropiado
  if (!isDemoMode) {
    console.log("Cambiando a modo demo...");
    initWebSocketSimulated();
  } else {
    console.log("Cambiando a modo real...");
    initWebSocket();
  }
}

function updateDemoButton() {
  const isDemoMode = localStorage.getItem("demoMode") === "true";
  const demoText = document.getElementById("demoText");
  if (demoText) {
    demoText.textContent = isDemoMode
      ? "Modo Demo Activado"
      : "Modo Demo Desactivado";

    
  }

  if (isDemoMode) {
      //muestra el elemento actionButtonsContainer
        const actionButtonsContainer = document.getElementById("actionButtonsContainer");
        if (actionButtonsContainer) {
          actionButtonsContainer.style.display = "flex";
        }
        //muestra el indicador de demo
        const demoIndicator = document.getElementById("demoIndicator");
        if (demoIndicator) {
          demoIndicator.style.display = "block";
        }
  } else {
      const actionButtonsContainer = document.getElementById("actionButtonsContainer");
      if (actionButtonsContainer) {
        actionButtonsContainer.style.display = "none";
      }
        //oculta el indicador de demo
        const demoIndicator = document.getElementById("demoIndicator");
        if (demoIndicator) {
          demoIndicator.style.display = "none";
        }
  }

}
updateDemoButton();



function simulateStart() {
    initWebSocketSimulated();

}

function simulateStop() {
    //le envia al websocket onmessage un objeto con los datos simulados
    const data = {
      start: false,
      stop: true,
      tiempo_horas: 0,
      tiempo_minutos: 0,
      temperatura_sp: 0,
      recirculacion: false,
      presion_natural: false,
      maceracion: false,
      control_temperatura: false,
      calibrar_presion: false,
      calibrar_temperatura_masa: false,
      calibrar_temperatura_lixiviados: false,
      calibrar_ph_bajo: false,
      calibrar_ph_medio: false,
      calibrar_ph_alto: false,
      grafica_temperatura_masa: [],
      grafica_temperatura_lixiviados: [],
      grafica_presion: [],
      grafica_ph: [],
      guardar: false,
      num_clientes_conectados: 0,
      setpoint_presion: 0,
      setpoint_temperatura: 0,
      valor_temperatura_masa: 0,
      valor_temperatura_lixiviados: 0,
      setpoint_presion: 0,
      setpoint_temperatura: 0,
      setpoint_temperatura: 0,
      
      pH: 0,
      temperatura_masa: 0,
      temperatura_lixiviados: 0,
      presion: 0,
    };
    if (websocket && websocket.onmessage) {
      websocket.onmessage({ data: JSON.stringify(data) });
    }

    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    updateUIElements(data);
    updateConnectionStatus(false);
}

// Limpiar todos los intervalos y procesos cuando se cierra la página
window.addEventListener('beforeunload', () => {
  stopReconnection();
  stopConnectionMonitoring();
  
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  
  if (websocket && websocket instanceof WebSocket) {
    websocket.close();
  }
});

