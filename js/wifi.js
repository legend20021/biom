// ============ VARIABLES GLOBALES WIFI ============
let wifiFormValidation = {
  ssid: { isValid: true, message: "" },
  password: { isValid: true, message: "" },
};

// Variables para escaneo de redes
let wifiNetworksCache = [];

function initWiFiConfiguration() {
  console.log("🔧 Inicializando configuración WiFi");

  // Obtener elementos del DOM
  const form = document.getElementById("wifiConfigForm");
  const ssidInput = document.getElementById("wifiSSID");
  const passwordInput = document.getElementById("wifiPASSWORD");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const clearBtn = document.getElementById("wifiClearBtn");
  const refreshBtn = document.getElementById("refreshWiFiScan");

  if (!form || !ssidInput || !passwordInput) {
    console.error("❌ No se encontraron los elementos del formulario WiFi");
    return;
  }

  // Event listeners para formulario
  form.addEventListener("submit", handleWiFiFormSubmit);
  ssidInput.addEventListener("input", handleSSIDInput);
  passwordInput.addEventListener("input", handlePasswordInput);
  clearBtn.addEventListener("click", clearWiFiForm);

  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", togglePasswordVisibility);
  }

  //Event listeers para escaneo de redes
  if (refreshBtn) {
    refreshBtn.addEventListener("click", refreshWiFiNetworks);
  }

  // Inicializar escaneo de redes
  initWiFiNetworkScanning();
}

// ============ VALIDACIONES ============
function validateSSID(ssid) {
  const trimmedSSID = ssid.trim();

  if (trimmedSSID.length === 0) {
    return { isValid: true, message: "" }; // Campo opcional
  }

  // Validar longitud: máximo 32 caracteres
  if (trimmedSSID.length > 32) {
    return {
      isValid: false,
      message: "El SSID no puede tener más de 32 caracteres",
    };
  }

  if (trimmedSSID.length < 1) {
    return {
      isValid: false,
      message: "El SSID debe tener al menos 1 carácter",
    };
  }

  // Validar que no contenga espacios
  if (/\s/.test(trimmedSSID)) {
    return {
      isValid: false,
      message: "El SSID no puede contener espacios",
    };
  }

  // Validar que solo contenga letras, números, guiones (-) y guiones bajos (_)
  const validCharsPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validCharsPattern.test(trimmedSSID)) {
    return {
      isValid: false,
      message: "El SSID solo puede contener letras, números, guiones (-) y guiones bajos (_)",
    };
  }

  return { isValid: true, message: "" };
}

function validatePassword(password) {
  if (password.length === 0) {
    return { isValid: true, message: "" }; // Campo opcional
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "La contraseña debe tener al menos 8 caracteres",
    };
  }

  if (password.length > 63) {
    return {
      isValid: false,
      message: "La contraseña no puede tener más de 63 caracteres",
    };
  }

  // Validar que tenga al menos una letra y un número
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: "La contraseña debe contener al menos una letra y un número",
    };
  }

  return { isValid: true, message: "" };
}

// ============ HANDLERS DE EVENTOS ============
function handleSSIDInput(event) {
  const ssid = event.target.value;
  const validation = validateSSID(ssid);

  wifiFormValidation.ssid = validation;
  updateFieldValidation("ssid", validation);
  updateCharCount("ssidCharCount", ssid.length, 31);
}

function handlePasswordInput(event) {
  const password = event.target.value;
  const validation = validatePassword(password);

  wifiFormValidation.password = validation;
  updateFieldValidation("password", validation);
  updateCharCount("passwordCharCount", password.length, 63);
}

async function handleWiFiFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const ssid = formData.get("ssid")?.trim();
  const password = formData.get("password");

  // Validar que al menos un campo tenga valor
  if (!ssid && !password) {
    showWiFiStatus(
      "error",
      "Debe proporcionar al menos el SSID o la contraseña"
    );
    return;
  }

  // Validar campos antes de enviar
  const ssidValidation = validateSSID(ssid || "");
  const passwordValidation = validatePassword(password || "");

  if (!ssidValidation.isValid || !passwordValidation.isValid) {
    showWiFiStatus("error", "Por favor corrija los errores en el formulario");
    return;
  }

  try {
    console.log("📡 Enviando configuración WiFi:", {
      ssid,
      password: password ? "***" : null,
    });

    // Usar la función del API Manager
    const response = await setWiFiConfig(ssid || null, password || null);

    showWiFiStatus(
      "success",
      response.message ||
        "Configuración WiFi actualizada correctamente, conectate de nuevo a la red si es necesario."
    );
    clearWiFiForm();

    // Notificación global
    if (window.notificationManager) {
      window.notificationManager.persistent(
        "Configuración WiFi actualizada correctamente, conectate de nuevo a la red si es necesario."
      );
    }
  } catch (error) {
    console.error("❌ Error al actualizar configuración WiFi:", error);
    showWiFiStatus("error", `Error: ${error.message}`);

    // Notificación global de error
    if (window.notificationManager) {
      window.notificationManager.show(
        `Error al configurar WiFi: ${error.message}`,
        "error",
        8000
      );
    }
  } finally {
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("wifiPASSWORD");
  const toggleBtn = document.getElementById("togglePassword");
  const icon = toggleBtn.querySelector(".password-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.textContent = "🙈";
    toggleBtn.title = "Ocultar contraseña";
  } else {
    passwordInput.type = "password";
    icon.textContent = "👁️";
    toggleBtn.title = "Mostrar contraseña";
  }
}

function clearWiFiForm() {
  const form = document.getElementById("wifiConfigForm");
  if (form) {
    form.reset();

    // Limpiar validaciones
    wifiFormValidation = {
      ssid: { isValid: true, message: "" },
      password: { isValid: true, message: "" },
    };

    // Limpiar mensajes de error
    updateFieldValidation("ssid", { isValid: true, message: "" });
    updateFieldValidation("password", { isValid: true, message: "" });

    // Resetear contadores
    updateCharCount("ssidCharCount", 0, 31);
    updateCharCount("passwordCharCount", 0, 63);

    // Ocultar estado
    hideWiFiStatus();
  }
}

// ============ FUNCIONES DE UI ============
function updateFieldValidation(fieldName, validation) {
  const errorElement = document.getElementById(`${fieldName}Error`);
  const inputElement = document.getElementById(
    `wifi${fieldName.toUpperCase()}`
  );

  if (!errorElement || !inputElement) return;

  if (validation.isValid) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
    inputElement.classList.remove("wifi-input-error");
  } else {
    errorElement.textContent = validation.message;
    errorElement.style.display = "block";
    inputElement.classList.add("wifi-input-error");
  }
}

function updateCharCount(elementId, currentLength, maxLength) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = `${currentLength}/${maxLength} caracteres`;

    // Cambiar color si se acerca al límite
    if (currentLength > maxLength * 0.9) {
      element.style.color = "#ff6b6b";
    } else if (currentLength > maxLength * 0.7) {
      element.style.color = "#ffa726";
    } else {
      element.style.color = "#666";
    }
  }
}

function showWiFiStatus(type, message) {
  const statusElement = document.getElementById("wifiStatus");
  const statusIcon = document.getElementById("wifiStatusIcon");
  const statusMessage = document.getElementById("wifiStatusMessage");

  if (!statusElement || !statusIcon || !statusMessage) return;

  const icons = {
    success: "✅",
    error: "❌",
    loading: "⏳",
  };

  statusIcon.textContent = icons[type] || "📡";
  statusMessage.textContent = message;
  statusElement.className = `wifi-status wifi-status-${type}`;
  statusElement.style.display = "block";

  // Auto-ocultar después de 10 segundos para mensajes de éxito
  if (type === "success") {
    setTimeout(() => {
      hideWiFiStatus();
    }, 10000);
  }
}

function hideWiFiStatus() {
  const statusElement = document.getElementById("wifiStatus");
  if (statusElement) {
    statusElement.style.display = "none";
  }
}

// ============ FUNCIONES DE ESCANEO DE REDES WIFI ============

function initWiFiNetworkScanning() {
  console.log("🔍 Inicializando escaneo de redes WiFi");

  // Verificar si los elementos existen
  const networksList = document.getElementById("wifiNetworksList");
  const networksPanel = document.getElementById("wifiNetworksPanel");

  if (!networksList || !networksPanel) {
    console.warn("⚠️ Elementos de escaneo WiFi no encontrados");
    return;
  }

  // Realizar primer escaneo
  performWiFiScan();
}

async function performWiFiScan(isRetry = false) {
  //oculta el elemento con clase .wifi-networks-list
  const networksList = document.getElementById("wifiNetworksList");
  if (networksList) {
    networksList.style.display = "none";
  }
  try {
    // Mostrar estado de carga
    showWiFiScanLoading();

    // Realizar escaneo
    const result = await scanWiFiNetworks();

    if (result && result.success) {
      if (networksList) {
        networksList.style.display = "flex";
      }
      wifiNetworksCache = result.networks || [];
      displayWiFiNetworks(wifiNetworksCache);

      console.log(
        `📡 Escaneo completado: ${wifiNetworksCache.length} redes encontradas`
      );
    } else {
      throw new Error(result?.error || "Error en el escaneo");
    }
  } catch (error) {
    console.error(`❌ Error al escanear redes WiFi${isRetry ? ' (reintento)' : ''}:`, error);
    
    // Intentar una vez más si es el primer error
    if (!isRetry) {
      console.log("🔄 Reintentando escaneo WiFi...");
      // Llamar recursivamente con la bandera de reintento
      return await performWiFiScan(true);
    } else {
      // Si ya es un reintento, mostrar el error final
      console.error("❌ Escaneo WiFi falló después del reintento");
      showWiFiScanError(error.message);
    }
  }
}

function displayWiFiNetworks(networks) {
  const networksList = document.getElementById("wifiNetworksList");
  const scanStatus = document.getElementById("wifiScanStatus");
  const disconectContainer = document.getElementById("disconectContainer");

  if (!networksList) return;

  // Ocultar estado de carga
  if (scanStatus) {
    scanStatus.style.display = "none";
  }

  // Limpiar lista anterior
  disconectContainer.innerHTML = "";
  networksList.innerHTML = "";

  if (!networks || networks.length === 0) {
    networksList.innerHTML = `
      <div class="wifi-no-networks">
        <div class="wifi-no-networks-icon">📡</div>
        <div class="wifi-no-networks-text">No se encontraron redes WiFi disponibles</div>
        <div class="wifi-no-networks-subtitle">Asegúrate de que haya redes activas en el área</div>
      </div>
    `;
    return;
  }

  // Ordenar redes por calidad de señal (mayor a menor)
  const sortedNetworks = [...networks].sort(
    (a, b) => (b.quality || 0) - (a.quality || 0)
  );

  const conected = (window.state.wifi_sta_connected && window.state.ssid_sta != null) ? true : false;

  if (conected) {
    const disconectButton = document.createElement('button');
    disconectButton.type = 'button';
    disconectButton.className = 'btn wifi-connect-btn';
    disconectButton.onclick = disconnectToNetwork;
    disconectButton.innerHTML = '<span class="btn-text">Desconectar</span>';
    disconectContainer.appendChild(disconectButton);
  }

  // Crear elementos para cada red
  sortedNetworks.forEach((network, index) => {
    const networkElement = createWiFiNetworkElement(network, index);
    networksList.appendChild(networkElement);
  });
}

function createWiFiNetworkElement(network, index) {

const conected = (window.state.wifi_sta_connected && window.state.ssid_sta != null) ? true : false;
const conected_network_name = conected ? window.state.ssid_sta : null;

  const networkDiv = document.createElement("div");
  networkDiv.className = "wifi-network-item";
  networkDiv.dataset.networkIndex = index;

  // Determinar iconos y estilos basados en la red (optimizado)
  const securityIcon = network.open ? "🔓" : "🔒";
  const qualityClass = getQualityClass(network.quality || 0);

  networkDiv.innerHTML = `
    <div class="wifi-network-info">
      <div class="wifi-network-main">
        <div class="wifi-network-name">
          ${securityIcon} <strong>${escapeHtml(
    network.ssid || "Red sin nombre"
  )}</strong>
        </div>
        <div class="wifi-network-details">
          ${conected && network.ssid == window.state.ssid_sta ? '<span class="wifi-signal">Conectado</span>': ''}
          <span class="wifi-signal ${qualityClass}">${network.quality || 0}%
          </span>
          <span class="wifi-encryption">${network.enc || "WPA2"}</span>
        </div>
      </div>
    </div>
    <div class="wifi-network-actions">
        ${conected ? '': `<button type="button" class="btn wifi-connect-btn" onclick="connectToNetwork(${index})"><span class="btn-text">Conectar</span></button>`}        
    </div>
  `;

  return networkDiv;
}

// Funciones auxiliares para la interfaz

function getQualityClass(quality) {
  if (quality >= 80) return "wifi-signal-excellent";
  if (quality >= 60) return "wifi-signal-good";
  if (quality >= 40) return "wifi-signal-fair";
  if (quality >= 20) return "wifi-signal-weak";
  return "wifi-signal-very-weak";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showWiFiScanLoading() {
  const scanStatus = document.getElementById("wifiScanStatus");
  if (scanStatus) {
    scanStatus.style.display = "block";
    scanStatus.innerHTML = `
        <div class="curve-loading-state">
        <div class="loading-spinner">
        </div>
        <h3>Escaneando...</h3>
        <p>Obteniendo la lista de redes disponibles</p>
        </div>
    `;
  }
}

function showWiFiScanError(errorMessage) {
  console.error(errorMessage);
  const scanStatus = document.getElementById("wifiScanStatus");
  if (scanStatus) {
    scanStatus.style.display = "block";
    scanStatus.innerHTML = `
      <div class="wifi-scan-error">
        <span class="wifi-scan-error-icon">❌</span>
        <span>Error al escanear las redes</span>
      </div>
    `;
  }
}

async function refreshWiFiNetworks() {
  console.log("🔄 Actualizando lista de redes WiFi manualmente");
  await performWiFiScan();
}

// ============ FUNCIONES DE CONEXIÓN A RED WIFI EXTERNA ============

function connectToNetwork(networkIndex) {
  if (!wifiNetworksCache[networkIndex]) {
    console.error("❌ Red no encontrada en caché");
    return;
  }

  const network = wifiNetworksCache[networkIndex];
  console.log(`🔌 Solicitud de conexión a red: ${network.ssid}`);

  // Mostrar modal de conexión
  showWiFiConnectionModal(network);
}

function showWiFiConnectionModal(network) {
  // Crear modal dinámicamente
  const modalHTML = `
    <div class="modal-overlay active" id="wifiConnectionModal">
      <div class="modal-content wifi-connection-modal">
        <div class="modal-header">
          <h3>Conectar a Red WiFi</h3>
          <button type="button" class="close-modal-btn" onclick="closeWiFiConnectionModal()">
            <span class="close-icon">✕</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="wifi-connection-info">
            <div class="wifi-network-preview">
              <div class="wifi-network-icon">
                ${network.open ? '🔓' : '🔒'}
              </div>
              <div class="wifi-network-details">
                <div class="wifi-network-name">${escapeHtml(network.ssid)}</div>
                <div class="wifi-network-meta">
                  <span class="wifi-signal ${getQualityClass(network.quality || 0)}">
                    ${network.quality || 0}% señal
                  </span>
                  <span class="wifi-encryption">${network.enc || 'WPA2'}</span>
                </div>
              </div>
            </div>
          </div>

          <form id="wifiConnectionForm" class="wifi-connection-form">
            <input type="hidden" id="connectionSSID" value="${escapeHtml(network.ssid)}">
            
            ${!network.open ? `
              <div class="form-group">
                <label for="connectionPassword" class="form-label">
                  <span class="label-text">Contraseña de la red</span>
                  <span class="label-required">*</span>
                </label>
                <div class="password-input-container">
                  <input 
                    type="password" 
                    id="connectionPassword" 
                    name="password" 
                    class="form-input"
                    placeholder="Ingresa la contraseña"
                    required
                    autocomplete="new-password"
                  >
                  <button type="button" class="password-toggle-btn" id="toggleConnectionPassword">
                    <span class="password-icon">👁️</span>
                  </button>
                </div>
                <div class="field-error" id="connectionPasswordError"></div>
              </div>
            ` : `
              <div class="form-info">
                <div class="info-icon">ℹ️</div>
                <div class="info-text">Esta es una red abierta, no requiere contraseña</div>
              </div>
            `}

            <div class="form-group">
              <label class="checkbox-container">
                <input type="checkbox" id="saveConnection" name="save" checked>
                <span class="checkbox-checkmark"></span>
                <span class="checkbox-label">Guardar esta red para conectar automáticamente</span>
              </label>
            </div>

          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeWiFiConnectionModal()">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" id="connectWiFiBtn" onclick="submitWiFiConnection()">
            <span class="btn-icon">🔌</span>
            <span class="btn-text">Conectar</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Agregar modal al DOM dentro del main-container
  const mainContainer = document.querySelector('.main-container');
  if (mainContainer) {
    mainContainer.insertAdjacentHTML('beforeend', modalHTML);
  } else {
    // Fallback si no existe main-container
    console.warn('⚠️ main-container no encontrado, usando body como fallback');
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // Obtener referencia al modal insertado y asegurar que se muestre
  const modal = document.getElementById('wifiConnectionModal');
  if (modal) {
    // Forzar el display del modal por si los estilos CSS no se aplican correctamente
    modal.style.display = 'flex';
    
    // Agregar un pequeño delay para asegurar que las transiciones funcionen
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }

  // Agregar event listeners
  setupWiFiConnectionModal(network);

  // Bloquear actualizaciones automáticas mientras el modal está abierto
  if (typeof lockUserInteraction === 'function') {
    lockUserInteraction();
  }
}

function setupWiFiConnectionModal(network) {
  const modal = document.getElementById('wifiConnectionModal');
  const form = document.getElementById('wifiConnectionForm');
  const passwordInput = document.getElementById('connectionPassword');
  const toggleBtn = document.getElementById('toggleConnectionPassword');

  // Event listener para cerrar modal con Escape
  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      closeWiFiConnectionModal();
    }
  };
  document.addEventListener('keydown', handleEscapeKey);

  // Event listener para cerrar modal al hacer clic fuera
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeWiFiConnectionModal();
    }
  });

  // Event listener para toggle de contraseña
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const icon = toggleBtn.querySelector('.password-icon');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = '🙈';
        toggleBtn.title = 'Ocultar contraseña';
      } else {
        passwordInput.type = 'password';
        icon.textContent = '👁️';
        toggleBtn.title = 'Mostrar contraseña';
      }
    });
  }

  // Event listener para validación en tiempo real de contraseña
  if (passwordInput) {
    passwordInput.addEventListener('input', (event) => {
      validateConnectionPassword(event.target.value);
    });
  }

  // Event listener para submit con Enter
  form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitWiFiConnection();
    }
  });

  // Focus en el campo de contraseña si existe
  if (passwordInput) {
    setTimeout(() => passwordInput.focus(), 100);
  }
}

function validateConnectionPassword(password) {
  const errorElement = document.getElementById('connectionPasswordError');
  const passwordInput = document.getElementById('connectionPassword');
  
  if (!errorElement || !passwordInput) return true;

  let isValid = true;
  let message = '';

  if (password.length > 0) {
    if (password.length < 8) {
      isValid = false;
      message = 'La contraseña debe tener al menos 8 caracteres';
    } else if (password.length > 63) {
      isValid = false;
      message = 'La contraseña no puede tener más de 63 caracteres';
    }
  }

  // Actualizar UI de validación
  if (isValid) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    passwordInput.classList.remove('input-error');
  } else {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    passwordInput.classList.add('input-error');
  }

  return isValid;
}

async function submitWiFiConnection() {
  const ssid = document.getElementById('connectionSSID').value;
  const passwordInput = document.getElementById('connectionPassword');
  const saveCheckbox = document.getElementById('saveConnection');
  const connectBtn = document.getElementById('connectWiFiBtn');

  const password = passwordInput ? passwordInput.value : '';
  const saveConnection = saveCheckbox ? saveCheckbox.checked : true;

  // Validar contraseña si es necesaria
  if (passwordInput && !validateConnectionPassword(password)) {
    return;
  }

  // Validar que la contraseña no esté vacía para redes seguras
  if (passwordInput && password.length === 0) {
    showConnectionStatus('error', 'La contraseña es requerida para esta red');
    return;
  }

  try {
    // Mostrar estado de conexión
    showConnectionStatus('loading', 'Conectando a la red WiFi...');
    
    // Deshabilitar botón de conexión
    if (connectBtn) {
      connectBtn.disabled = true;
      connectBtn.querySelector('.btn-text').textContent = 'Conectando...';
      connectBtn.querySelector('.btn-icon').textContent = '⏳';
    }

    console.log(`🔌 Conectando a red: ${ssid}`);

    // Llamar al endpoint de conexión WiFi
    const result = await connectToWiFiNetwork(ssid, password, true);

    if (result && result.success) {
      
      // Mostrar notificación global
      if (window.notificationManager) {
        window.notificationManager.show(
          `Conectandose a la red: ${ssid}`,
          'success',
          5000
        );
      }

      // Cerrar modal después de un momento
      setTimeout(() => {
        closeWiFiConnectionModal();
      }, 1000);

      window.state.wifi_sta_connected = true;
      window.state.ssid_sta = ssid;
      refreshWiFiNetworks();

    } else {
      throw new Error(result?.message || 'Error al conectar a la red WiFi');
    }

  } catch (error) {
    console.error('❌ Error al conectar a la red WiFi:', error);
    showConnectionStatus('error', `Error: ${error.message}`);

    // Mostrar notificación global de error
    if (window.notificationManager) {
      window.notificationManager.show(
        `Error al conectar a ${ssid}: ${error.message}`,
        'error',
        8000
      );
    }
  } finally {
    // Rehabilitar botón de conexión
    if (connectBtn) {
      connectBtn.disabled = false;
      connectBtn.querySelector('.btn-text').textContent = 'Conectar';
      connectBtn.querySelector('.btn-icon').textContent = '🔌';
    }
  }
}

function showConnectionStatus(type, message) {
  const statusElement = document.getElementById('connectionStatus');
  const statusIcon = document.getElementById('connectionStatusIcon');
  const statusMessage = document.getElementById('connectionStatusMessage');

  if (!statusElement || !statusIcon || !statusMessage) return;

  const icons = {
    success: '✅',
    error: '❌',
    loading: '⏳'
  };

  statusIcon.textContent = icons[type] || '📡';
  statusMessage.textContent = message;
  statusElement.style.display = 'flex';
}

function closeWiFiConnectionModal() {
  const modal = document.getElementById('wifiConnectionModal');
  if (modal) {
    modal.remove();
  }

  // Restaurar actualizaciones automáticas
  if (typeof unlockUserInteraction === 'function') {
    unlockUserInteraction();
  }

  // Remover event listeners globales
  document.removeEventListener('keydown', handleEscapeKey);
}

// Función auxiliar para manejar la tecla Escape (definida fuera para poder removerla)
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeWiFiConnectionModal();
  }
}

// ============ FUNCIÓN DE DESCONEXIÓN DE RED WIFI EXTERNA ============

async function disconnectToNetwork() {
  console.log('🔌 Solicitud de desconexión de red WiFi externa');
  
  try {
    // Mostrar notificación de proceso
    if (window.notificationManager) {
      window.notificationManager.show(
        'Desconectando de la red WiFi externa...',
        'info',
        3000
      );
    }

    // Llamar al endpoint de desconexión WiFi
    const result = await disconnectFromWiFiNetwork();

    if (result && result.success) {
      console.log('✅ Desconectado exitosamente de la red WiFi externa');
      
      // Mostrar notificación de éxito
      if (window.notificationManager) {
        window.notificationManager.show(
          result.message || 'Desconectado exitosamente de la red WiFi externa',
          'success',
          5000
        );
      }

      // Actualizar la interfaz WiFi si existe la función
      if (typeof refreshWiFiNetworks === 'function') {
        setTimeout(() => {
          refreshWiFiNetworks();
        }, 2000);
      }


      return true;

    } else {
      throw new Error(result?.message || 'Error al desconectar de la red WiFi');
    }

  } catch (error) {
    console.error('❌ Error al desconectar de la red WiFi:', error);
    
    // Mostrar notificación de error
    if (window.notificationManager) {
      window.notificationManager.show(
        `Error al desconectar: ${error.message}`,
        'error',
        8000
      );
    }

    return false;
  }
}

// ============ EXPORTAR FUNCIONES GLOBALES ============
window.disconnectToNetwork = disconnectToNetwork;
