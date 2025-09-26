// ========================================
// GESTIÓN DE CURVAS PARA BIOMASTER ESP32
// ========================================

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

  async loadCurves() {
    console.log('📊 Cargando curvas desde API...');
    
    if (this.isLoading) {
      console.log('⏳ Ya hay una carga en progreso, ignorando...');
      return;
    }

    this.isLoading = true;
    this.showLoadingState();

    try {
      const response = await this.apiManager.getCurvasFiles();
      console.log('✅ Respuesta de API curvas recibida:', response);

      if (response && response.curvas && Array.isArray(response.curvas)) {
        this.curves = response.curvas;
        console.log(`📊 ${this.curves.length} curvas cargadas`);
        
        if (this.curves.length === 0) {
          this.showEmptyState();
        } else {
          this.renderCurvesList();
        }

        // Notificar éxito
        if (this.notificationManager && this.notificationManager.showSuccess) {
          this.notificationManager.showSuccess(
            `✅ ${this.curves.length} curvas cargadas correctamente`,
            3000
          );
        }
      } else {
        console.warn('⚠️ Formato de respuesta inesperado:', response);
        this.showErrorState('Formato de datos no válido');
      }
    } catch (error) {
      console.error('❌ Error cargando curvas:', error);
      this.showErrorState(`Error de conexión: ${error.message}`);
      
      if (this.notificationManager && this.notificationManager.showError) {
        this.notificationManager.showError(
          `❌ Error cargando curvas: ${error.message}`,
          5000
        );
      }
    } finally {
      this.isLoading = false;
    }
  }

  async showCurveDetailsModal(filename) {

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
          classList: {
            add: () => {
              console.log('Mock de classList.add');
            }
          }
        },
        preventDefault: () => {}
      };
      showSection(event, curveDetail)
      // Por ahora solo hacemos log de los datos
      // Más adelante se implementará una sección dedicada para mostrar estos datos
      
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

    const res = await openModal(() =>  this.apiManager.deleteFile(`curvas/${filename}_data.dat`) , '¿Estás seguro de eliminar estos datos?');
    await this.apiManager.deleteFile(`curvas/${filename}_header.dat`)

    this.notificationManager.show('Datos eliminados...', 2000);

    //elimina el elemtno de la lista
    if (res && idElement) {
      const element = document.getElementById(idElement);
        if (element) {
            element.remove();
        }
    }

    //Carga de nuevo las curvas actualizadas
    setTimeout(() => {
        this.apiManager.getCurvasFiles();
    }, 2000);

    // const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar la fermentación "${filename}"?\n\nEsta acción no se puede deshacer.`);
    
    if (!res) {
      console.log('❌ Eliminación cancelada por el usuario');
      return;
    }
  }

  viewCurveInGraph(filename) {
    console.log(`📊 Viendo curva en gráfica: ${filename}`);
    
    // Cambiar a la sección de gráficas
    if (window.showContent) {
      window.showContent('graficas');
      
      if (this.notificationManager && this.notificationManager.showInfo) {
        this.notificationManager.showInfo(
          `📊 Mostrando datos de: ${filename}`,
          2000
        );
      }
    }
  }

  // ============ MÉTODOS DE RENDERIZADO ============

  showLoadingState() {
    const container = this.getCurvesContainer();
    if (container) {
      container.innerHTML = CURVE_TEMPLATES.loadingState();
    }
  }

  showEmptyState() {
    const container = this.getCurvesContainer();
    if (container) {
      container.innerHTML = CURVE_TEMPLATES.emptyState();
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

    // Generar HTML para cada curva en formato acordeón
    // El primer elemento se marca como activo
    const curvesHTML = this.curves.map((curve, index) => 
      CURVE_TEMPLATES.curveItem(curve, index === 0)
    ).join('');

    // Envolver las curvas en un contenedor de acordeón
    container.innerHTML = `
      <div class="accordion-container curves-accordion w-100">
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

  console.log('✅ Sistema de gestión de curvas inicializado');
}

// Exportar para uso global
window.CurveManager = CurveManager;
window.loadInitCurves = loadInitCurves;
