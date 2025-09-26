// ========================================
// TEMPLATES HTML PARA GESTIÓN DE CURVAS
// ========================================

const CURVE_TEMPLATES = {
  // Estado de carga inicial
  loadingState: () => `
    <div class="curve-loading-state">
      <div class="loading-spinner"></div>
      <h3>Cargando curvas...</h3>
      <p>Obteniendo la lista de curvas guardadas desde el sistema...</p>
    </div>
  `,

  // Estado cuando no hay curvas
  emptyState: () => `
    <div class="curve-empty-state">
      <div class="empty-icon">📊</div>
      <h3>No hay curvas guardadas</h3>
      <p>Las curvas completadas aparecerán aquí automáticamente.</p>
      <div class="empty-actions">
        <button class="btn btn-secondary" onclick="curveManager.loadCurves()">
          🔄 Actualizar Lista
        </button>
      </div>
    </div>
  `,

  // Estado de error
  errorState: (message = "Error al cargar las curvas") => `
    <div class="curve-error-state">
      <div class="error-icon">⚠️</div>
      <h3>Error de conexión</h3>
      <p>${message}</p>
      <div class="error-actions">
        <button class="btn btn-primary" onclick="curveManager.loadCurves()">
          🔄 Reintentar
        </button>
      </div>
    </div>
  `,

  // Item individual de curva en formato acordeón
  curveItem: (curve, isFirst = false) => {
    const duration = curve.duration || 'N/A';
    const coffeeType = curve.coffeeType || 'No especificado';
    const pressureType = curve.pressureType || 'No especificado';
    const recipeName = curve.recipeName || 'Sin receta';
    const comments = curve.comments || 'Sin comentarios';
    const processName = curve.processName || curve.filename || 'Proceso sin nombre';
    
    // Clases y estados para el primer elemento
    const headerClass = isFirst ? 'accordion-header curve-accordion-header active' : 'accordion-header curve-accordion-header';
    const contentStyle = isFirst ? 'style="max-height: 1000px;"' : '';
    const iconSymbol = isFirst ? '−' : '+';
    //elimina puntos y espacios del atributo filename para usarlo como id del elemento y luego poder eliminarlo
    const safeId = curve.filename ? curve.filename.replace(/\s+/g, '_').replace(/\./g, '_') : 'curve_item';
    
    return `
      <div class="accordion-item curve-accordion-item" id="${safeId}" data-filename="${curve.filename}">
        <div class="${headerClass}" onclick="toggleCurveAccordion(this)">
          <h3>📊 ${processName}</h3>
          <span class="accordion-icon">${iconSymbol}</span>
        </div>
        <div class="accordion-content curve-accordion-content" ${contentStyle}>
          <div class="curve-info">
            <div class="curve-detail">
              <span class="detail-label">🧪 Receta:</span> 
              <span class="detail-value">${recipeName}</span>
            </div>
            <div class="curve-detail">
              <span class="detail-label">⏱ Duración:</span> 
              <span class="detail-value">${duration}</span>
            </div>
            <div class="curve-detail">
              <span class="detail-label">🧯 Presión:</span> 
              <span class="detail-value">${pressureType}</span>
            </div>
            <div class="curve-detail">
              <span class="detail-label">☕ Café:</span> 
              <span class="detail-value">${coffeeType}</span>
            </div>
            <div class="curve-detail">
              <span class="detail-label">💭 Comentario:</span> 
              <span class="detail-value">${comments}</span>
            </div>
            <div class="curve-detail">
              <span class="detail-label">📊 Puntos de datos:</span> 
              <span class="detail-value">${curve.totalPoints || 0}</span>
            </div>
          </div>
          <div class="curve-actions">
            <button class="btn view-curve-btn" onclick="curveManager.showCurveDetailsModal('${curve.filename}')">
              Ver Gráfica
            </button>
            <button class="btn delete-curve-btn" onclick="curveManager.deleteCurve('${curve.filename}', '${safeId}')">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Modal de detalles de curva
  curveDetailsModal: (curveDetail) => {
    const processName = curveDetail.processName || 'Proceso sin nombre';
    const recipeName = curveDetail.recipeName || 'Sin receta asociada';
    const coffeeType = curveDetail.coffeeType || 'No especificado';
    const pressureType = curveDetail.pressureType || 'No especificado';
    const comments = curveDetail.comments || 'Sin comentarios adicionales';
    const duration = curveDetail.duration || 'N/A';
    const totalPoints = curveDetail.totalPoints || 0;
    
    // Formatear fechas si están disponibles
    const startTime = curveDetail.startTime ? new Date(curveDetail.startTime * 1000).toLocaleString() : 'N/A';
    const endTime = curveDetail.endTime ? new Date(curveDetail.endTime * 1000).toLocaleString() : 'N/A';
    
    return `
      <div class="curve-modal-content">
        <div class="curve-modal-header">
          <h2>📊 ${processName}</h2>
          <button class="modal-close-btn" onclick="curveManager.closeCurveModal()">✕</button>
        </div>
        
        <div class="curve-modal-body">
          <!-- Información Principal -->
          <div class="curve-info-section">
            <h3>ℹ️ Información del Proceso</h3>
            <div class="curve-info-grid">
              <div class="info-item">
                <span class="info-label">🧪 Receta utilizada:</span>
                <span class="info-value">${recipeName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">☕ Tipo de café:</span>
                <span class="info-value">${coffeeType}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🧯 Tipo de presión:</span>
                <span class="info-value">${pressureType}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏱ Duración total:</span>
                <span class="info-value">${duration}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📊 Total de puntos:</span>
                <span class="info-value">${totalPoints}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🚀 Inicio del proceso:</span>
                <span class="info-value">${startTime}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🏁 Fin del proceso:</span>
                <span class="info-value">${endTime}</span>
              </div>
            </div>
          </div>

          <!-- Comentarios -->
          <div class="curve-comments-section">
            <h3>💭 Observaciones del Proceso</h3>
            <div class="comments-box">
              <p>${comments}</p>
            </div>
          </div>

          <!-- Datos del Proceso (si están disponibles) -->
          ${curveDetail.dataPoints && curveDetail.dataPoints.length > 0 ? `
          <div class="curve-data-section">
            <h3>📈 Vista Previa de Datos</h3>
            <div class="data-preview">
              <p>Se registraron ${curveDetail.dataPoints.length} puntos de datos durante el proceso.</p>
              <div class="data-summary">
                <div class="data-point">
                  <span class="data-label">🌡️ Temperatura masa (promedio):</span>
                  <span class="data-value">${CURVE_TEMPLATES._calculateAverage(curveDetail.dataPoints, 'temperatura_masa')}°C</span>
                </div>
                <div class="data-point">
                  <span class="data-label">🌊 Temperatura lixiviado (promedio):</span>
                  <span class="data-value">${CURVE_TEMPLATES._calculateAverage(curveDetail.dataPoints, 'temperatura_lixiviados')}°C</span>
                </div>
                <div class="data-point">
                  <span class="data-label">🧯 Presión (promedio):</span>
                  <span class="data-value">${CURVE_TEMPLATES._calculateAverage(curveDetail.dataPoints, 'presion')} PSI</span>
                </div>
                <div class="data-point">
                  <span class="data-label">🧪 pH (promedio):</span>
                  <span class="data-value">${CURVE_TEMPLATES._calculateAverage(curveDetail.dataPoints, 'ph')}</span>
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>

        <div class="curve-modal-footer">
          <button class="btn btn-secondary" onclick="curveManager.closeCurveModal()">
            ↩️ Cerrar
          </button>
          <button class="btn view-in-graph-btn" onclick="curveManager.viewCurveInGraph('${curveDetail.filename}')">
            📊 Ver en Gráfica
          </button>
        </div>
      </div>
    `;
  },

  // Overlay del modal
  modalOverlay: () => `
    <div class="curve-modal-overlay" onclick="curveManager.closeCurveModal()"></div>
  `,

  // Helper para calcular promedios
  _calculateAverage: (dataPoints, field) => {
    if (!dataPoints || dataPoints.length === 0) return 'N/A';
    
    const validPoints = dataPoints.filter(point => point[field] !== undefined && point[field] !== null);
    if (validPoints.length === 0) return 'N/A';
    
    const sum = validPoints.reduce((acc, point) => acc + parseFloat(point[field] || 0), 0);
    const average = sum / validPoints.length;
    
    return average.toFixed(2);
  }
};

// Función para manejar el toggle del acordeón de curvas
function toggleCurveAccordion(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.accordion-icon');
  
  if (content.style.maxHeight) {
    // Cerrar acordeón
    content.style.maxHeight = null;
    icon.textContent = '+';
    header.classList.remove('active');
  } else {
    // Cerrar todos los otros acordeones abiertos
    const allHeaders = document.querySelectorAll('.curve-accordion-header.active');
    allHeaders.forEach(otherHeader => {
      if (otherHeader !== header) {
        const otherContent = otherHeader.nextElementSibling;
        const otherIcon = otherHeader.querySelector('.accordion-icon');
        otherContent.style.maxHeight = null;
        otherIcon.textContent = '+';
        otherHeader.classList.remove('active');
      }
    });
    
    // Abrir este acordeón
    content.style.maxHeight = content.scrollHeight + "px";
    icon.textContent = '−';
    header.classList.add('active');
  }
}

// Exportar para uso global
window.CURVE_TEMPLATES = CURVE_TEMPLATES;
window.toggleCurveAccordion = toggleCurveAccordion;
