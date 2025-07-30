// Variables globales
let isConnected = false;
let gateway = `ws://${window.location.hostname}/ws`;
let websocket;
let num_clientes_conectados = 0;
let simulationInterval = null; // Variable para guardar la referencia del setInterval

// Estado global
const state = {
  mode: "manual", //automatic o manual
  temperature: 0,
  temperatureLix: 0,
  // tempSetpoint: 27,
  tempLixSetpoint: 27,
  pressure: 0,
  pressureSetpoint: 50,
  ph: 0,
  phSetpoint: 7.0,
  isAutomatic: false, // Indica que empieza en modo automático
  isManual: true, // Esto será inverso al valor de isAutomatic
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
  control_temperatura: false,
  presion_natural: false,
  maceracion: false,
  modalFunction: function () {},
};

function setInitialStateValues() {
  (state.mode = "manual"),
    (state.temperature = 0),
    (state.temperatureLix = 0),
    // state.tempSetpoint =  27,
    (state.tempLixSetpoint = 27),
    (state.pressure = 0),
    (state.pressureSetpoint = 50),
    (state.ph = 0),
    (state.phSetpoint = 7.0),
    (state.isAutomatic = false),
    (state.isManual = true),
    (state.tiempo_horas = 0),
    (state.tiempo_minutos = 0),
    (state.temperatura_sp = 0),
    (state.grafica_temperatura_masa = []),
    (state.grafica_temperatura_lixiviados = []),
    (state.grafica_presion = []),
    (state.grafica_ph = []),
    (state.users = []),
    (state.wifiNetworks = []),
    (state.recirculacion = false),
    (state.presion_natural = false),
    (state.maceracion = false),
    (state.control_temperatura = false),
    (state.modalFunction = () => {});
}

// Enviar un comando al WebSocket
// function sendCommand(device, state) {
//   if (websocket.readyState === WebSocket.OPEN) {
//     const command = JSON.stringify({ device, state });
//     websocket.send(command);
//   } else {
//     console.log(`Error al enviar el comando: WebSocket no está abierto. Estado actual: ${websocket.readyState}`);
//     const text = "Error al enviar el comando";
//     showNotification(text, "error");
//   }
// }

// Enviar un valor al WebSocket
function sendValue(value, success = false, text = "") {
  console.log(`Enviando valor al WebSocket: ${value}`);
  if (websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(value));
  } else {
    console.log(`Error al enviar el comando: WebSocket no está abierto. Estado actual: ${websocket.readyState}`);
    const text = "Error al enviar el comando";
    showNotification(text, "error");
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

//Inicializar el WebSocket
function initWebSocket() {
  updateConnectionStatus(false);
  console.log("Intentando abrir una conexión WebSocket...", gateway);
  websocket = new WebSocket(gateway);
  //envia una notificación para indicar que se está intentando conectar
  showNotification("Conectando al servidor...", "info");

  websocket.onopen = () => {
    console.log("Conexión WebSocket abierta");
    updateConnectionStatus(true);
    //muestra una notificación de conexión exitosa
    showNotification("Conexión exitosa al servidor", "success");
  };

  websocket.onerror = (event) => {
    console.error("Error en la conexión WebSocket:", event);
    updateConnectionStatus(false);
    // muestra una notificación de error
    showNotification("Error en la conexión WebSocket", "error");
  };

  websocket.onclose = () => {
    console.log("Conexión WebSocket cerrada. No se realiza reintento de conexión");
    updateConnectionStatus(false);
    // setTimeout(initWebSocket, 1000);
    // muestra una notificación de cierre
    showNotification("Conexión WebSocket cerrada", "warning");
  };

  websocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(data);

      // Actualizar número de estaciones conectadas
      num_clientes_conectados = data.num_clientes_conectados || 0;
      updateConnectionStatus(true, num_clientes_conectados);
      // Actualizar UI con los datos recibidos
      updateUIElements(data);
    } catch (error) {
      console.error("Error al procesar el mensaje:", error);
    }
  };
}

const NUM_PUNTOS = 12 * 6; // 3 días * 24 horas * 6 puntos/hora (cada 10 min)

function generarSerieAleatoria(min, max, cantidad) {
  const serie = [];
  for (let i = 0; i < cantidad; i++) {
    const valor = +(Math.random() * (max - min) + min).toFixed(2);
    serie.push(valor);
  }
  return serie;
}

const labels = Array.from({ length: NUM_PUNTOS }, (_, i) => {
  i++;
  return parseInt(i / 6) + "h " + (i % 6) * 10 + "m";
});

function initWebSocketSimulated() {
  setInitialStateValues();
  updateControlVariables();
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
        // Actualizar número de estaciones conectadas
        num_clientes_conectados = data.num_clientes_conectados || 0;
        updateConnectionStatus(true, num_clientes_conectados);
        // Actualizar UI con los datos recibidos
        updateUIElements(data);
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    },
  };

  // Simular recepción de datos cada 5 segundos
  simulationInterval = setInterval(() => {
    const data = {
      presion: parseFloat((Math.random() * (60 - 35) + 35).toFixed(1)),
      temperatura_masa: parseFloat((Math.random() * (32 - 20) + 20).toFixed(1)),
      temperatura_lixiviados: parseFloat(
        (Math.random() * (32 - 20) + 20).toFixed(1)
      ),
      pH: parseFloat((Math.random() * (14 - 7) + 7).toFixed(1)),

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
      grafica_temperatura_masa: generarSerieAleatoria(25, 30, NUM_PUNTOS),
      grafica_temperatura_lixiviados: generarSerieAleatoria(25, 30, NUM_PUNTOS),
      grafica_presion: generarSerieAleatoria(35, 65, NUM_PUNTOS),
      grafica_ph: generarSerieAleatoria(3.4, 3.7, NUM_PUNTOS),
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
  }, 8000);

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
  
  // Limpiar el intervalo de simulación si existe
  if (simulationInterval) {
    simulateStop();
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  //si esta activado el modo demo, inicializa el websocket simulado y cierra la conexion real
  if (!isDemoMode) {
    initWebSocketSimulated();
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.close();
    }
    
  } else {
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
    //le envia al websocket onmessage un objeto con los datos simulados
    const data = {
      start: true,
      stop: false,
      tiempo_horas: 2,
      tiempo_minutos: 15,
      temperatura_sp: 90,
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
    };
    if (websocket && websocket.onmessage) {
      websocket.onmessage({ data: JSON.stringify(data) });
    }

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
    };
    if (websocket && websocket.onmessage) {
      websocket.onmessage({ data: JSON.stringify(data) });
    }

    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }

}

