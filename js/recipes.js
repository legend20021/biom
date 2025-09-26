// ========================================
// GESTOR DE RECETAS PARA BIOMASTER ESP32
// ========================================

class RecipeManager {
  constructor(apiManager) {
    this.apiManager = apiManager;
    this.recipes = [];
    this.isLoading = false;
    this.lastUpdate = null;
    this.recipesContainers = {
      manual: null,
      parametrizada: null,
      predeterminada: null
    };
    
    this.init();
  }

  async init() {
    
    // Buscar contenedores de recetas por modo
    this.recipesContainers = {
      manual: document.querySelector('.recipes-section .recipes-list-manual'),      // Primera sección (manual)
      parametrizada: document.querySelector('.recipes-section .recipes-list'), // Segunda sección (parametrizada)
      predeterminada: document.querySelector('.recipes-section .recipes-list-predeterminada')  // Tercera sección (predeterminada)
    };
    
    // Verificar que al menos un contenedor esté disponible
    const containersFound = Object.values(this.recipesContainers).some(container => container !== null);
    
    if (containersFound) {
      await this.loadRecipes();
      // Inicializar el filtro después de cargar las recetas
      setTimeout(() => this.initRecipeFilter(), 100);
    } else {
      console.warn("⚠️ No se encontraron contenedores de recetas");
    }
  }

  async loadRecipes() {
    if (this.isLoading) {
      console.log("📜 Carga de recetas ya en progreso...");
      return;
    }

    try {
      this.isLoading = true;
      
      // Mostrar indicador de carga
      this.showLoadingState();
      
      // Obtener recetas desde la API
      const response = await apiManager.getRecetasFiles();
      
      if (response && response.recetas) {
        this.recipes = response.recetas;
        this.lastUpdate = new Date();
        
        
        // Renderizar recetas en el DOM
        this.renderRecipes();
        
      } else {
        throw new Error("Formato de respuesta inválido");
      }
      
    } catch (error) {
      console.error("❌ Error cargando recetas:", error);
      this.showErrorState(error.message);
      
      // Mostrar notificación de error si está disponible
      if (window.notificationManager) {
        window.notificationManager.show("Error al cargar las recetas", "error");
      }
      
    } finally {
      this.isLoading = false;
    }
  }

  renderRecipes() {

    // Separar recetas por modo
    const recipesByMode = {
      manual: this.recipes.filter(recipe => (recipe.modo || 0) === 0),
      parametrizada: this.recipes.filter(recipe => (recipe.modo || 0) === 1),
      predeterminada: this.recipes.filter(recipe => (recipe.modo || 0) === 2)
    };


    // Renderizar cada tipo en su contenedor correspondiente
    this.renderRecipesByMode('manual', recipesByMode.manual);
    this.renderRecipesByMode('parametrizada', recipesByMode.parametrizada);
    this.renderRecipesByMode('predeterminada', recipesByMode.predeterminada);
  }

  renderRecipesByMode(mode, recipes) {
    const container = this.getContainerForMode(mode);
    
    if (!container) {
      console.warn(`⚠️ Contenedor para modo ${mode} no encontrado`);
      return;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    if (recipes.length === 0) {
      this.showEmptyStateForMode(container, mode);
      return;
    }

    // Crear elementos para cada receta del modo específico
    recipes.forEach((recipe, index) => {
      const recipeElement = this.createRecipeElement(recipe, index);
      container.appendChild(recipeElement);
    });
  }

  getContainerForMode(mode) {
    switch(mode) {
      case 'manual':
        return this.recipesContainers.manual;
      
      case 'parametrizada':
        return this.recipesContainers.parametrizada;
      
      case 'predeterminada':
        return this.recipesContainers.predeterminada;
      
      default:
        return null;
    }
  }

  createRecipeElement(recipe, index) {
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-item';
    recipeDiv.setAttribute('data-recipe-id', recipe.filename);

    // Formatear duración de manera más legible
    const duration = this.formatDuration(recipe.totalTime);
    const createdDate = this.formatDate(recipe.created_date, recipe.created_time);

    recipeDiv.innerHTML = RECIPE_TEMPLATES.recipeItem(recipe, duration, createdDate, window.state.start);
    return recipeDiv;
  }

  showLoadingState() {
    // Mostrar estado de carga solo en el contenedor de recetas parametrizadas (el principal)
    if (this.recipesContainers.parametrizada) {
      this.recipesContainers.parametrizada.innerHTML = RECIPE_TEMPLATES.loadingState();
    }
  }

  showErrorState(errorMessage) {
    // Mostrar error solo en el contenedor de recetas parametrizadas (el principal)
    if (this.recipesContainers.parametrizada) {
      this.recipesContainers.parametrizada.innerHTML = RECIPE_TEMPLATES.errorState(errorMessage);
    }
  }


  showEmptyStateForMode(container, mode) {
    if (!container) return;
    
    const modeNames = {
      manual: 'manuales',
      parametrizada: 'parametrizadas', 
      predeterminada: 'predeterminadas'
    };
    
    const modeName = modeNames[mode] || mode;
    
    container.innerHTML = `
      <div class="recipe-empty-state">
        <div class="empty-icon">📜</div>
        <h4>No hay recetas ${modeName}</h4>
        <p>No se encontraron recetas de tipo ${modeName} en el sistema.</p>
      </div>
    `;
  }

  // ============ ACCIONES DE RECETAS ============

  async startRecipe(filename) {
    try {
      console.log(`▶️ Iniciando receta: ${filename}`);
      
      const recipe = this.recipes.find(r => r.filename === filename);
      if (!recipe) {
        throw new Error("Receta no encontrada");
      }

      // Confirmar acción con el usuario
      const res = await openModal(() => console.log('Confirmando inicio de receta automática'));

      if (!res) {
        console.log("📜 Inicio de receta cancelado por el usuario");
        return;
      }

      // Llamar al endpoint de proceso automático
      console.log(`🚀 Enviando comando de proceso automático para: ${filename}`);
      const result = await window.startAutomaticProcess(filename);

      if (result.success) {
        if (window.notificationManager) {
          window.notificationManager.show(`Proceso automático iniciado: "${recipe.recipeName}"`, "success");
        }
        console.log(`✅ Proceso automático iniciado exitosamente: ${recipe.recipeName}`);
        console.log('📊 Respuesta del servidor:', result);
      } else {
        throw new Error(result.message || "Error desconocido al iniciar proceso automático");
      }

    } catch (error) {
      console.error("❌ Error iniciando proceso automático:", error);
      if (window.notificationManager) {
        window.notificationManager.show(`Error al iniciar proceso: ${error.message}`, "error");
      }
    }
  }

  async viewRecipe(filename) {
    try {
      console.log(`👁️ Viendo receta: ${filename}`);
      
      const recipe = this.recipes.find(r => r.filename === filename);
      if (!recipe) {
        throw new Error("Receta no encontrada");
      }

      // Mostrar indicador de carga
      if (window.notificationManager) {
        window.notificationManager.show("Cargando detalles de la receta...", "info");
      }

      // Obtener detalles completos de la receta desde la API
      const recipeDetails = await apiManager.getRecipeDetail(filename);
      
      if (!recipeDetails.success) {
        throw new Error("Error al obtener detalles de la receta");
      }

      // Crear y mostrar modal con los detalles
      this.showRecipeDetailsModal(recipeDetails);

      console.log(`✅ Mostrando detalles de: ${recipeDetails.recipeName}`);

    } catch (error) {
      console.error("❌ Error viendo receta:", error);
    }
  }

  showRecipeDetailsModal(recipeDetails) {
    console.log("📋 Creando modal para receta:", recipeDetails);
    
    // Remover modal existente si existe
    const existingModal = document.getElementById('recipeDetailsModal');
    if (existingModal) {
      existingModal.remove();
      console.log("📋 Modal anterior removido");
    }
    
    // Crear modal dinámico con clases CSS
    const modal = document.createElement('div');
    modal.id = 'recipeDetailsModal';
    
    // Generar secciones usando templates
    const generalInfoHtml = RECIPE_TEMPLATES.generalInfo(recipeDetails, this.formatDuration.bind(this));
    const setPointsHtml = RECIPE_TEMPLATES.setPointsSection(
      recipeDetails.setPoints ? this.renderSetPoints(recipeDetails.setPoints) : RECIPE_TEMPLATES.noSetPoints()
    );
    
    // Estructura completa del modal usando template
    modal.innerHTML = RECIPE_TEMPLATES.modalStructure(recipeDetails, generalInfoHtml, setPointsHtml, window.state.start);
    
    // Agregar al DOM
    document.body.appendChild(modal);
    console.log("📋 Modal agregado al DOM exitosamente");
    
    // Cerrar con clic fuera del contenido
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        console.log("📋 Cerrando modal por clic fuera");
        modal.remove();
      }
    });
    
    // Cerrar con Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        console.log("📋 Cerrando modal por Escape");
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Verificar que esté visible
    setTimeout(() => {
      console.log("📋 Modal visible:", modal.offsetWidth > 0 && modal.offsetHeight > 0);
      console.log("📋 Z-index:", window.getComputedStyle(modal).zIndex);
    }, 50);
  }

  renderSetPoints(setPoints) {
    if (!Array.isArray(setPoints) || setPoints.length === 0) {
      return RECIPE_TEMPLATES.noSetPoints();
    }

    return setPoints.map((point, index) => 
      RECIPE_TEMPLATES.setPointItem(point, index)
    ).join('');
  }


  async deleteRecipe(filename) {
    try {
      console.log(`🗑️ Eliminando receta: ${filename}`);
      
      const recipe = this.recipes.find(r => r.filename === filename);
      if (!recipe) {
        throw new Error("Receta no encontrada");
      }

      // Confirmar eliminación
      const res = await openModal(() =>  this.apiManager.deleteFile(`recetas/${filename}_header.dat`) , '¿Estás seguro de eliminar estos datos?');
      await this.apiManager.deleteFile(`recetas/${filename}_setpoints.dat`)

      if (!res) {
        console.log("🗑️ Eliminación cancelada por el usuario");
        return;
      }

      // TODO: Implementar eliminación en el ESP32 via API
      // Por ahora simular eliminación local
      
      // Eliminar de la lista local
      this.recipes = this.recipes.filter(r => r.filename !== filename);
      
      // Re-renderizar
      this.renderRecipes();

      if (window.notificationManager) {
        window.notificationManager.show(`Receta "${recipe.recipeName}" eliminada`, "success");
      }

      console.log(`✅ Receta eliminada: ${recipe.recipeName}`);

    } catch (error) {
      console.error("❌ Error eliminando receta:", error);
      if (window.notificationManager) {
        window.notificationManager.show(`Error al eliminar receta: ${error.message}`, "error");
      }
    }
  }

  // ============ MÉTODOS AUXILIARES ============

  formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  formatDate(dateString, timeString) {
    try {
      const date = new Date(`${dateString}T${timeString}`);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return `${dateString} ${timeString}`;
    }
  }

  async confirmAction(title, message) {
    // Si existe un modal de confirmación global, usarlo
    if (typeof window.showConfirmationModal === 'function') {
      return new Promise((resolve) => {
        window.showConfirmationModal(title, message, resolve);
      });
    }
    
    // Fallback a confirm nativo
    return confirm(`${title}\n\n${message}`);
  }

  // ============ FILTRADO DE SECCIONES ============

  /**
   * Filtra y muestra las secciones de recetas según el tipo seleccionado
   * @param {string} selectedType - Tipo de receta seleccionado ('created', 'parametrized', 'predetermined')
   */
  filterRecipesByType(selectedType) {
    
    // Mapeo de valores del select a IDs de secciones
    const sectionMapping = {
      'created': 'createdRecipesSection',
      'parametrized': 'parametrizedRecipesSection', 
      'predetermined': 'predeterminedRecipesSection'
    };
    
    // Obtener todas las secciones de recetas
    const allSections = Object.values(sectionMapping);
    
    // Ocultar todas las secciones primero
    allSections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.style.display = 'none';
      }
    });
    
    // Mostrar solo la sección seleccionada
    const selectedSectionId = sectionMapping[selectedType];
    if (selectedSectionId) {
      const selectedSection = document.getElementById(selectedSectionId);
      if (selectedSection) {
        selectedSection.style.display = 'block';
        
        // Notificación opcional si está disponible
        if (window.notificationManager) {
          const typeNames = {
            'created': 'Recetas Creadas',
            'parametrized': 'Recetas Parametrizadas', 
            'predetermined': 'Recetas Predeterminadas'
          };
          window.notificationManager.show(`Mostrando: ${typeNames[selectedType]}`, "info");
        }
      } else {
        console.warn(`📜 ⚠️ Sección no encontrada: ${selectedSectionId}`);
      }
    } else {
      console.warn(`📜 ⚠️ Tipo no reconocido: ${selectedType}`);
    }
  }

  /**
   * Inicializa el filtro de recetas cuando se carga la página
   */
  initRecipeFilter() {
    
    // Obtener el valor seleccionado actualmente
    const filterSelect = document.getElementById('recipesFilter');
    if (filterSelect) {
      const initialValue = filterSelect.value;
      
      // Aplicar el filtro inicial
      this.filterRecipesByType(initialValue);
    } else {
      console.warn("📜 ⚠️ Select de filtro de recetas no encontrado");
    }
  }

  // ============ MÉTODO PÚBLICO PARA ACTUALIZAR ============

  async refresh() {
    await this.loadRecipes();
  }
}

// ============ FUNCIONES GLOBALES ============

/**
 * Función global para filtrar recetas (llamada desde HTML)
 * @param {string} selectedType - Tipo de receta seleccionado
 */
function filterRecipesByType(selectedType) {
  if (window.recipeManager) {
    window.recipeManager.filterRecipesByType(selectedType);
  } else {
    console.warn("📜 ⚠️ RecipeManager no está inicializado");
  }
}

/**
 * Función global para inicializar el filtro (llamada desde HTML)
 */
function initRecipeFilter() {
  if (window.recipeManager) {
    window.recipeManager.initRecipeFilter();
  } else {
    console.warn("📜 ⚠️ RecipeManager no está inicializado");
  }
}

// ============ EVENT LISTENERS PARA FORMULARIOS ============

// Función para agregar listeners de limpieza de errores
function addFormErrorListeners() {
  // Lista de campos principales que pueden tener errores
  const mainFields = ['recipeName', 'coffeeType', 'pressureType', 'recipeMode', 'recipeDescription'];
  
  mainFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      // Limpiar error cuando el usuario empiece a escribir/seleccionar
      field.addEventListener('input', () => clearFieldError(fieldId));
      field.addEventListener('change', () => clearFieldError(fieldId));
    }
  });
}

// Función para agregar listeners a setpoints dinámicos
function addSetPointErrorListeners() {
  // Obtener todos los setpoints actuales
  const setPointItems = document.querySelectorAll('.setpoint-form-item');
  
  setPointItems.forEach((item, index) => {
    const indexNum = index + 1;
    const fields = [`presion_${indexNum}`, `temperatura_${indexNum}`, `tiempoh_${indexNum}`, `tiempom_${indexNum}`];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        // Remover listeners anteriores para evitar duplicados
        field.removeEventListener('input', clearFieldErrorHandler);
        field.removeEventListener('change', clearFieldErrorHandler);
        field.removeEventListener('blur', recalculateDurationHandler);
        
        // Agregar nuevos listeners
        field.addEventListener('input', clearFieldErrorHandler);
        field.addEventListener('change', clearFieldErrorHandler);
        field.addEventListener('blur', recalculateDurationHandler);
      }
    });
  });
}

// Handlers reutilizables
function clearFieldErrorHandler(event) {
  clearFieldError(event.target.id);
}

function recalculateDurationHandler(event) {
  // Recalcular duración cuando se cambian los tiempos
  if (event.target.id.includes('tiempoh_') || event.target.id.includes('tiempom_')) {
    calculateTotalDuration();
  }
}

// ============ INICIALIZACIÓN ============

let recipeManager = null;

function loadInitReceipes() {
  const initRecipeManager = () => {
    if (window.apiManager) {
      recipeManager = new RecipeManager(apiManager);
      window.recipeManager = recipeManager; // Hacer disponible globalmente
    } else {
      // Reintentar en 500ms si apiManager no está listo
      setTimeout(initRecipeManager, 500);
    }
  };

  initRecipeManager();
}



// ============ FUNCIONES DE MODAL DE CREACIÓN ============

// Función para abrir el modal de recetas (crear nueva)
function openRecipeModal() {
  console.log("📝 Abriendo modal para crear nueva receta");
  
  // Remover modal existente si existe
  const existingModal = document.getElementById('createRecipeModal');
  if (existingModal) {
    existingModal.remove();
    console.log("📝 Modal anterior removido");
  }
  
  // Crear modal dinámico
  const modal = document.createElement('div');
  modal.id = 'createRecipeModal';
  modal.className = 'modal-overlay active';
  
  // Usar template para estructura del modal
  const modalContent = RECIPE_TEMPLATES.createModalStructure();
  console.log("📝 Contenido del modal generado:", modalContent.substring(0, 200) + "...");
  modal.innerHTML = modalContent;
  
  // Buscar el lugar correcto para insertar el modal (después de otros modales)
  const existingRecipeModal = document.getElementById('recipeModal');
  if (existingRecipeModal) {
    // Insertar después del modal de recetas existente
    existingRecipeModal.parentNode.insertBefore(modal, existingRecipeModal.nextSibling);
    console.log("📝 Modal insertado después del recipeModal existente");
  } else {
    // Si no existe, insertar después del main-container
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.parentNode.insertBefore(modal, mainContainer.nextSibling);
      console.log("📝 Modal insertado después del main-container");
    } else {
      // Fallback: agregar al body
      document.body.appendChild(modal);
      console.log("📝 Modal agregado al body como fallback");
    }
  }
  console.log("📝 Modal de creación agregado al DOM");
  
  // Agregar event listeners para formulario
  setTimeout(() => {
    addFormErrorListeners();
    addSetPointErrorListeners();
    calculateTotalDuration();
  }, 100);
  
  // Cerrar con clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      console.log("📝 Cerrando modal por clic fuera");
      closeCreateRecipeModal();
    }
  });
  
  // Cerrar con Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      console.log("📝 Cerrando modal por Escape");
      closeCreateRecipeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  // Inicializar contador de setpoints
  window.setPointCounter = 1;
}

// Función para cerrar el modal de creación de recetas
function closeCreateRecipeModal() {
  const modal = document.getElementById('createRecipeModal');
  if (modal) {
    modal.remove();
    console.log("📝 Modal de creación cerrado y removido");
  }
}

// Función para agregar un nuevo setpoint
function addNewSetPoint() {
  console.log("➕ Agregando nuevo setpoint");
  
  // Incrementar contador
  window.setPointCounter = (window.setPointCounter || 1) + 1;
  const newIndex = window.setPointCounter;
  
  // Obtener contenedor de setpoints
  const setPointsList = document.getElementById('setPointsList');
  if (!setPointsList) {
    console.error("❌ Contenedor de setpoints no encontrado");
    return;
  }
  
  // Crear nuevo setpoint usando template
  const newSetPointHtml = RECIPE_TEMPLATES.createSetPointItem(newIndex);
  
  // Crear elemento temporal para insertar HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = newSetPointHtml;
  const newSetPointElement = tempDiv.firstElementChild;
  
  // Agregar al contenedor
  setPointsList.appendChild(newSetPointElement);
  
  // Mostrar botón eliminar en todos los setpoints si hay más de uno
  updateRemoveButtons();
  
  // Agregar event listeners para el nuevo setpoint
  addSetPointErrorListeners();
  
  // Recalcular duración total
  calculateTotalDuration();
  
  // Notificar si está disponible
  if (window.notificationManager) {
    window.notificationManager.show(`SetPoint ${newIndex} agregado`, "success");
  }
}

// Función para eliminar un setpoint
function removeSetPoint(index) {
  console.log(`🗑️ Eliminando setpoint ${index}`);
  
  const setPointItem = document.querySelector(`[data-setpoint-index="${index}"]`);
  if (!setPointItem) {
    console.error(`❌ SetPoint ${index} no encontrado`);
    return;
  }
  
  // No permitir eliminar si solo hay uno
  const totalSetPoints = document.querySelectorAll('.setpoint-form-item').length;
  if (totalSetPoints <= 1) {
    console.warn("⚠️ No se puede eliminar el único setpoint");
    if (window.notificationManager) {
      window.notificationManager.show("Debe mantener al menos un setpoint", "warning");
    }
    return;
  }
  
  // Remover elemento
  setPointItem.remove();
  
  // Reindexar setpoints restantes
  reindexSetPoints();
  
  // Actualizar botones de eliminar
  updateRemoveButtons();
  
  // Re-agregar event listeners después de reindexar
  addSetPointErrorListeners();
  
  // Recalcular duración total
  calculateTotalDuration();
  
  console.log(`✅ SetPoint ${index} eliminado`);
  
  // Notificar si está disponible
  if (window.notificationManager) {
    window.notificationManager.show(`SetPoint eliminado`, "info");
  }
}

// Función para reindexar setpoints después de eliminar uno
function reindexSetPoints() {
  const setPoints = document.querySelectorAll('.setpoint-form-item');
  
  setPoints.forEach((setPoint, index) => {
    const newIndex = index + 1;
    
    // Actualizar atributo data
    setPoint.setAttribute('data-setpoint-index', newIndex);
    
    // Actualizar título
    const title = setPoint.querySelector('.setpoint-form-title');
    if (title) {
      title.textContent = `Etapa ${newIndex}`;
    }
    
    // Actualizar IDs y names de los inputs
    const inputs = setPoint.querySelectorAll('input');
    inputs.forEach(input => {
      const oldId = input.id;
      const fieldName = oldId.split('_')[0];
      
      input.id = `${fieldName}_${newIndex}`;
      input.name = `${fieldName}_${newIndex}`;
      
      // Actualizar valor del input de etapa
      if (fieldName === 'stage') {
        input.value = newIndex;
      }
    });
    
    // Actualizar labels
    const labels = setPoint.querySelectorAll('label');
    labels.forEach(label => {
      const forAttr = label.getAttribute('for');
      if (forAttr) {
        const fieldName = forAttr.split('_')[0];
        label.setAttribute('for', `${fieldName}_${newIndex}`);
      }
    });
    
    // Actualizar botón eliminar
    const removeBtn = setPoint.querySelector('.btn-remove-setpoint');
    if (removeBtn) {
      removeBtn.setAttribute('onclick', `removeSetPoint(${newIndex})`);
    }
  });
  
  // Actualizar contador global
  window.setPointCounter = setPoints.length;
}

// Función para actualizar visibilidad de botones eliminar
function updateRemoveButtons() {
  const setPoints = document.querySelectorAll('.setpoint-form-item');
    const removeButtons = document.querySelectorAll('.btn-remove-setpoint');
    
    // Mostrar botones eliminar solo si hay más de un setpoint, menos para el primer elemento

    removeButtons.forEach((btn, index) => {
        if (setPoints.length > 1 && index > 0) {
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none';
        }
    });
}

// Función para calcular la duración total de los setpoints
function calculateTotalDuration() {
  console.log("🔢 Calculando duración total de setpoints...");
  
  const setPointsList = document.getElementById('setPointsList');
  if (!setPointsList) {
    console.error("❌ Contenedor de setpoints no encontrado");
    return;
  }
  
  let totalHours = 0;
  let totalMinutes = 0;
  
  // Obtener todos los setpoints
  const setPoints = setPointsList.querySelectorAll('.setpoint-form-item');
  
  setPoints.forEach((setPoint, index) => {
    const setPointIndex = setPoint.getAttribute('data-setpoint-index');
    
    // Obtener valores de horas y minutos
    const hoursInput = document.getElementById(`tiempoh_${setPointIndex}`);
    const minutesInput = document.getElementById(`tiempom_${setPointIndex}`);
    
    if (hoursInput && minutesInput) {
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
      
      console.log(`📊 SetPoint ${setPointIndex}: ${hours}h ${minutes}m`);
      
      totalHours += hours;
      totalMinutes += minutes;
    }
  });
  
  // Convertir minutos excesivos a horas
  if (totalMinutes >= 60) {
    const extraHours = Math.floor(totalMinutes / 60);
    totalHours += extraHours;
    totalMinutes = totalMinutes % 60;
  }
  
  // Actualizar el elemento de duración calculada
  const durationElement = document.getElementById('recipeDurationCalculated');
  if (durationElement) {
    const durationText = `${totalHours}h ${totalMinutes}m`;
    durationElement.textContent = durationText;
    
    console.log(`✅ Duración total calculada: ${durationText}`);

    // Guardar la duración total en minutos (decimal) para uso posterior
    const totalDurationInMinutes = (totalHours * 60) + totalMinutes;
    durationElement.setAttribute('data-duration-minutes', totalDurationInMinutes);

    console.log(`📝 Duración en minutos: ${totalDurationInMinutes}`);
  } else {
    console.error("❌ Elemento recipeDurationCalculated no encontrado");
  }
}

// Función para guardar nueva receta
async function saveNewRecipe() {
  console.log("💾 Guardando nueva receta...");
  
  try {
    // Recopilar datos del formulario
    const recipeData = collectRecipeFormData();
    
    // Validar datos
    const isValid = validateRecipeData(recipeData);
    if (!isValid) {
      // Los errores ya se mostraron en los campos específicos
      return;
    }
    
    console.log("📝 Datos de receta recopilados:", recipeData);
    
    // Mostrar indicador de carga
    if (window.notificationManager) {
      window.notificationManager.show("Guardando receta...", "info");
    }
    
    // Obtener referencia al ApiManager
    const apiManager = window.apiManager;
    
    if (!apiManager) {
      throw new Error("ApiManager no está disponible");
    }
    
    // Enviar datos al ESP32 via API
    const result = await apiManager.createRecipe(recipeData);
    
    if (result.success) {
      console.log("✅ Receta creada exitosamente:", result);
      
      if (window.notificationManager) {
        window.notificationManager.show(result.message || "Receta creada exitosamente", "success");
      }
      
      // Cerrar modal
      closeCreateRecipeModal();
      
      // Refrescar lista de recetas si está disponible
      if (window.recipeManager) {
        setTimeout(() => {
          window.recipeManager.refresh();
        }, 1000);
      }
      
    } else {
      throw new Error(result.error || "Error desconocido al crear la receta");
    }
    
  } catch (error) {
    console.error("❌ Error guardando receta:", error);
    if (window.notificationManager) {
      window.notificationManager.show(`Error: ${error.message}`, "error");
    }
  }
}

// Función para recopilar datos del formulario
function collectRecipeFormData() {
  // Obtener la duración calculada
  const durationElement = document.getElementById('recipeDurationCalculated');
  const calculatedDuration = parseFloat(durationElement?.getAttribute('data-duration-minutes') || '0');
  
  const formData = {
        // Información general
        recipeName: document.getElementById('recipeName')?.value || '',
        coffeeType: document.getElementById('coffeeType')?.value || '',
        pressureType: document.getElementById('pressureType')?.value || '',
        modo: parseInt(document.getElementById('recipeMode')?.value || '1'),
        description: document.getElementById('recipeDescription')?.value || '',
        duration: calculatedDuration, // Usar duración calculada automáticamente
        // SetPoints
        setPoints: []
    };
    
    // Recopilar setpoints
    const setPointItems = document.querySelectorAll('.setpoint-form-item');
    setPointItems.forEach((item, index) => {
        const indexNum = index + 1;
        
        const setPoint = {
            presion_setpoint: parseFloat(document.getElementById(`presion_${indexNum}`)?.value || '0'),
            temp_setpoint: parseFloat(document.getElementById(`temperatura_${indexNum}`)?.value || '0'),
            tiempo_hora: parseFloat(document.getElementById(`tiempoh_${indexNum}`)?.value || '0'),
            tiempo_minuto: parseFloat(document.getElementById(`tiempom_${indexNum}`)?.value || '0')
        };
        
        formData.setPoints.push(setPoint);
    });
    
    return formData;
}

// ============ FUNCIONES DE VALIDACIÓN Y ERRORES ============

// Función para limpiar errores de formulario
function clearFormErrors() {
  // Limpiar errores de campos principales
  const fields = ['recipeName', 'coffeeType', 'pressureType', 'recipeMode'];
  fields.forEach(fieldId => {
    clearFieldError(fieldId);
  });
  
  // Limpiar errores de setpoints
  const setPointItems = document.querySelectorAll('.setpoint-form-item');
  setPointItems.forEach((item, index) => {
    const indexNum = index + 1;
    const setPointFields = [`presion_${indexNum}`, `temperatura_${indexNum}`, `tiempoh_${indexNum}`, `tiempom_${indexNum}`];
    setPointFields.forEach(fieldId => {
      clearFieldError(fieldId);
    });
  });
}

// Función para limpiar error de un campo específico
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.remove('field-error');
    
    // Remover mensaje de error existente
    const errorMsg = field.parentNode.querySelector('.field-error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }
}

// Función para mostrar error en un campo específico
function showFieldError(fieldId, message) {
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

// Función para validar datos de la receta
function validateRecipeData(data) {
  console.log("🔍 Validando datos de receta...");
  
  // Limpiar errores anteriores
  clearFormErrors();
  
  let hasErrors = false;
  let firstErrorField = null;
  
  try {
    // Validar información general
    if (!data.recipeName.trim()) {
      showFieldError('recipeName', 'El nombre de la receta es obligatorio');
      if (!firstErrorField) firstErrorField = 'recipeName';
      hasErrors = true;
    }
    
    if (!data.coffeeType.trim()) {
      showFieldError('coffeeType', 'El tipo de café es obligatorio');
      if (!firstErrorField) firstErrorField = 'coffeeType';
      hasErrors = true;
    }
    
    if (!data.pressureType) {
      showFieldError('pressureType', 'El tipo de presión es obligatorio');
      if (!firstErrorField) firstErrorField = 'pressureType';
      hasErrors = true;
    }

    if (!data.duration) {
      // Este error se muestra globalmente ya que la duración se calcula automáticamente
      throw new Error("La duración es obligatoria (verifique los tiempos de las etapas)");
    }
    
    if (data.modo === undefined || data.modo === null || isNaN(data.modo)) {
      showFieldError('recipeMode', 'El modo de receta es obligatorio');
      if (!firstErrorField) firstErrorField = 'recipeMode';
      hasErrors = true;
    }
    
    // Validar setpoints
    if (!data.setPoints || data.setPoints.length === 0) {
      throw new Error("Debe agregar al menos un setpoint");
    }
    
    data.setPoints.forEach((setPoint, index) => {
      const indexNum = index + 1;
      
      // Validar presión
      if (isNaN(setPoint.presion_setpoint)) {
        showFieldError(`presion_${indexNum}`, 'Debe ser un número válido');
        if (!firstErrorField) firstErrorField = `presion_${indexNum}`;
        hasErrors = true;
      } else if (setPoint.presion_setpoint <= 0) {
        showFieldError(`presion_${indexNum}`, 'Debe ser mayor a 0');
        if (!firstErrorField) firstErrorField = `presion_${indexNum}`;
        hasErrors = true;
      } else if (setPoint.presion_setpoint > 10) {
        showFieldError(`presion_${indexNum}`, 'No puede exceder 10 PSI');
        if (!firstErrorField) firstErrorField = `presion_${indexNum}`;
        hasErrors = true;
      }
      
      // Validar temperatura
      if (isNaN(setPoint.temp_setpoint)) {
        showFieldError(`temperatura_${indexNum}`, 'Debe ser un número válido');
        if (!firstErrorField) firstErrorField = `temperatura_${indexNum}`;
        hasErrors = true;
      } else if (setPoint.temp_setpoint <= 0) {
        showFieldError(`temperatura_${indexNum}`, 'Debe ser mayor a 0');
        if (!firstErrorField) firstErrorField = `temperatura_${indexNum}`;
        hasErrors = true;
      } else if (setPoint.temp_setpoint > 100) {
        showFieldError(`temperatura_${indexNum}`, 'No puede exceder 100°C');
        if (!firstErrorField) firstErrorField = `temperatura_${indexNum}`;
        hasErrors = true;
      }
      
      // Asegurarse de que los tiempos sean números válidos
      setPoint.tiempo_minuto = setPoint.tiempo_minuto || 0;
      setPoint.tiempo_hora = setPoint.tiempo_hora || 0;
      setPoint.tiempo_minuto = parseFloat(setPoint.tiempo_minuto) || 0;
      setPoint.tiempo_hora = parseFloat(setPoint.tiempo_hora) || 0;
      
      // Validar tiempo en horas
      if (isNaN(setPoint.tiempo_hora)) {
        showFieldError(`tiempoh_${indexNum}`, 'Debe ser un número válido');
        if (!firstErrorField) firstErrorField = `tiempoh_${indexNum}`;
        hasErrors = true;
      } else if (setPoint.tiempo_hora < 0) {
        showFieldError(`tiempoh_${indexNum}`, 'Debe ser mayor o igual a 0');
        if (!firstErrorField) firstErrorField = `tiempoh_${indexNum}`;
        hasErrors = true;
      }
      
      // Validar tiempo en minutos
      if (isNaN(setPoint.tiempo_minuto)) {
        showFieldError(`tiempom_${indexNum}`, 'Debe ser un número válido');
        if (!firstErrorField) firstErrorField = `tiempom_${indexNum}`;
        hasErrors = true;
      } else if (setPoint.tiempo_minuto < 0) {
        showFieldError(`tiempom_${indexNum}`, 'Debe ser mayor o igual a 0');
        if (!firstErrorField) firstErrorField = `tiempom_${indexNum}`;
        hasErrors = true;
      } else if (setPoint.tiempo_minuto > 59) {
        showFieldError(`tiempom_${indexNum}`, 'Debe ser menor o igual a 59');
        if (!firstErrorField) firstErrorField = `tiempom_${indexNum}`;
        hasErrors = true;
      }
      
      // Validar que al menos uno de los tiempos sea mayor a 0
      if (setPoint.tiempo_hora === 0 && setPoint.tiempo_minuto === 0) {
        showFieldError(`tiempoh_${indexNum}`, 'La etapa debe tener una duración mayor a 0');
        showFieldError(`tiempom_${indexNum}`, 'La etapa debe tener una duración mayor a 0');
        if (!firstErrorField) firstErrorField = `tiempoh_${indexNum}`;
        hasErrors = true;
      }
    });
    
    // Si hay errores, mostrar notificación y enfocar primer campo con error
    if (hasErrors) {
      if (firstErrorField) {
        const firstErrorElement = document.getElementById(firstErrorField);
        if (firstErrorElement) {
          setTimeout(() => {
            firstErrorElement.focus();
          }, 100);
        }
      }
      
      throw new Error("Por favor corrija los errores marcados en el formulario");
    }
    
    console.log("✅ Validación completada exitosamente");
    return true;
    
  } catch (error) {
    console.error("❌ Error en validación:", error.message);
    
    // Si hay errores de campo, no relanzar la excepción
    if (hasErrors) {
      return false;
    }
    
    // Para errores generales, relanzar
    throw error;
  }
}


// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Usar un pequeño delay para asegurar que todo esté cargado
  setTimeout(() => {
    if (typeof initRecipeFilter === 'function') {
      initRecipeFilter();
    }
  }, 100);
});