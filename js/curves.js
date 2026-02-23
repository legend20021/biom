class CurveManager {
  constructor(apiManager, notificationManager) {
    this.apiManager = apiManager;
    this.notificationManager = notificationManager;
    this.curves = [];
    this.currentCurveDetail = null;
    this.isLoading = false;
    
    console.log('🔄 CurveManager inicializado');
  }

  // ============ MÉTODOS PRINCIPALES ============

  async loadCurves(filterParams = null) {
    console.log('📊 Cargando curvas desde API...', filterParams ? 'con filtros:' : '', filterParams);
    
    if (this.isLoading) {
      console.log('⏳ Ya hay una carga en progreso, ignorando...');
      return;
    }

    this.isLoading = true;
    this.showLoadingState();

    try {
      const response = await this.apiManager.getCurvasFiles(filterParams);
      console.log('✅ Respuesta de API curvas recibida:', response);

      if (response && response.curvas && Array.isArray(response.curvas)) {
        this.curves = response.curvas;
        const filterText = filterParams ? ' (filtradas)' : '';
        console.log(`📊 ${this.curves.length} curvas cargadas${filterText}`);
        
        if (this.curves.length === 0) {
          // Mostrar mensaje diferente si es por filtros o realmente no hay datos
          if (filterParams) {
            this.showEmptyState('No se encontraron curvas que coincidan con los filtros aplicados');
          } else {
            this.showEmptyState();
          }
        } else {
          this.renderCurvesList();
        }

        // Notificar éxito con información de filtros
        if (this.notificationManager && this.notificationManager.success) {

          let message = filterParams 
            ? `${this.curves.length} curvas encontradas con los filtros aplicados`
            : `${this.curves.length} curvas cargadas correctamente`;
          
          if (this.curves.length == 0) {
            message = "No se han encontrado datos";
          }
          
          this.notificationManager.success(message, 3000);
        }
      } else {
        console.warn('⚠️ Formato de respuesta inesperado:', response);
        this.showErrorState('Formato de datos no válido');
      }
    } catch (error) {
      console.error('❌ Error cargando curvas:', error);
      this.showErrorState(`Error de conexión: ${error.message}`);

      if (this.notificationManager && this.notificationManager.error) {
        this.notificationManager.error(
          `Error cargando curvas: ${error.message}`,
          5000
        );
      }
    } finally {
      this.isLoading = false;
    }
  }

  showCurveDetailsModal(curve) {
    console.log("📝 Abriendo modal de edición para curva:", curve);
    
    // Usar directamente el objeto curve que ya contiene toda la información necesaria
    // Mapear los campos de la curva a los campos esperados por el modal
    const curveDataForModal = {
      filename: curve.filename, // Incluir filename para identificar la curva que se está editando
      processName: curve.processName || curve.filename || 'Proceso sin nombre',
      processCoffeeType: curve.coffeeType || '',
      processType: curve.processType || '',
      coffeeKg: curve.coffeeKg || '',
      notes: curve.comments || ''
    };
    
    console.log('📝 Datos mapeados para modal:', curveDataForModal);
    
    // Abrir el modal de edición con los datos de la curva
    showProcessEditModal(curveDataForModal);
  }

  async showCurveGraph(filename) {
    console.log(`👁️ Consultando detalles de curva: ${filename}`);
    this.notificationManager.show('Consultando detalles de curva', 3000);
    
    if (!filename) {
      console.error('❌ Filename no proporcionado para consultar detalles');
      return;
    }

    try {
      const curveDetail = await this.apiManager.getCurveDetail(filename);
      console.log('✅ Detalles de curva obtenidos:', curveDetail);
      
      const event = {
        target: {
          getAttribute: () => 'graficas-static',
          classList: { add: () => {} }
        },
        preventDefault: () => {}
      };
      
      showSection(event, curveDetail);
    } catch (error) {
      console.error('❌ Error consultando detalles de curva:', error);
    }
  }

  async deleteCurve(filename, idElement) {
    console.log(`🗑️ Intentando eliminar curva: ${filename}`);
    
    if (!filename) {
      console.error('❌ Filename no proporcionado para eliminar');
      return;
    }

    const res = await openModal(() => this.apiManager.deleteFile(`curvas/${filename}_data.dat`), '¿Estás seguro de eliminar estos datos?');
    
    if (!res) {
      console.log('❌ Eliminación cancelada por el usuario');
      return;
    }

    await this.apiManager.deleteFile(`curvas/${filename}_header.dat`);
    this.notificationManager.show('Datos eliminados...', 2000);

    // Eliminar elemento de la lista
    if (idElement) {
      const element = document.getElementById(idElement);
      if (element) {
        element.remove();
      }
    }

    // Recargar curvas actualizadas
    setTimeout(() => {
      this.loadCurves();
    }, 2000);
  }



  // ============ MÉTODOS DE RENDERIZADO ============

  showLoadingState() {
    const container = this.getCurvesContainer();
    if (container) {
      container.innerHTML = CURVE_TEMPLATES.loadingState();
    }
  }

  showEmptyState(customMessage = null) {
    const container = this.getCurvesContainer();
    if (container) {
      container.innerHTML = CURVE_TEMPLATES.emptyState(customMessage);
    }
  }

  showErrorState(message) {
    const container = this.getCurvesContainer();
    if (container) {
      container.innerHTML = CURVE_TEMPLATES.errorState(message);
    }
  }

  renderCurvesList() {
    console.log(`🎨 Renderizando lista de ${this.curves.length} curvas`);
    
    const container = this.getCurvesContainer();
    if (!container) {
      console.error('❌ No se encontró el contenedor de curvas');
      return;
    }

    if (this.curves.length === 0) {
      this.showEmptyState();
      return;
    }

    // Generar HTML para cada curva en formato card (consistente con recetas)
    const curvesHTML = this.curves.map((curve, index) => 
      CURVE_TEMPLATES.curveItem(curve)
    ).join('');

    // Envolver las curvas en un contenedor simple de lista de cards
    container.innerHTML = `
      <div class="recipes-list curves-list w-100">
        ${curvesHTML}
      </div>
    `;
    console.log(`✅ Lista de curvas renderizada: ${this.curves.length} items`);
  }

  // ============ MÉTODOS AUXILIARES ============

  getCurvesContainer() {
    return document.querySelector('.curves-container');
  }

  // Método para inicializar cuando se muestra la sección
  async init() {
    console.log('🚀 Inicializando CurveManager...');
    await this.loadCurves();
  }

  // Método para refrescar datos
  async refresh() {
    console.log('🔄 Refrescando datos de curvas...');
    await this.loadCurves();
  }
}

// ============ FUNCIÓN DE INICIALIZACIÓN ============

function loadInitCurves() {
  console.log('🔄 Inicializando sistema de gestión de curvas...');
  
  if (!window.apiManager) {
    console.error('❌ ApiManager no disponible para CurveManager');
    return;
  }

  // Crear instancia global de CurveManager
  window.curveManager = new CurveManager(
    window.apiManager,
    window.notificationManager
  );

  // Cargar curvas si estamos en la sección correcta
  const curvasSection = document.getElementById('curvas');
  if (curvasSection && curvasSection.style.display !== 'none') {
    window.curveManager.init();
  }

  // Inicializar estado de filtros
  initializeCurveFilters();
  
  console.log('✅ Sistema de gestión de curvas inicializado');
}

// ============ FUNCIONES PARA MODAL DE EDICIÓN DE PROCESO ============

function showProcessEditModal(curveData = null) {
  const isEditing = curveData !== null;
  console.log(isEditing ? "📝 Abriendo modal para editar curva..." : "📝 Abriendo modal de edición de proceso...", curveData);
  
  // Almacenar el filename de la curva que se está editando para uso en saveProcessData
  window.currentEditingCurveFilename = isEditing ? curveData.filename : null;
  
  // Remover modal existente si existe
  const existingModal = document.getElementById('processEditModalOverlay');
  if (existingModal) {
    existingModal.remove();
    console.log("📝 Modal anterior removido");
  }
  
  // Crear modal dinámico
  const modal = document.createElement('div');
  modal.id = 'processEditModalOverlay';
  modal.className = 'modal-overlay active';
  
  // Usar template para estructura del modal con datos de curva si existe
  const modalContent = CURVE_TEMPLATES.processEditModal(curveData);
  modal.innerHTML = modalContent;
  
  // Buscar el lugar correcto para insertar el modal (igual que en openRecipeModal)
  const existingRecipeModal = document.getElementById('recipeModal');
  if (existingRecipeModal) {
    // Insertar después del modal de recetas existente
    existingRecipeModal.parentNode.insertBefore(modal, existingRecipeModal.nextSibling);
  } else {
    // Si no existe, insertar después del main-container
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.parentNode.insertBefore(modal, mainContainer.nextSibling);
    } else {
      // Fallback: agregar al body
      document.body.appendChild(modal);
    }
  }
  
  // Enfocar el primer campo
  setTimeout(() => {
    const firstInput = document.getElementById('processName');
    if (firstInput) firstInput.focus();
  }, 100);
  
  // Agregar event listener para el contador de caracteres
  const commentsField = document.getElementById('processComments');
  if (commentsField) {
    commentsField.addEventListener('input', updateCharacterCounter);
    // Inicializar contador (especialmente importante si hay datos pre-cargados)
    setTimeout(() => updateCharacterCounter(), 50);
  }
  
  // Agregar event listeners para formulario (similar a openRecipeModal)
  setTimeout(() => {
    addProcessFormErrorListeners();
  }, 100);
  
  // Cerrar con clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProcessEditModal();
    }
  });
  
  // Cerrar con Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeProcessEditModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  console.log("📝 Modal de edición de proceso abierto");
}

function closeProcessEditModal() {
  const modal = document.getElementById('processEditModalOverlay');
  if (modal) {
    modal.remove();
    console.log("❌ Modal de edición de proceso cerrado");
  }
  
  // Limpiar la variable global del filename de edición
  window.currentEditingCurveFilename = null;
}

function updateCharacterCounter() {
  const commentsField = document.getElementById('processComments');
  const counter = document.getElementById('processComments-counter');
  
  if (commentsField && counter) {
    const currentLength = commentsField.value.length;
    counter.textContent = currentLength;
    
    // Cambiar color según la proximidad al límite
    if (currentLength > 120) {
      counter.style.color = '#e74c3c';
    } else if (currentLength > 100) {
      counter.style.color = '#f39c12';
    } else {
      counter.style.color = '#666';
    }
  }
}

function collectProcessFormData() {
  const processTypeValue = document.getElementById('processTypeSelect')?.value;
  const processCoffeeKgValue = document.getElementById('processCoffeeKg')?.value;
  
  const formData = {
    processName: document.getElementById('processName')?.value?.trim() || '',
    processCoffeeType: document.getElementById('processCoffeeType')?.value?.trim() || '',
    processType: processTypeValue ? parseInt(processTypeValue) : null,
    processCoffeeKg: processCoffeeKgValue ? parseInt(processCoffeeKgValue) : null,
    processComments: document.getElementById('processComments')?.value?.trim() || ''
  };
  
  return formData;
}

function validateProcessData(data) {
  const errors = [];
  
  // Validar nombre del proceso
  if (!data.processName || data.processName.length === 0) {
    errors.push({ field: 'processName', message: 'El nombre del proceso es obligatorio' });
  } else if (data.processName.length > 30) {
    errors.push({ field: 'processName', message: 'El nombre no puede exceder 30 caracteres' });
  }
  
  // Validar tipo de café
  if (!data.processCoffeeType || data.processCoffeeType.length === 0) {
    errors.push({ field: 'processCoffeeType', message: 'El tipo de café es obligatorio' });
  } else if (data.processCoffeeType.length > 30) {
    errors.push({ field: 'processCoffeeType', message: 'El tipo de café no puede exceder 30 caracteres' });
  }
  
  // Validar tipo de proceso
  if (data.processType === null || data.processType === undefined || data.processType === 0 || isNaN(data.processType) || data.processType < 1 || data.processType > 13) {
    errors.push({ field: 'processTypeSelect', message: 'Debe seleccionar un tipo de proceso válido' });
  }
  
  // Validar kilos de café
  if (data.processCoffeeKg === null || data.processCoffeeKg === undefined || data.processCoffeeKg === 0 || isNaN(data.processCoffeeKg) || data.processCoffeeKg < 1 || data.processCoffeeKg > 99999999) {
    errors.push({ field: 'processCoffeeKg', message: 'Debe ingresar un número válido.' });
  }
  
  // Validar comentarios
  if (!data.processComments || data.processComments.length === 0) {
    errors.push({ field: 'processComments', message: 'Los comentarios son obligatorios' });
  } else if (data.processComments.length > 140) {
    errors.push({ field: 'processComments', message: 'Los comentarios no pueden exceder 140 caracteres' });
  }
  
  return errors;
}

function clearProcessFormErrors() {
  const fields = ['processName', 'processCoffeeType', 'processTypeSelect', 'processCoffeeKg', 'processComments'];
  
  fields.forEach(fieldId => {
    const fieldElement = document.getElementById(fieldId);
    
    if (fieldElement) {
      // Remover clase de error del campo
      fieldElement.classList.remove('field-error');
      
      // Remover mensaje de error si existe
      const errorMsg = fieldElement.parentNode.querySelector('.field-error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
    }
  });
}

function showProcessFormErrors(errors) {
  // Limpiar errores previos
  clearProcessFormErrors();
  
  errors.forEach(error => {
    showProcessFieldError(error.field, error.message);
  });
}

function showProcessFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) {
    console.warn(`⚠️ Campo ${fieldId} no encontrado para mostrar error`);
    return;
  }
  
  // Agregar clase de error al campo
  field.classList.add('field-error');
  
  // Remover mensaje de error anterior si existe
  const existingError = field.parentNode.querySelector('.field-error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Crear nuevo mensaje de error
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error-message';
  errorDiv.textContent = message;
  
  // Insertar después del campo
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
  
  // Scroll hacia el campo con error
  field.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function addProcessFormErrorListeners() {
  // Lista de campos principales que pueden tener errores
  const processFields = ['processName', 'processCoffeeType', 'processTypeSelect', 'processCoffeeKg', 'processComments'];
  
  processFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      // Limpiar error cuando el usuario empiece a escribir/seleccionar
      field.addEventListener('input', () => clearProcessFieldError(fieldId));
      field.addEventListener('change', () => clearProcessFieldError(fieldId));
    }
  });
}

function clearProcessFieldError(fieldId) {
  const fieldElement = document.getElementById(fieldId);
  
  if (fieldElement) {
    // Remover clase de error del campo
    fieldElement.classList.remove('field-error');
    
    // Remover mensaje de error si existe
    const errorMsg = fieldElement.parentNode.querySelector('.field-error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }
}

async function saveProcessData() {
  console.log("💾 Intentando guardar datos del proceso...");
  
  // Recopilar datos del formulario
  const formData = collectProcessFormData();
  
  // Validar datos
  const errors = validateProcessData(formData);
  
  if (errors.length > 0) {
    console.log("❌ Errores de validación:", errors);
    showProcessFormErrors(errors);
    return;
  }
  
  // Limpiar errores si no hay problemas
  clearProcessFormErrors();
  
  // Preparar datos para enviar al backend
  // Si estamos editando una curva existente, usar su filename, sino usar el del estado global
  const filenameToUse = window.currentEditingCurveFilename || window.state.nombre_ultimo_proceso || '';
  
  // Validar que el filename sea válido antes de continuar
  if (!filenameToUse || typeof filenameToUse !== 'string' || filenameToUse.trim().length === 0) {
    const errorMsg = '❌ No se pudo identificar el archivo del proceso a actualizar. Por favor, intenta nuevamente.';
    console.error("❌ Filename inválido:", filenameToUse);
    
    // Mostrar notificación de error
    if (window.notificationManager && window.notificationManager.error) {
      window.notificationManager.error(errorMsg, 5000);
    }
    
    return; // Salir de la función sin continuar
  }
  
  // Determinar si debemos actualizar la receta:
  // - Si estamos editando una curva existente: NO actualizar receta (false)
  // - Si estamos creando/editando un proceso nuevo: SÍ actualizar receta (true)
  const shouldUpdateRecipe = !window.currentEditingCurveFilename;
  
  const processDataToSend = {
    filename: filenameToUse.trim(),
    nombre: formData.processName,
    tipoCafe: formData.processCoffeeType,
    tipoProceso: formData.processType,
    kilosCafe: formData.processCoffeeKg,
    comentarios: formData.processComments,
    actualizarReceta: shouldUpdateRecipe
  };
  
  console.log("📋 Datos del proceso a enviar:", processDataToSend);
  
  try {
    // Mostrar indicador de carga (deshabilitar botón)
    const saveButton = document.querySelector('.accept-btn');
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = 'Guardando...';
    }
    
    // Enviar datos al backend
    const response = await window.apiManager.updateProcessData(processDataToSend);
    
    console.log("✅ Respuesta del servidor:", response);
    
    if (response && response.success) {
      // Mostrar notificación de éxito
      if (notificationManager) {
        notificationManager.show('Datos del proceso actualizados correctamente', 'success');
      }
      
      // Cerrar modal después del éxito (esto ya limpia la variable global)
      closeProcessEditModal();
      
      // Opcional: Recargar la lista de curvas para mostrar datos actualizados
      if (window.curveManager && typeof window.curveManager.refresh === 'function') {
        setTimeout(() => {
          window.curveManager.refresh();
        }, 1000);
      }
      
    } else {
      throw new Error(response?.error || 'Error desconocido del servidor');
    }
    
  } catch (error) {
    console.error("❌ Error guardando datos del proceso:", error);
    
    // Mostrar error al usuario
    if (window.notificationManager && window.notificationManager.error) {
      window.notificationManager.error(
        `Error al guardar: ${error.message}`,
        5000
      );
    }
    
  } finally {
    // Restaurar estado del botón
    const saveButton = document.querySelector('.accept-btn');
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = 'Guardar Cambios';
    }
  }
}

// ============ FUNCIONES DE FILTRADO DE CURVAS ============

/**
 * Inicializa el estado de los filtros de curvas al cargar la página
 */
function initializeCurveFilters() {
  console.log('🔧 Inicializando filtros de curvas...');
  
  // Verificar que estemos en la sección de curvas
  const curvasSection = document.getElementById('curvas');
  if (!curvasSection || curvasSection.style.display === 'none') {
    console.log('⏭️ Sección de curvas no visible, omitiendo inicialización de filtros');
    return;
  }
  
  // Resetear el select principal
  const attributeSelect = document.getElementById('curvesFilterAttribute');
  if (attributeSelect) {
    attributeSelect.value = '';
    console.log('🔄 Select principal reseteado');
  }
  
  // Limpiar todos los campos de filtro
  const nameInput = document.getElementById('curveNameInput');
  if (nameInput) {
    nameInput.value = '';
  }
  
  const processSelect = document.getElementById('curveProcessSelect');
  if (processSelect) {
    processSelect.value = '';
  }
  
  const dateFrom = document.getElementById('curveDateFrom');
  const dateTo = document.getElementById('curveDateTo');
  if (dateFrom) dateFrom.value = '';
  if (dateTo) dateTo.value = '';
  
  // Ocultar todos los filtros dinámicos
  const dynamicFilters = document.querySelectorAll('.curves-dynamic-filter');
  dynamicFilters.forEach(filter => {
    filter.style.display = 'none';
  });
  
  // Ocultar botones de acción
  const actionsContainer = document.getElementById('curveSearchActions');
  if (actionsContainer) {
    actionsContainer.style.display = 'none';
  }
  
  // Limpiar errores visuales si la función existe
  if (typeof clearAllFieldErrors === 'function') {
    clearAllFieldErrors();
  }
  
  console.log('✅ Filtros de curvas inicializados correctamente');
}

/**
 * Maneja el cambio en el select de atributo de filtro
 * @param {string} selectedAttribute - El atributo seleccionado
 */
function handleCurveAttributeChange(selectedAttribute) {
  console.log('🔍 Atributo de filtro seleccionado:', selectedAttribute);
  
  // Ocultar todos los filtros dinámicos
  const dynamicFilters = document.querySelectorAll('.curves-dynamic-filter');
  dynamicFilters.forEach(filter => {
    filter.style.display = 'none';
  });
  
  // Ocultar botones de acción
  const actionsContainer = document.getElementById('curveSearchActions');
  if (actionsContainer) {
    actionsContainer.style.display = 'none';
  }
  
  // Mostrar el filtro correspondiente y los botones de acción
  if (selectedAttribute) {
    let targetFilterId = '';
    
    switch (selectedAttribute) {
      case 'nombre':
        targetFilterId = 'curveNameFilter';
        break;
      case 'tipo_proceso':
        targetFilterId = 'curveProcessFilter';
        break;
      case 'fecha':
        targetFilterId = 'curveDateFilter';
        break;
    }
    
    if (targetFilterId) {
      const targetFilter = document.getElementById(targetFilterId);
      if (targetFilter) {
        targetFilter.style.display = 'block';
      }
      
      if (actionsContainer) {
        actionsContainer.style.display = 'flex';
      }
    }
  }
}

/**
 * Valida el campo de nombre según las reglas especificadas
 * @param {string} name - El nombre a validar
 * @returns {object} - Objeto con resultado de validación
 */
function validateCurveName(name) {
  const errors = [];
  
  // Verificar que no esté vacío
  if (!name || name.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  }
  
  // Verificar longitud
  if (name && name.length > 30) {
    errors.push('El nombre no puede tener más de 30 caracteres');
  }
  
  // Verificar caracteres especiales (solo permitir letras, números, espacios, guiones y guiones bajos)
  const specialCharsRegex = /[^a-zA-Z0-9\s\-_]/;
  if (name && specialCharsRegex.test(name)) {
    errors.push('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Valida el campo de tipo de proceso
 * @param {string} processType - El tipo de proceso seleccionado
 * @returns {object} - Objeto con resultado de validación
 */
function validateProcessType(processType) {
  const errors = [];
  
  if (!processType || processType === '') {
    errors.push('Debe seleccionar un tipo de proceso');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Valida los campos de fecha
 * @param {string} dateFrom - Fecha desde
 * @param {string} dateTo - Fecha hasta (opcional)
 * @returns {object} - Objeto con resultado de validación
 */
function validateDateRange(dateFrom, dateTo) {
  const errors = [];
  
  // Fecha desde es obligatoria
  if (!dateFrom || dateFrom.trim() === '') {
    errors.push('La fecha "desde" es obligatoria');
  }
  
  // Si ambas fechas están presentes, verificar que "desde" sea menor o igual que "hasta"
  if (dateFrom && dateTo) {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    
    if (fromDate > toDate) {
      errors.push('La fecha "desde" debe ser anterior o igual a la fecha "hasta"');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Convierte una fecha del formato YYYY-MM-DD a DD-MM-YYYY
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} - Fecha en formato DD-MM-YYYY
 */
function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } else {
    return '';
  }
}

/**
 * Muestra errores de validación al usuario
 * @param {Array} errors - Array de mensajes de error
 */
function showValidationErrors(errors) {
  const errorMessage = errors.join('\n');
  
  if (window.notificationManager && window.notificationManager.error) {
    window.notificationManager.error(`Errores de validación:\n${errorMessage}`, 5000);
  }
}

/**
 * Muestra error visual en un campo específico
 * @param {string} fieldId - ID del campo
 * @param {string} errorMessage - Mensaje de error (opcional)
 */
function showFieldError(fieldId, errorMessage = '') {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Agregar clase de error
  field.classList.add('error');
  
  // Si hay mensaje de error, crear elemento para mostrarlo
  if (errorMessage) {
    // Remover mensaje de error anterior si existe
    const existingError = field.parentNode.querySelector('.curves-error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Crear nuevo mensaje de error
    const errorElement = document.createElement('div');
    errorElement.className = 'curves-error-message';
    errorElement.textContent = errorMessage;
    
    // Insertar después del campo
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }
}

/**
 * Limpia el error visual de un campo específico
 * @param {string} fieldId - ID del campo
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Remover clase de error
  field.classList.remove('error');
  
  // Remover mensaje de error si existe
  const errorMessage = field.parentNode.querySelector('.curves-error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

/**
 * Limpia todos los errores visuales de los campos de filtro
 */
function clearAllFieldErrors() {
  const fieldIds = [
    'curveNameInput',
    'curveProcessSelect', 
    'curveDateFrom',
    'curveDateTo'
  ];
  
  fieldIds.forEach(fieldId => clearFieldError(fieldId));
}

/**
 * Realiza la búsqueda de curvas basada en los filtros seleccionados
 */
async function searchCurves() {
  const selectedAttribute = document.getElementById('curvesFilterAttribute')?.value;
  
  if (!selectedAttribute) {
    console.warn('⚠️ No se ha seleccionado un atributo de filtro');
    if (window.notificationManager && window.notificationManager.warning) {
      window.notificationManager.warning('Debe seleccionar un tipo de filtro', 3000);
    }
    return;
  }
  
  let filterValue = '';
  let filterData = {};
  let validationResult = { isValid: true, errors: [] };
  
  switch (selectedAttribute) {
    case 'nombre':
      filterValue = document.getElementById('curveNameInput')?.value || '';
      validationResult = validateCurveName(filterValue);
      
      if (validationResult.isValid) {
        filterData = {
          attribute: 'nombre',
          value: filterValue.trim()
        };
      }
      break;
      
    case 'tipo_proceso':
      filterValue = document.getElementById('curveProcessSelect')?.value || '';
      validationResult = validateProcessType(filterValue);
      
      if (validationResult.isValid) {
        filterData = {
          attribute: 'tipo_proceso',
          value: filterValue,
          valueText: getProcessTypeName(filterValue)
        };
      }
      break;
      
    case 'fecha':
      const dateFrom = document.getElementById('curveDateFrom')?.value || '';
      const dateTo = document.getElementById('curveDateTo')?.value || '';
      validationResult = validateDateRange(dateFrom, dateTo);
      
      if (validationResult.isValid) {
        filterData = {
          attribute: 'fecha',
          dateFrom: formatDateToDDMMYYYY(dateFrom),
          dateTo: dateTo ? formatDateToDDMMYYYY(dateTo) : ''
        };
      }
      break;
  }
  
  // Si hay errores de validación, mostrarlos y no continuar
  if (!validationResult.isValid) {
    // Limpiar errores visuales anteriores
    clearAllFieldErrors();
    
    // Mostrar errores visuales en los campos específicos
    switch (selectedAttribute) {
      case 'nombre':
        showFieldError('curveNameInput', validationResult.errors[0]);
        break;
      case 'tipo_proceso':
        showFieldError('curveProcessSelect', validationResult.errors[0]);
        break;
      case 'fecha':
        if (validationResult.errors.some(err => err.includes('desde'))) {
          showFieldError('curveDateFrom', 'La fecha "desde" es obligatoria');
        }
        if (validationResult.errors.some(err => err.includes('anterior'))) {
          showFieldError('curveDateTo', 'Debe ser posterior a la fecha "desde"');
        }
        break;
    }
    
    showValidationErrors(validationResult.errors);
    return;
  }
  
  // Limpiar errores visuales si la validación es exitosa
  clearAllFieldErrors();
  
  console.log('🔍 Filtros de búsqueda aplicados:', filterData);
  
  // Mostrar notificación de filtro aplicado
  if (window.notificationManager && window.notificationManager.showSuccess) {
    let message = `🔍 Filtro aplicado: ${selectedAttribute}`;
    
    if (selectedAttribute === 'fecha' && filterData.dateFrom && filterData.dateTo) {
      message += ` (${filterData.dateFrom} - ${filterData.dateTo})`;
    } else if (selectedAttribute === 'fecha' && filterData.dateFrom) {
      message += ` (desde: ${filterData.dateFrom})`;
    } else if (filterData.value) {
      message += ` = "${filterData.valueText || filterData.value}"`;
    }
    
    window.notificationManager.showSuccess(message, 3000);
  }
  
  // Log completo del filtro enviado
  console.log('📋 Log de filtro enviado - Datos completos:', {
    timestamp: new Date().toISOString(),
    filter: filterData,
    action: 'search_curves'
  });
  
  // Aplicar filtros a través del CurveManager
  if (window.curveManager && typeof window.curveManager.loadCurves === 'function') {
    try {
      await window.curveManager.loadCurves(filterData);
    } catch (error) {
      console.error('❌ Error aplicando filtros:', error);
      if (window.notificationManager && window.notificationManager.showError) {
        window.notificationManager.showError(
          `❌ Error aplicando filtros: ${error.message}`,
          5000
        );
      }
    }
  } else {
    console.warn('⚠️ CurveManager no disponible para aplicar filtros');
  }
}

/**
 * Limpia todos los filtros aplicados
 */
async function clearCurveFilters() {
  console.log('🗑️ Limpiando filtros de curvas');
  
  // Resetear el select principal
  const attributeSelect = document.getElementById('curvesFilterAttribute');
  if (attributeSelect) {
    attributeSelect.value = '';
  }
  
  // Limpiar campos de nombre
  const nameInput = document.getElementById('curveNameInput');
  if (nameInput) {
    nameInput.value = '';
  }
  
  // Resetear select de proceso
  const processSelect = document.getElementById('curveProcessSelect');
  if (processSelect) {
    processSelect.value = '';
  }
  
  // Limpiar campos de fecha
  const dateFrom = document.getElementById('curveDateFrom');
  const dateTo = document.getElementById('curveDateTo');
  if (dateFrom) dateFrom.value = '';
  if (dateTo) dateTo.value = '';
  
  // Ocultar todos los filtros dinámicos
  const dynamicFilters = document.querySelectorAll('.curves-dynamic-filter');
  dynamicFilters.forEach(filter => {
    filter.style.display = 'none';
  });
  
  // Ocultar botones de acción
  const actionsContainer = document.getElementById('curveSearchActions');
  if (actionsContainer) {
    actionsContainer.style.display = 'none';
  }
  
  // Limpiar errores visuales
  clearAllFieldErrors();
  
  // Mostrar notificación
  if (window.notificationManager && window.notificationManager.info) {
    window.notificationManager.info('🗑️ Filtros limpiados', 2000);
  }
  
  // Log del filtro limpiado
  console.log('📋 Log de filtro enviado - Filtros limpiados:', {
    timestamp: new Date().toISOString(),
    action: 'clear_curve_filters'
  });
  
  // Recargar todas las curvas sin filtros
  if (window.curveManager && typeof window.curveManager.loadCurves === 'function') {
    try {
      await window.curveManager.loadCurves(); // Sin parámetros para cargar todas las curvas
    } catch (error) {
      console.error('❌ Error recargando curvas:', error);
      if (window.notificationManager && window.notificationManager.showError) {
        window.notificationManager.showError(
          `❌ Error recargando curvas: ${error.message}`,
          5000
        );
      }
    }
  } else {
    console.warn('⚠️ CurveManager no disponible para recargar curvas');
  }
}



/**
 * Obtiene el nombre del tipo de proceso basado en su código
 * @param {string} processCode - Código del tipo de proceso
 * @returns {string} - Nombre del tipo de proceso
 */
function getProcessTypeName(processCode) {
  const processTypes = {
    '0': 'No definido',
    '1': 'Lavado (Washed)',
    '2': 'Natural (Dry)',
    '3': 'Honey (Miel)',
    '4': 'Semilavado (Wet-Hulled)',
    '5': 'Anaeróbico',
    '6': 'Maceración carbónica (Carbonic Maceration)',
    '7': 'Fermentación láctica',
    '8': 'Fermentación acética',
    '9': 'Doble fermentación (Double Fermentation)',
    '10': 'Proceso Koji',
    '11': 'Infusionados',
    '12': 'Rehidratación',
    '13': 'Procesos Mixtos/Híbridos'
  };
  
  return processTypes[processCode] || 'Desconocido';
}

// Asegurar que los filtros se inicialicen cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Delay para asegurar que todos los elementos estén renderizados
  setTimeout(() => {
    if (typeof initializeCurveFilters === 'function') {
      initializeCurveFilters();
    }
    
    // Agregar listener para detectar restauración automática del navegador
    const attributeSelect = document.getElementById('curvesFilterAttribute');
    if (attributeSelect) {
      // Si el select ya tiene un valor al cargar, resetearlo
      if (attributeSelect.value && attributeSelect.value !== '') {
        console.log('🔧 Detectado valor persistente en filtro, reseteando...');
        attributeSelect.value = '';
        initializeCurveFilters();
      }
    }
  }, 500);
});

// Exportar para uso global
window.CurveManager = CurveManager;
window.loadInitCurves = loadInitCurves;
window.showProcessEditModal = showProcessEditModal;
window.closeProcessEditModal = closeProcessEditModal;
window.saveProcessData = saveProcessData;
window.handleCurveAttributeChange = handleCurveAttributeChange;
window.searchCurves = searchCurves;
window.clearCurveFilters = clearCurveFilters;
window.getProcessTypeName = getProcessTypeName;
window.validateCurveName = validateCurveName;
window.validateProcessType = validateProcessType;
window.validateDateRange = validateDateRange;
window.formatDateToDDMMYYYY = formatDateToDDMMYYYY;
window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;
window.clearAllFieldErrors = clearAllFieldErrors;
window.initializeCurveFilters = initializeCurveFilters;
