// ========================================
// TEMPLATES HTML PARA GESTIÓN DE CURVAS
// ========================================

const CURVE_TEMPLATES = {
  // Estado de carga inicial (consistente con recetas)
  loadingState: () => `
    <div class="recipe-loading-state curve-loading-state">
      <div class="loading-spinner">
      </div>
      <p>Cargando curvas...</p>
    </div>
  `,

  // Estado cuando no hay curvas (consistente con recetas)
  emptyState: (customMessage = null) => `
    <div class="recipe-empty-state curve-empty-state">
      <div class="empty-icon">📊</div>
      <h3>No hay curvas guardadas</h3>
      <p>${customMessage || 'Las curvas completadas aparecerán aquí automáticamente.'}</p>
      <div class="empty-actions">
        <button class="btn btn-secondary retry-btn" onclick="curveManager.loadCurves()">
          <span class="btn-icon">🔄</span>
          Actualizar Lista
        </button>
      </div>
    </div>
  `,

  // Estado de error (consistente con recetas)
  errorState: (message = "Error al cargar las curvas") => `
    <div class="recipe-error-state curve-error-state">
      <div class="error-icon">❌</div>
      <h3>Error al cargar curvas</h3>
      <p>${message}</p>
      <button class="btn retry-btn" onclick="curveManager.loadCurves()">
        Reintentar
      </button>
    </div>
  `,

  // Item individual de curva en formato card (consistente con recetas)
  curveItem: (curve, isFirst = false) => {
    const duration = curve.duration || 'N/A';
    const coffeeType = curve.coffeeType || 'No especificado';
    const pressureType = curve.pressureType || 'No especificado';
    const recipeName = curve.recipeName || 'Sin receta';
    const coffeeKg = curve.coffeeKg || 0;
    const comments = curve.comments || 'Sin comentarios';
    const processName = curve.processName || curve.filename || 'Proceso sin nombre';
    const processTypeText = CURVE_TEMPLATES._getProcessTypeText(curve.processType);
    const creationDate = curve.creationDate || 'No especificada';
    
    //elimina puntos y espacios del atributo filename para usarlo como id del elemento y luego poder eliminarlo
    const safeId = curve.filename ? curve.filename.replace(/\s+/g, '_').replace(/\./g, '_') : 'curve_item';
    
    return `
      <div class="recipe-item" id="${safeId}" data-filename="${curve.filename}">
        <div class="recipe-info">
          <div class="recipe-name">🧪 ${processName}</div>
          <div class="recipe-details">
            <span class="recipe-detail"><strong>📅 Fecha:</strong> ${creationDate}</span>
            <span class="recipe-detail"><strong>📝 Receta:</strong> ${recipeName}</span>
            <span class="recipe-detail"><strong>🕒 Duración:</strong> ${duration}</span>
            <span class="recipe-detail"><strong>☕ Café:</strong> ${coffeeType} (${coffeeKg} kg)</span>
            <span class="recipe-detail"><strong>🌱 Proceso:</strong> ${processTypeText}</span>
            <span class="recipe-detail"><strong>🔘 Presión:</strong> ${pressureType}</span>
          </div>
          <div class="curve-comments">
            <div class="comments-label">💬 Comentario:</div>
            <div class="comments-text">${comments}</div>
          </div>
        </div>
        <div class="recipe-actions">
          <div class="recipe-actions-dropdown">
            <button class="btn dropdown-toggle" onclick="toggleCurveDropdown(this)">
              Opciones
            </button>
            <div class="dropdown-menu">
              <button class="dropdown-item" onclick="curveManager.showCurveDetailsModal(${JSON.stringify(curve).replace(/"/g, '&quot;')}); closeCurveDropdown(this)">
                Editar
              </button>
              <button class="dropdown-item" onclick="curveManager.showCurveGraph('${curve.filename}'); closeCurveDropdown(this)">
                Ver Gráfica
              </button>
              <button class="dropdown-item delete-item" onclick="curveManager.deleteCurve('${curve.filename}', '${safeId}'); closeCurveDropdown(this)">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Overlay del modal
  modalOverlay: () => `
    <div class="curve-modal-overlay" onclick="curveManager.closeCurveModal()"></div>
  `,

  // ============ MODAL DE EDICIÓN DE PROCESO ============
  
  processEditModal: (curveData = null) => {
    const isEditing = curveData !== null;
    const title = isEditing ? 'Editar Datos de la Curva' : 'Editar Datos del Proceso';
    
    return `
      <div class="modal-content recipe-modal-content">
        <div class="recipe-modal-header">
          <h3 class="recipe-modal-title">${title}</h3>
          <button class="recipe-modal-close" onclick="closeProcessEditModal()">×</button>
        </div>
        
        <div class="modal-body">
          <div class="recipe-form-sections">
            ${CURVE_TEMPLATES.processEditForm(curveData)}
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn accept-btn" onclick="saveProcessData()">
            Guardar Cambios
          </button>
        </div>
      </div>
    `;
  },

  processEditForm: (curveData = null) => {
    const processName = curveData?.processName || '';
    const processCoffeeType = curveData?.processCoffeeType || '';
    const processTypeSelect = curveData?.processType || '';
    const processCoffeeKg = curveData?.coffeeKg || '';
    const processComments = curveData?.notes || '';
    
    return `
      <div class="recipe-info-section">
        <h4 class="section-title">
          📝 Información del Proceso
        </h4>
        <div class="info-form-grid">
          <div class="form-group">
            <label for="processName">Nombre del proceso:</label>
            <input type="text" id="processName" name="processName" class="form-input" 
                   placeholder="Ej: Lote Colombia Premium 2024" maxlength="30" required value="${processName}">
          </div>
          
          <div class="form-group">
            <label for="processCoffeeType">Tipo de café:</label>
            <input type="text" id="processCoffeeType" name="processCoffeeType" class="form-input" 
                   placeholder="Ej: Arábica Geisha, Robusta, Blend" maxlength="30" required value="${processCoffeeType}">
          </div>
          
          <div class="form-group">
            <label for="processTypeSelect">Proceso:</label>
            <select id="processTypeSelect" name="processTypeSelect" class="form-select" required>
              <option value="">Seleccionar proceso...</option>
              <option value="1" ${processTypeSelect == 1 ? 'selected' : ''}>Lavado (Washed)</option>
              <option value="2" ${processTypeSelect == 2 ? 'selected' : ''}>Natural (Dry)</option>
              <option value="3" ${processTypeSelect == 3 ? 'selected' : ''}>Honey (Miel)</option>
              <option value="4" ${processTypeSelect == 4 ? 'selected' : ''}>Semilavado (Wet-Hulled)</option>
              <option value="5" ${processTypeSelect == 5 ? 'selected' : ''}>Anaeróbico</option>
              <option value="6" ${processTypeSelect == 6 ? 'selected' : ''}>Maceración carbónica (Carbonic Maceration)</option>
              <option value="7" ${processTypeSelect == 7 ? 'selected' : ''}>Fermentación láctica</option>
              <option value="8" ${processTypeSelect == 8 ? 'selected' : ''}>Fermentación acética</option>
              <option value="9" ${processTypeSelect == 9 ? 'selected' : ''}>Doble fermentación (Double Fermentation)</option>
              <option value="10" ${processTypeSelect == 10 ? 'selected' : ''}>Proceso Koji</option>
              <option value="11" ${processTypeSelect == 11 ? 'selected' : ''}>Infusionados</option>
              <option value="12" ${processTypeSelect == 12 ? 'selected' : ''}>Rehidratación</option>
              <option value="13" ${processTypeSelect == 13 ? 'selected' : ''}>Procesos Mixtos/Híbridos</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="processCoffeeKg">Kilos de café:</label>
            <input type="number" id="processCoffeeKg" name="processCoffeeKg" class="form-input" 
                   placeholder="Ej: 150" min="1" max="100000" step="1" required value="${processCoffeeKg}">
          </div>
          
          <div class="form-group full-width">
            <label for="processComments">Comentarios del proceso:</label>
            <textarea id="processComments" name="processComments" class="form-textarea" 
                     rows="3" placeholder="Observaciones, notas o comentarios sobre el proceso..." 
                     maxlength="140" required>${processComments}</textarea>
            <div class="character-counter">
              <span id="processComments-counter">0</span>/140 caracteres
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Helper para mapear processType entero a texto
  _getProcessTypeText: (processType) => {
    const processTypes = {
      0: 'No definido',
      1: 'Lavado (Washed)',
      2: 'Natural (Dry)',
      3: 'Honey (Miel)',
      4: 'Semilavado (Wet-Hulled)',
      5: 'Anaeróbico',
      6: 'Maceración carbónica (Carbonic Maceration)',
      7: 'Fermentación láctica',
      8: 'Fermentación acética',
      9: 'Doble fermentación (Double Fermentation)',
      10: 'Proceso Koji',
      11: 'Infusionados',
      12: 'Rehidratación',
      13: 'Procesos Mixtos/Híbridos'
    };
    
    return processTypes[processType] || 'No especificado';
  },

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

// Función para manejar el toggle del dropdown de curvas (reutiliza lógica de recetas)
function toggleCurveDropdown(button) {
  const dropdown = button.nextElementSibling;
  const isOpen = dropdown.classList.contains('show');
  
  // Cerrar todos los dropdowns abiertos
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
  
  // Toggle del dropdown actual
  if (!isOpen) {
    dropdown.classList.add('show');
    
    // Cerrar al hacer clic fuera
    setTimeout(() => {
      document.addEventListener('click', function closeOnClickOutside(e) {
        if (!button.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('show');
          document.removeEventListener('click', closeOnClickOutside);
        }
      });
    }, 10);
  }
}

function closeCurveDropdown(item) {
  const dropdown = item.closest('.dropdown-menu');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
}

// Exportar para uso global
window.CURVE_TEMPLATES = CURVE_TEMPLATES;
window.toggleCurveDropdown = toggleCurveDropdown;
window.closeCurveDropdown = closeCurveDropdown;
