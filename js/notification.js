// ============ SISTEMA DE NOTIFICACIONES PROFESIONALES ============
class NotificationManager {
  constructor() {
    this.defaultDurations = {
      success: 4000,
      warning: 4500,
      error: 5000,
      info: 4000,
      persistent: 0,
      critical: 0
    };
    
    this.configs = {
      success: {
        backgroundColor: 'var(--success-color, #22c55e)',
        icon: '✓',
        iconColor: '#ffffff',
        textColor: '#ffffff',
        borderColor: '#16a34a'
      },
      warning: {
        backgroundColor: '#f59e0b',
        icon: '⚠',
        iconColor: '#ffffff',
        textColor: '#ffffff',
        borderColor: '#d97706'
      },
      error: {
        backgroundColor: '#ef4444',
        icon: '✕',
        iconColor: '#ffffff',
        textColor: '#ffffff',
        borderColor: '#dc2626'
      },
      info: {
        backgroundColor: '#3b82f6',
        icon: 'ℹ',
        iconColor: '#ffffff',
        textColor: '#ffffff',
        borderColor: '#2563eb'
      },
      persistent: {
        backgroundColor: '#fafc8fff',
        icon: '🔔',
        iconColor: '#000000',
        textColor: '#000000',
        borderColor: '#fafc8fff'
      },
      critical: {
        backgroundColor: '#dc2626',
        icon: '🚨',
        iconColor: '#ffffff',
        textColor: '#ffffff',
        borderColor: '#b91c1c'
      }
    };
    
    this.activeNotifications = new Map();
  }

  // ============ MÉTODO PRINCIPAL DE NOTIFICACIONES ============
  show(message, type = 'success', duration = null) {
    // Usar duración por defecto si no se especifica
    if (duration === null) {
      duration = this.defaultDurations[type] || this.defaultDurations.success;
    }

    let notification = document.getElementById('notification');
    if (type === 'persistent') {
      notification = document.getElementById('notificationFixed');
    }
    
    if (!notification) {
      console.error('❌ Elemento de notificación no encontrado');
      return;
    }

    // Limpiar contenido anterior
    notification.innerHTML = '';
    
    // Obtener configuración del tipo
    const config = this.configs[type] || this.configs.success;
    
    // Crear estructura HTML profesional
    const isPermanent = type === 'persistent' || type === 'critical';
    const showCloseButton = type !== 'persistent';
    
    notification.innerHTML = this._createNotificationHTML(message, config, isPermanent, showCloseButton);
    
    // Aplicar estilos
    this._applyStyles(notification, config, isPermanent, type);
    
    // Mostrar con animación
    notification.classList.add('show');
    
    // Manejar auto-ocultado para notificaciones no permanentes
    if (!isPermanent && duration > 0) {
      this._setupAutoHide(notification, duration);
    }

    // Registrar notificación activa
    this.activeNotifications.set(notification.id, {
      type,
      timestamp: Date.now(),
      isPermanent
    });

  }

  // ============ MÉTODOS ESPECÍFICOS PARA TIPOS ============
  
  success(message, duration = null) {
    this.show(message, 'success', duration);
  }

  warning(message, duration = null) {
    this.show(message, 'warning', duration);
  }

  error(message, duration = null) {
    this.show(message, 'error', duration);
  }

  info(message, duration = null) {
    this.show(message, 'info', duration);
  }

  persistent(message) {
    this.show(message, 'persistent', 0);
  }

  critical(message) {
    this.show(message, 'critical', 0);
  }

  // ============ MÉTODOS HELPER ============
  
  quick(message, type = 'success') {
    this.show(message, type, 2500);
  }

  long(message, type = 'info') {
    this.show(message, type, 8000);
  }

  // ============ MÉTODOS DE CONTROL ============
  
  hide() {
    const notification = document.getElementById('notification');
    if (notification) {
      this._hideNotification(notification);
    }
  }

  forceHide() {
    const notification = document.getElementById('notification');
    if (notification) {
      this._forceHideNotification(notification);
    }
  }

  hideAll() {
    const notifications = ['notification', 'notificationFixed'];
    notifications.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        this._forceHideNotification(element);
      }
    });
  }

  // ============ MÉTODOS DE CONSULTA ============
  
  hasPermanent() {
    const notification = document.getElementById('notification');
    return notification && notification.classList.contains('notification-permanent');
  }

  getActive() {
    return Array.from(this.activeNotifications.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }

  // ============ MÉTODOS PRIVADOS ============
  
  _createNotificationHTML(message, config, isPermanent, showCloseButton) {
    return `
      <div class="notification-content">
        <div class="notification-icon" style="color: ${config.iconColor};">
          ${config.icon}
        </div>
        <div class="notification-message" style="color: ${config.textColor};">
          ${message}
          ${isPermanent ? '<a href="#" onclick="location.reload();" style="text-decoration: underline;">Recargar</a>' : ''}
        </div>
        ${showCloseButton ? `<button class="notification-close" onclick="notificationManager.hide()" style="color: ${config.textColor};">×</button>` : ''}
      </div>
      ${isPermanent ? '' : '<div class="notification-progress"></div>'}
    `;
  }

  _applyStyles(notification, config, isPermanent, type) {
    notification.style.background = config.backgroundColor;
    notification.style.borderLeft = `4px solid ${config.borderColor}`;
    
    if (isPermanent) {
      notification.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.15)';
      notification.style.zIndex = '10000';
      notification.style.animation = 'pulseNotification 2s infinite';
      notification.classList.add('notification-permanent');
    } else {
      notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    notification.className = `notification notification-${type} ${isPermanent ? 'notification-permanent' : ''}`;
  }

  _setupAutoHide(notification, duration) {
    // Animar barra de progreso
    const progressBar = notification.querySelector('.notification-progress');
    if (progressBar) {
      progressBar.style.animation = `notificationProgress ${duration}ms linear`;
    }
    
    // Auto-ocultar después del tiempo especificado
    const hideTimer = setTimeout(() => {
      this._hideNotification(notification);
    }, duration);
    
    notification.hideTimer = hideTimer;
  }

  _hideNotification(notification) {
    if (notification.hideTimer) {
      clearTimeout(notification.hideTimer);
    }
    
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    setTimeout(() => {
      this._cleanupNotification(notification);
    }, 300);
  }

  _forceHideNotification(notification) {
    if (notification.hideTimer) {
      clearTimeout(notification.hideTimer);
    }
    
    notification.classList.remove('show', 'notification-permanent');
    notification.classList.add('hide');
    
    setTimeout(() => {
      this._cleanupNotification(notification);
    }, 300);
  }

  _cleanupNotification(notification) {
    notification.classList.remove(
      'hide', 'notification-success', 'notification-warning', 
      'notification-error', 'notification-info', 'notification-persistent', 
      'notification-critical', 'notification-permanent'
    );
    notification.innerHTML = '';
    notification.style.cssText = '';
    
    // Remover de notificaciones activas
    this.activeNotifications.delete(notification.id);
  }

  // ============ MÉTODOS DE CONFIGURACIÓN ============
  
  setDefaultDuration(type, duration) {
    if (this.defaultDurations.hasOwnProperty(type)) {
      this.defaultDurations[type] = duration;
      console.log(`⚙️ Duración por defecto para '${type}' actualizada: ${duration}ms`);
    }
  }

  updateConfig(type, config) {
    if (this.configs.hasOwnProperty(type)) {
      this.configs[type] = { ...this.configs[type], ...config };
      console.log(`⚙️ Configuración para '${type}' actualizada:`, this.configs[type]);
    }
  }

  // ============ MÉTODO DE UTILIDAD PARA ANIMACIONES ============
  
  animateProgress(progressElement, duration, callback) {
    return new Promise((resolve) => {
      let start = null;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        const percentage = Math.min(progress * 100, 100);

        progressElement.style.width = `${percentage}%`;

        if (callback) callback(percentage);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  }
}

// ============ INSTANCIA GLOBAL DEL NOTIFICATION MANAGER ============


// ============ FUNCIONES DE COMPATIBILIDAD (WRAPPER FUNCTIONS) ============
// Mantener compatibilidad con el código existente


// ============ EXPORTAR A VENTANA GLOBAL ============
  const notificationManager = new NotificationManager();
  // Exportar la clase y la instancia
  window.NotificationManager = NotificationManager;
  window.notificationManager = notificationManager;