//NOTIFICACIONES PROFESIONALES
const showNotification = (message, type = 'success', duration = 4000) => {
    const notification = document.getElementById('notification');
    
    // Limpiar contenido anterior
    notification.innerHTML = '';
    
    // Definir configuración según el tipo
    let config;
    switch(type) {
        case 'success':
            config = {
                backgroundColor: 'var(--success-color, #22c55e)',
                icon: '✓',
                iconColor: '#ffffff',
                textColor: '#ffffff',
                borderColor: '#16a34a'
            };
            break;
        case 'warning':
            config = {
                backgroundColor: '#f59e0b',
                icon: '⚠',
                iconColor: '#ffffff',
                textColor: '#ffffff',
                borderColor: '#d97706'
            };
            break;
        case 'error':
            config = {
                backgroundColor: '#ef4444',
                icon: '✕',
                iconColor: '#ffffff',
                textColor: '#ffffff',
                borderColor: '#dc2626'
            };
            break;
        case 'info':
            config = {
                backgroundColor: '#3b82f6',
                icon: 'ℹ',
                iconColor: '#ffffff',
                textColor: '#ffffff',
                borderColor: '#2563eb'
            };
<<<<<<< HEAD
            break;
        case 'persistent':
            config = {
                backgroundColor: '#7c3aed',
                icon: '🔔',
                iconColor: '#ffffff',
                textColor: '#ffffff',
                borderColor: '#6d28d9'
            };
            break;
        case 'critical':
            config = {
                backgroundColor: '#dc2626',
                icon: '🚨',
                iconColor: '#ffffff',
                textColor: '#ffffff',
                borderColor: '#b91c1c'
            };
=======
>>>>>>> b5783b697a51f3499a44c842eafe1532a7b123d5
            break;
        default:
            config = {
                backgroundColor: 'var(--success-color, #22c55e)',
                icon: '✓',
                iconColor: '#ffffff',
                textColor: '#ffffff',
                borderColor: '#16a34a'
            };
    }
    
    // Crear estructura HTML profesional
<<<<<<< HEAD
    const isPermanent = type === 'persistent' || type === 'critical';
    const showCloseButton = type !== 'persistent'; // Solo 'persistent' no tendrá botón de cierre
    
=======
>>>>>>> b5783b697a51f3499a44c842eafe1532a7b123d5
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon" style="color: ${config.iconColor};">
                ${config.icon}
            </div>
            <div class="notification-message" style="color: ${config.textColor};">
                ${message}
            </div>
<<<<<<< HEAD
            ${showCloseButton ? `<button class="notification-close" onclick="hideNotification()" style="color: ${config.textColor};">×</button>` : ''}
        </div>
        ${isPermanent ? '' : '<div class="notification-progress"></div>'}
=======
            <button class="notification-close" onclick="hideNotification()" style="color: ${config.textColor};">
                ×
            </button>
        </div>
        <div class="notification-progress"></div>
>>>>>>> b5783b697a51f3499a44c842eafe1532a7b123d5
    `;
    
    // Aplicar estilos
    notification.style.background = `${config.backgroundColor}`;
    notification.style.borderLeft = `4px solid ${config.borderColor}`;
<<<<<<< HEAD
    
    // Estilos especiales para notificaciones permanentes
    if (isPermanent) {
        notification.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '10000';
        notification.style.animation = 'pulseNotification 2s infinite';
        
        // Agregar clase especial para notificaciones permanentes
        notification.classList.add('notification-permanent');
    } else {
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    // Agregar clase de tipo para estilos específicos
    notification.className = `notification notification-${type} ${isPermanent ? 'notification-permanent' : ''}`;
=======
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
    
    // Agregar clase de tipo para estilos específicos
    notification.className = `notification notification-${type}`;
>>>>>>> b5783b697a51f3499a44c842eafe1532a7b123d5
    
    // Mostrar con animación
    notification.classList.add('show');
    
<<<<<<< HEAD
    // Solo animar barra de progreso y auto-ocultar para notificaciones no permanentes
    if (!isPermanent) {
        // Animar barra de progreso
        const progressBar = notification.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.animation = `notificationProgress ${duration}ms linear`;
        }
        
        // Auto-ocultar después del tiempo especificado
        const hideTimer = setTimeout(() => {
            hideNotification();
        }, duration);
        
        // Guardar el timer para poder cancelarlo si es necesario
        notification.hideTimer = hideTimer;
    }
=======
    // Animar barra de progreso
    const progressBar = notification.querySelector('.notification-progress');
    if (progressBar) {
        progressBar.style.animation = `notificationProgress ${duration}ms linear`;
    }
    
    // Auto-ocultar después del tiempo especificado
    const hideTimer = setTimeout(() => {
        hideNotification();
    }, duration);
    
    // Guardar el timer para poder cancelarlo si es necesario
    notification.hideTimer = hideTimer;
>>>>>>> b5783b697a51f3499a44c842eafe1532a7b123d5
};

// Función para ocultar notificación manualmente
const hideNotification = () => {
    const notification = document.getElementById('notification');
    if (notification) {
        // Cancelar timer si existe
        if (notification.hideTimer) {
            clearTimeout(notification.hideTimer);
        }
        
        // Remover clases y limpiar
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Limpiar completamente después de la animación
        setTimeout(() => {
            notification.classList.remove('hide', 'notification-success', 'notification-warning', 'notification-error', 'notification-info');
            notification.innerHTML = '';
            notification.style.cssText = '';
        }, 300);
    }
};

// Función helper para notificaciones rápidas
const showQuickNotification = (message, type = 'success') => {
    showNotification(message, type, 2500); // Duración más corta
};

// Función helper para notificaciones persistentes
const showPersistentNotification = (message, type = 'info') => {
    showNotification(message, type, 8000); // Duración más larga
<<<<<<< HEAD
};

// Función para notificaciones permanentes del sistema (no se cierran automáticamente)
const showSystemNotification = (message, type = 'persistent') => {
    showNotification(message, type, 0); // Duration 0 = no auto-hide
};

// Función para notificaciones críticas obligatorias
const showCriticalNotification = (message) => {
    showNotification(message, 'critical', 0); // Siempre permanente
};

// Función para forzar el cierre de cualquier notificación permanente
const forceHideNotification = () => {
    const notification = document.getElementById('notification');
    if (notification) {
        // Cancelar timer si existe
        if (notification.hideTimer) {
            clearTimeout(notification.hideTimer);
        }
        
        // Remover todas las clases y limpiar
        notification.classList.remove('show', 'notification-permanent');
        notification.classList.add('hide');
        
        // Limpiar completamente después de la animación
        setTimeout(() => {
            notification.classList.remove('hide', 'notification-success', 'notification-warning', 'notification-error', 'notification-info', 'notification-persistent', 'notification-critical');
            notification.innerHTML = '';
            notification.style.cssText = '';
        }, 300);
    }
};

// Función para verificar si hay una notificación permanente activa
const hasPermanentNotification = () => {
    const notification = document.getElementById('notification');
    return notification && notification.classList.contains('notification-permanent');
=======
>>>>>>> b5783b697a51f3499a44c842eafe1532a7b123d5
};
const animateProgress = (progressElement, duration, callback) => {
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
};