//NOTIFICACIONES
const showNotification = (message, type = 'success') => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    // Definir colores según el tipo
    let backgroundColor;
    switch(type) {
        case 'success':
            backgroundColor = 'var(--success-color)';
            break;
        case 'warning':
            backgroundColor = '#ff9500'; // Naranja para advertencias
            break;
        case 'error':
            backgroundColor = '#ff6038'; // Rojo para errores
            break;
        default:
            backgroundColor = 'var(--success-color)';
    }
    
    notification.style.background = backgroundColor;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000); // Aumentado a 3 segundos
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
function showTempNotification(message, type = 'success') {
    const notification = document.getElementById('temp-notification');
    notification.textContent = message;
    notification.style.background = type === 'success' ?
        'var(--success-color)' : 'var(--error-red)';
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}