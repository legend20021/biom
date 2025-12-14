// ========================================
// GESTOR DE RECETAS PARA BIOMASTER
// ========================================

class RecipeManager {
  constructor(apiManager) {
    this.apiManager = apiManager;
    this.recipes = [];
    this.isLoading = false;
    this.lastUpdate = null;
    this.recipesContainer = null;
    
    this.init();
  }

  async init() {
    
    // Buscar contenedor unificado de recetas
    this.recipesContainer = document.querySelector('#recipesListUnified');
    
    // Verificar que el contenedor esté disponible
    if (this.recipesContainer) {
      await this.loadRecipes();
      // Inicializar el filtro después de cargar las recetas
      setTimeout(() => this.initRecipeFilter(), 100);
    } else {
      console.warn("⚠️ No se encontró el contenedor unificado de recetas");
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
    // Ocultar el loader global una vez que empezamos a renderizar
    const globalLoader = document.getElementById('recipesGlobalLoading');
    if (globalLoader) {
      globalLoader.style.display = 'none';
    }

    // Verificar que el contenedor exista
    if (!this.recipesContainer) {
      console.warn("⚠️ Contenedor de recetas no encontrado");
      return;
    }

    // Limpiar contenedor
    this.recipesContainer.innerHTML = '';

    // Verificar si hay recetas
    if (this.recipes.length === 0) {
      this.showGlobalEmptyState();
      return;
    }

    // Obtener el filtro actual
    const filterSelect = document.getElementById('recipesFilter');
    const currentFilter = filterSelect ? filterSelect.value : 'all';

    // Filtrar recetas según la selección
    let filteredRecipes = this.recipes;
    
    if (currentFilter !== 'all') {
      const modeMapping = {
        'created': 0,      // Recetas manuales/creadas
        'parametrized': 1, // Recetas parametrizadas
        'predetermined': 2 // Recetas predeterminadas
      };
      
      const targetMode = modeMapping[currentFilter];
      if (targetMode !== undefined) {
        filteredRecipes = this.recipes.filter(recipe => (recipe.modo || 0) === targetMode);
      }
    }

    // Renderizar recetas filtradas
    if (filteredRecipes.length === 0) {
      this.showEmptyStateForFilter(currentFilter);
    } else {
      filteredRecipes.forEach((recipe, index) => {
        const recipeElement = this.createRecipeElement(recipe, index);
        this.recipesContainer.appendChild(recipeElement);
      });
    }
  }

  showEmptyStateForFilter(filterType) {
    if (!this.recipesContainer) return;
    
    const filterMessages = {
      'all': {
        title: 'No hay recetas disponibles',
        message: 'No se encontraron recetas en el sistema. Crea tu primera receta para comenzar.'
      },
      'created': {
        title: 'No hay recetas personalizadas',
        message: 'Aún no has creado recetas personalizadas. Usa el botón "Crear Nueva Receta" para comenzar.'
      },
      'parametrized': {
        title: 'No hay recetas parametrizadas',
        message: 'No se encontraron recetas parametrizadas en el sistema.'
      },
      'predetermined': {
        title: 'No hay recetas predeterminadas',
        message: 'No se encontraron recetas predeterminadas en el sistema.'
      }
    };

    const config = filterMessages[filterType] || filterMessages['all'];
    
    this.recipesContainer.innerHTML = `
      <div class="recipe-empty-state">
        <div class="empty-icon">📜</div>
        <h4>${config.title}</h4>
        <p>${config.message}</p>
      </div>
    `;
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
    // Mostrar el estado de carga global
    const globalLoader = document.getElementById('recipesGlobalLoading');
    if (globalLoader) {
      globalLoader.style.display = 'block';
    }
    
    // Limpiar el contenedor durante la carga
    if (this.recipesContainer) {
      this.recipesContainer.innerHTML = '';
    }
  }

  showErrorState(errorMessage) {
    // Ocultar el estado de carga global
    const globalLoader = document.getElementById('recipesGlobalLoading');
    if (globalLoader) {
      globalLoader.style.display = 'none';
    }
    
    // Mostrar error en el contenedor unificado
    if (this.recipesContainer) {
      this.recipesContainer.innerHTML = RECIPE_TEMPLATES.errorState(errorMessage);
    }
  }


  showGlobalEmptyState() {
    // Ocultar el loader global
    const globalLoader = document.getElementById('recipesGlobalLoading');
    if (globalLoader) {
      globalLoader.style.display = 'none';
    }
    
    // Mostrar mensaje global en el contenedor unificado
    if (this.recipesContainer) {
      this.recipesContainer.innerHTML = `
        <div class="recipe-empty-state">
          <div class="empty-icon">📜</div>
          <h4>No hay recetas disponibles</h4>
          <p>No se encontraron recetas en el sistema. Crea tu primera receta para comenzar.</p>
        </div>
      `;
    }
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
    const generalInfoHtml = RECIPE_TEMPLATES.generalInfo(recipeDetails, this.formatDuration.bind(this), false);
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

      // TODO: Implementar eliminación en el Microcontrolador via API
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
   * Filtra y muestra las recetas según el tipo seleccionado
   * @param {string} selectedType - Tipo de receta seleccionado ('all', 'created', 'parametrized', 'predetermined')
   */
  filterRecipesByType(selectedType) {
    
    // Ocultar el loader global ya que las recetas ya están cargadas
    const globalLoader = document.getElementById('recipesGlobalLoading');
    if (globalLoader) {
      globalLoader.style.display = 'none';
    }
    
    // Re-renderizar las recetas con el filtro aplicado
    this.renderRecipes();
    
    // Notificación opcional si está disponible
    if (window.notificationManager) {
      const typeNames = {
        'all': 'Todas las Recetas',
        'created': 'Recetas Personalizadas',
        'parametrized': 'Recetas Parametrizadas', 
        'predetermined': 'Recetas Predeterminadas'
      };
      const displayName = typeNames[selectedType] || 'Recetas';
      window.notificationManager.show(`Mostrando: ${displayName}`, "info");
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
      
      // Las recetas ya se renderizaron con renderRecipes(), solo aplicar filtro si no es 'all'
      if (initialValue !== 'all') {
        this.filterRecipesByType(initialValue);
      }
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
  const mainFields = ['recipeName', 'coffeeType', 'pressureType', 'processType', 'recipeMode', 'recipeDescription'];
  
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
    
    // Enviar datos al Microcontrolador via API
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
        processType: parseInt(document.getElementById('processType')?.value || '0'),  // ✅ Nuevo campo processType
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
  const fields = ['recipeName', 'coffeeType', 'pressureType', 'processType', 'recipeMode'];
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

    if (data.processType === undefined || data.processType === null || isNaN(data.processType) || data.processType < 0) {
      showFieldError('processType', 'El tipo de proceso es obligatorio');
      if (!firstErrorField) firstErrorField = 'processType';
      hasErrors = true;
    } else if (data.processType > 13) {
      showFieldError('processType', 'Tipo de proceso no válido');
      if (!firstErrorField) firstErrorField = 'processType';
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


// ============ FUNCIONES DE EDICIÓN DE INFORMACIÓN DE RECETA ============

// Variable global para almacenar los valores originales durante la edición
let originalRecipeValues = null;
let currentRecipeDetails = null;

function enableRecipeInfoEditing() {
  console.log("✏️ Habilitando edición de información de receta");
  
  // Verificar que los elementos necesarios existan
  const recipeNameDisplay = document.getElementById('recipeNameDisplay');
  const coffeeTypeDisplay = document.getElementById('coffeeTypeDisplay');
  const processTypeDisplay = document.getElementById('processTypeDisplay');
  const processTypeEdit = document.getElementById('processTypeEdit');
  const recipeFilename = document.getElementById('recipeFilename');
  
  if (!recipeNameDisplay || !coffeeTypeDisplay || !processTypeDisplay || !processTypeEdit || !recipeFilename) {
    console.error("❌ No se encontraron todos los elementos necesarios para la edición");
    console.log("Elementos encontrados:", {
      recipeNameDisplay: !!recipeNameDisplay,
      coffeeTypeDisplay: !!coffeeTypeDisplay,
      processTypeDisplay: !!processTypeDisplay,
      processTypeEdit: !!processTypeEdit,
      recipeFilename: !!recipeFilename
    });
    return;
  }
  
  // Almacenar valores originales
  originalRecipeValues = {
    filename: recipeFilename.value,
    recipeName: recipeNameDisplay.textContent,
    coffeeType: coffeeTypeDisplay.textContent,
    processType: processTypeEdit.value
  };
  
  console.log("📋 Valores originales almacenados:", originalRecipeValues);
  
  // Obtener el valor actual de processType del texto mostrado
  const processTypeDisplayText = processTypeDisplay.textContent;
  const processTypeValue = getProcessTypeValueFromText(processTypeDisplayText);
  processTypeEdit.value = processTypeValue;
  
  console.log(`🔄 Tipo de proceso: "${processTypeDisplayText}" -> valor ${processTypeValue}`);
  
  // Cambiar a modo edición
  toggleRecipeEditMode(true);
  
  // Limpiar errores previos
  clearRecipeEditErrors();
  
  // Enfocar primer campo
  setTimeout(() => {
    const recipeNameEdit = document.getElementById('recipeNameEdit');
    if (recipeNameEdit) {
      recipeNameEdit.focus();
      console.log("🎯 Focus puesto en campo de nombre");
    }
  }, 100);
}

function cancelRecipeInfoEditing() {
  console.log("❌ Cancelando edición de información de receta");
  
  if (originalRecipeValues) {
    // Restaurar valores originales
    document.getElementById('recipeNameEdit').value = originalRecipeValues.recipeName;
    document.getElementById('coffeeTypeEdit').value = originalRecipeValues.coffeeType;
    document.getElementById('processTypeEdit').value = originalRecipeValues.processType;
  }
  
  // Salir del modo edición
  toggleRecipeEditMode(false);
  
  // Limpiar errores
  clearRecipeEditErrors();
  
  // Limpiar variables globales
  originalRecipeValues = null;
}

function saveRecipeInfoEditing() {
  console.log("💾 Guardando edición de información de receta");
  
  // Recopilar datos del formulario incluyendo el filename
  const editedData = {
    filename: document.getElementById('recipeFilename').value,
    recipeName: document.getElementById('recipeNameEdit').value.trim(),
    coffeeType: document.getElementById('coffeeTypeEdit').value.trim(),
    processType: parseInt(document.getElementById('processTypeEdit').value)
  };
  
  // Validar datos
  const isValid = validateRecipeEditData(editedData);
  if (!isValid) {
    return;
  }
  
  // Log de los datos (como solicitado)
  console.log("📋 Datos editados de la receta:", editedData);
  
  // Enviar datos al backend para actualizar archivo de receta
  updateRecipeDataInBackend(editedData);
  
  // Actualizar los displays con los nuevos valores
  document.getElementById('recipeNameDisplay').textContent = editedData.recipeName;
  document.getElementById('coffeeTypeDisplay').textContent = editedData.coffeeType;
  document.getElementById('processTypeDisplay').textContent = RECIPE_TEMPLATES._getProcessTypeText(editedData.processType);
  
  // Salir del modo edición
  toggleRecipeEditMode(false);
  
  // Mostrar notificación de éxito
  if (window.notificationManager) {
    window.notificationManager.show("Información de receta actualizada", "success");
  }
  
  // Limpiar variables globales
  originalRecipeValues = null;
  
  console.log("✅ Edición guardada exitosamente");
}

async function updateRecipeDataInBackend(editedData) {
  try {
    console.log("📤 Enviando datos editados de receta al backend...");
    
    const response = await window.updateRecipeData(editedData);
    
    if (response && response.success) {
      console.log("✅ Receta actualizada exitosamente en el backend:", response);
      
      if (window.notificationManager) {
        window.notificationManager.show("Receta guardada en el servidor", "success");
      }
    } else {
      console.error("❌ Error al actualizar receta en el backend:", response);
      
      if (window.notificationManager) {
        window.notificationManager.show("Error al guardar en el servidor", "error");
      }
    }
  } catch (error) {
    console.error("❌ Error de red al actualizar receta:", error);
    
    if (window.notificationManager) {
      window.notificationManager.show("Error de conexión al guardar", "error");
    }
  }
}

function toggleRecipeEditMode(isEditing) {
  console.log(`🔄 Cambiando modo de edición: ${isEditing ? 'EDICIÓN' : 'VISTA'}`);
  
  // Cambiar visibilidad de elementos de información y sus contenedores
  const elementsToToggle = [
    { display: 'recipeNameDisplay', edit: 'recipeNameEdit' },
    { display: 'coffeeTypeDisplay', edit: 'coffeeTypeEdit' },
    { display: 'processTypeDisplay', edit: 'processTypeEdit' }
  ];
  
  elementsToToggle.forEach(({ display, edit }) => {
    const displayElement = document.getElementById(display);
    const editElement = document.getElementById(edit);
    
    if (displayElement && editElement) {
      displayElement.style.display = isEditing ? 'none' : 'inline';
      editElement.style.display = isEditing ? 'inline' : 'none';
      
      // También cambiar el contenedor padre del input de edición (div wrapper)
      const editContainer = editElement.closest('div[style*="flex-direction: column"]');
      if (editContainer) {
        editContainer.style.display = isEditing ? 'flex' : 'none';
        console.log(`📦 Contenedor de ${edit}: ${editContainer.style.display}`);
      }
      
      console.log(`📝 ${display}: ${displayElement.style.display}, ${edit}: ${editElement.style.display}`);
    } else {
      console.warn(`⚠️ Elemento no encontrado: ${display} o ${edit}`);
    }
  });
  
  // Cambiar botones de control
  const editButton = document.querySelector('.btn-edit-info');
  const saveButton = document.querySelector('.btn-save-info');
  const cancelButton = document.querySelector('.btn-cancel-info');
  
  if (editButton) {
    editButton.style.display = isEditing ? 'none' : 'inline-block';
    console.log(`🔘 Botón editar: ${editButton.style.display}`);
  } else {
    console.warn('⚠️ Botón editar no encontrado');
  }
  
  if (saveButton) {
    saveButton.style.display = isEditing ? 'inline-block' : 'none';
    console.log(`💾 Botón guardar: ${saveButton.style.display}`);
  } else {
    console.warn('⚠️ Botón guardar no encontrado');
  }
  
  if (cancelButton) {
    cancelButton.style.display = isEditing ? 'inline-block' : 'none';
    console.log(`❌ Botón cancelar: ${cancelButton.style.display}`);
  } else {
    console.warn('⚠️ Botón cancelar no encontrado');
  }
}

function validateRecipeEditData(data) {
  // Limpiar errores anteriores
  clearRecipeEditErrors();
  
  let hasErrors = false;
  
  // Validar nombre de receta
  if (!data.recipeName) {
    showRecipeEditError('recipeNameError', 'El nombre de la receta es obligatorio');
    hasErrors = true;
  } else if (data.recipeName.length > 30) {
    showRecipeEditError('recipeNameError', 'El nombre no puede exceder 30 caracteres');
    hasErrors = true;
  }
  
  // Validar tipo de café
  if (!data.coffeeType) {
    showRecipeEditError('coffeeTypeError', 'El tipo de café es obligatorio');
    hasErrors = true;
  } else if (data.coffeeType.length > 30) {
    showRecipeEditError('coffeeTypeError', 'El tipo de café no puede exceder 30 caracteres');
    hasErrors = true;
  }
  
  // Validar tipo de proceso
  if (isNaN(data.processType) || data.processType < 0 || data.processType > 13) {
    showRecipeEditError('processTypeError', 'Debe seleccionar un tipo de proceso válido');
    hasErrors = true;
  }
  
  return !hasErrors;
}

function showRecipeEditError(errorElementId, message) {
  const errorElement = document.getElementById(errorElementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
  }
}

function clearRecipeEditErrors() {
  const errorIds = ['recipeNameError', 'coffeeTypeError', 'processTypeError'];
  errorIds.forEach(id => {
    const errorElement = document.getElementById(id);
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.textContent = '';
    }
  });
}

function getProcessTypeValueFromText(processTypeText) {
  // Mapeo inverso de texto a valor numérico
  const processTypeMapping = {
    'No definido': 0,
    'Lavado (Washed)': 1,
    'Natural (Dry)': 2,
    'Honey (Miel)': 3,
    'Semilavado (Wet-Hulled)': 4,
    'Anaeróbico': 5,
    'Maceración carbónica (Carbonic Maceration)': 6,
    'Fermentación láctica': 7,
    'Fermentación acética': 8,
    'Doble fermentación (Double Fermentation)': 9,
    'Proceso Koji': 10,
    'Infusionados': 11,
    'Rehidratación': 12,
    'Procesos Mixtos/Híbridos': 13,
    'No especificado': 0
  };
  
  return processTypeMapping[processTypeText] || 0;
}

// Hacer funciones disponibles globalmente
window.enableRecipeInfoEditing = enableRecipeInfoEditing;
window.cancelRecipeInfoEditing = cancelRecipeInfoEditing;
window.saveRecipeInfoEditing = saveRecipeInfoEditing;