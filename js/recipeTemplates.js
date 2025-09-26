// ========================================
// TEMPLATES HTML PARA GESTOR DE RECETAS
// ========================================

const RECIPE_TEMPLATES = {
  
  // ============ ESTADOS DE CONTENIDO ============
  
  loadingState: () => `
    <div class="recipe-loading-state">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p>Cargando recetas...</p>
    </div>
  `,
  
  errorState: (errorMessage) => `
    <div class="recipe-error-state">
      <div class="error-icon">❌</div>
      <h3>Error al cargar recetas</h3>
      <p>${errorMessage}</p>
      <button class="btn retry-btn" onclick="recipeManager.loadRecipes()">
        <span class="btn-icon">🔄</span>
        Reintentar
      </button>
    </div>
  `,
  
  
  // ============ ELEMENTO DE RECETA ============
  
  recipeItem: (recipe, duration, createdDate, processState) => `
    <div class="recipe-info">
      <div class="recipe-name">${recipe.recipeName}</div>
      <div class="recipe-details">
        <span class="recipe-detail"><strong>Tipo de café:</strong> ${recipe.coffeeType}</span>
        <span class="recipe-detail"><strong>Presión:</strong> ${recipe.pressureType}</span>
        <span class="recipe-detail"><strong>Etapas:</strong> ${recipe.etapas}</span>
        <span class="recipe-detail"><strong>Duración:</strong> ${duration}</span>
      </div>
    </div>
    <div class="recipe-actions">
      ${!processState ? `
        <button class="btn start-recipe-btn" onclick="recipeManager.startRecipe('${recipe.filename}')">
          Iniciar
        </button>
      ` : ''}
      <button class="btn view-recipe-btn" onclick="recipeManager.viewRecipe('${recipe.filename}')">
        Ver
      </button>
      <button class="btn delete-recipe-btn" onclick="recipeManager.deleteRecipe('${recipe.filename}')">
        Borrar
      </button>
    </div>
  `,
  
  // ============ MODAL DE DETALLES ============
  
  modalStructure: (recipeDetails, generalInfoHtml, setPointsHtml, processState) => `
    <div class="recipe-modal-content">
      <div class="recipe-modal-header">
        <h3 class="recipe-modal-title">${recipeDetails.recipeName}</h3>
        <button class="recipe-modal-close" onclick="document.getElementById('recipeDetailsModal').remove()">×</button>
      </div>
      
      <div class="recipe-modal-body">
        <div class="recipe-modal-sections">
          ${generalInfoHtml}
          ${setPointsHtml}
        </div>
      </div>
      
      <div class="recipe-modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('recipeDetailsModal').remove()">
          Cerrar
        </button>
        ${!processState ? `
          <button class="btn btn-primary" onclick="recipeManager.startRecipe('${recipeDetails.filename}'); document.getElementById('recipeDetailsModal').remove();">
            Iniciar Receta
          </button>
        ` : ''}
      </div>
    </div>
  `,
  
  generalInfo: (recipeDetails, formatDurationFn) => `
    <div class="recipe-info-section">
      <h4 class="section-title">
        🔧 Información General
      </h4>
      <div class="info-grid">
        <div class="info-row">
          <strong>Nombre:</strong>
          <span>${recipeDetails.recipeName}</span>
        </div>
        <div class="info-row">
          <strong>Tipo de café:</strong>
          <span>${recipeDetails.coffeeType}</span>
        </div>
        <div class="info-row">
          <strong>Tipo de presión:</strong>
          <span>${recipeDetails.pressureType}</span>
        </div>
        <div class="info-row">
          <strong>Modo:</strong>
          <span>${RECIPE_TEMPLATES.getModoText(recipeDetails.modo)}</span>
        </div>
        <div class="info-row">
          <strong>Duración:</strong>
          <span>${recipeDetails.duration || formatDurationFn(recipeDetails.totalTime)}</span>
        </div>
        <div class="info-row">
          <strong>Etapas:</strong>
          <span>${recipeDetails.etapas}</span>
        </div>
      </div>
    </div>
  `,
  
  setPointsSection: (setPointsHtml) => `
    <div class="recipe-setpoints-section">
      <h4 class="section-title">
        📊 Puntos de Control
      </h4>
      <div class="setpoints-container">
        ${setPointsHtml}
      </div>
    </div>
  `,
  
  noSetPoints: () => `
    <p class="no-data-message">No hay puntos de control disponibles</p>
  `,
  
  setPointItem: (point, index) => `
    <div class="setpoint-item">
      <div class="setpoint-header">
        <strong class="setpoint-title">Etapa ${index + 1}</strong>
        <span class="setpoint-time">
          ${point.tiempoAcumulado_formatted ? point.tiempoAcumulado_formatted: 'Null'}
        </span>
      </div>
      <div class="setpoint-data">
        <span class="data-badge pressure">
          🔘 ${point.presion_setpoint} PSI
        </span>
        <span class="data-badge temperature">
          🌡️ ${point.temp_setpoint}°C
        </span>
        ${point.stage ? `<span class="data-badge stage">Etapa ${index + 1}</span>` : ''}
      </div>
    </div>
  `,

  // ============ MODAL DE CREACIÓN ============
  
  createModalStructure: () => `
    <div class="modal-content recipe-modal-content">
      <div class="recipe-modal-header">
        <h3 class="recipe-modal-title">Crear Nueva Receta</h3>
        <button class="recipe-modal-close" onclick="closeCreateRecipeModal()">×</button>
      </div>
      
      <div class="modal-body">
        <div class="recipe-form-sections">
          ${RECIPE_TEMPLATES.createGeneralInfoForm()}
          ${RECIPE_TEMPLATES.createSetPointsForm()}
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn cancel-btn" onclick="closeCreateRecipeModal()">
          Cancelar
        </button>
        <button class="btn accept-btn" onclick="saveNewRecipe()">
          Guardar Receta
        </button>
      </div>
    </div>
  `,
  
  createGeneralInfoForm: () => `
    <div class="recipe-info-section">
      <h4 class="section-title">
        🔧 Información General
      </h4>
      <div class="info-form-grid">
        <div class="form-group">
          <label for="recipeName">Nombre de la receta:</label>
          <input type="text" id="recipeName" name="recipeName" class="form-input" placeholder="Ej: Café Colombiano Premium" maxlength="30" required>
        </div>
        
        <div class="form-group">
          <label for="coffeeType">Tipo de café:</label>
          <input type="text" id="coffeeType" name="coffeeType" class="form-input" placeholder="Ej: Arábica, Robusta, Blend" maxlength="30" required>
        </div>
        
        <div class="form-group">
          <label for="pressureType">Tipo de presión:</label>
          <select id="pressureType" name="pressureType" class="form-select" required>
            <option value="">Seleccionar...</option>
            <option value="Natural">Natural</option>
            <option value="MaceracionCarbonica">Maceración carbónica</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="recipeMode">Modo de receta:</label>
          <select id="recipeMode" name="recipeMode" class="form-select">
            <option value="">Seleccionar...</option>
            <option value="1">Parametrizada</option>
            <option value="2">Predeterminada</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="recipeDescription">Descripción (opcional):</label>
          <textarea id="recipeDescription" name="recipeDescription" class="form-textarea" rows="2" placeholder="Algunas notas sobre la receta..." maxlength="140"></textarea>
        </div>
      </div>
    </div>
  `,
  
  createSetPointsForm: () => `
    <div class="recipe-setpoints-section">
      <h4 class="section-title">
        📊 Etapas
      </h4>
      <div class="setpoints-form-container">
        <div class="setpoints-header">
          <p class="setpoints-info">Define los parámetros de presión y temperatura para cada etapa del proceso.</p>
        </div>
        
        <div id="setPointsList" class="setpoints-list">
          ${RECIPE_TEMPLATES.createSetPointItem(1)}
        </div>

        <div class="setpoints-footer">
          <button type="button" class="btn btn-add-setpoint" onclick="addNewSetPoint()">
            Agregar etapa
          </button>
        </div>

        <div class="setpoint-total-duration">
          Duración total: <span id="recipeDurationCalculated">0h 0m</span>
        </div>

      </div>
    </div>
  `,
  
  createSetPointItem: (index) => `
    <div class="setpoint-form-item" data-setpoint-index="${index}">
      <div class="setpoint-form-header">
        <strong class="setpoint-form-title">Etapa ${index}</strong>
        <button type="button" class="btn btn-remove-setpoint" onclick="removeSetPoint(${index})" ${index === 1 ? 'style="display:none"' : ''}>
          Eliminar
        </button>
      </div>
      
      <div class="setpoint-form-grid">
        
        <div class="form-group">
          <label for="presion_${index}">Presión (PSI):</label>
          <input type="number" id="presion_${index}" name="presion_${index}" class="form-input" 
                 placeholder="Ej: 5.5" min="0" max="10" step="0.1" required>
        </div>
        
        <div class="form-group">
          <label for="temperatura_${index}">Temperatura (°C):</label>
          <input type="number" id="temperatura_${index}" name="temperatura_${index}" class="form-input" 
                 placeholder="Ej: 85.5" min="20" max="100" step="0.1" required>
        </div>
        
        <div class="form-group">
          <label for="tiempoh_${index}">Horas:</label>
          <input type="number" id="tiempoh_${index}" name="tiempoh_${index}" class="form-input" 
                 placeholder="Ej: 2" min="0" step="1" required onchange="calculateTotalDuration()" oninput="calculateTotalDuration()">
        </div>

        <div class="form-group">
          <label for="tiempom_${index}">Minutos:</label>
          <input type="number" id="tiempom_${index}" name="tiempom_${index}" class="form-input" 
                 placeholder="Ej: 30" min="0" max="59" step="1" onchange="calculateTotalDuration()" oninput="calculateTotalDuration()">
        </div>
      </div>
    </div>
  `,

  // ============ FUNCIONES HELPER ============
  
  getModoText: (modo) => {
    const modos = {
      0: 'Manual',
      1: 'Parametrizada',
      2: 'Predeterminada'
    };
    return modos[modo] || '❓ Desconocido';
  }
};

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.RECIPE_TEMPLATES = RECIPE_TEMPLATES;
}

// Para entornos Node.js (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RECIPE_TEMPLATES;
}
