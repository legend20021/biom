// ========================================
// SISTEMA DE LOGS PARA ZENIT ICUZ
// ========================================

// Función para obtener y mostrar logs del sistema
async function getLogsData() {
    const logsContainer = document.getElementById('logsContainer');
    const logsLoadingState = document.getElementById('logsLoadingState');
    
    if (!logsContainer) {
        console.error('❌ Contenedor de logs no encontrado');
        return;
    }

    try {
        // Mostrar estado de carga
        if (logsLoadingState) {
            logsLoadingState.style.display = 'block';
        }
        logsContainer.innerHTML = '';

        // Obtener logs desde la API
        const response = await window.apiManager.getLogs();
        
        // Ocultar estado de carga
        if (logsLoadingState) {
            logsLoadingState.style.display = 'none';
        }

        // Extraer los logs del response - puede ser un array directo o un objeto con propiedad logs
        let logs;
        let totalStored = 0;
        let logsReturned = 0;

        if (Array.isArray(response)) {
            logs = response;
            totalStored = logs.length;
            logsReturned = logs.length;
        } else if (response && Array.isArray(response.logs)) {
            logs = response.logs;
            // Soporte para nueva estructura con paginación/limite
            totalStored = response.total_logs_stored || response.total_logs || logs.length;
            logsReturned = response.logs_returned || logs.length;
        } else if (response && typeof response === 'object') {
            // Si es un objeto, convertir a array (caso del modo demo)
            logs = Object.values(response).filter(item => 
                item && typeof item === 'object' && item.timestamp
            );
            totalStored = logs.length;
            logsReturned = logs.length;
        } else {
            logs = [];
        }

        if (!logs || logs.length === 0) {
            logsContainer.innerHTML = `
                <div class="logs-empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No hay logs disponibles</h3>
                    <p>No se encontraron registros en el sistema.</p>
                </div>
            `;
            return;
        }

        // Ordenar logs por timestamp (más recientes primero)
        logs.sort((a, b) => {
            const timestampA = parseInt(a.timestamp) || 0;
            const timestampB = parseInt(b.timestamp) || 0;
            return timestampB - timestampA; // Más recientes primero
        });

        // Mostrar logs
        displayLogs(logs, totalStored, logsReturned);
        
    } catch (error) {
        console.error('❌ Error al obtener logs:', error);
        
        // Ocultar estado de carga
        if (logsLoadingState) {
            logsLoadingState.style.display = 'none';
        }
        
        logsContainer.innerHTML = `
            <div class="logs-error-state">
                <h3>Error al cargar logs</h3>
                <p>No se pudieron obtener los registros del sistema.</p>
                <button class="btn" onclick="getLogs()">Reintentar</button>
            </div>
        `;
    }
}

// Función para mostrar los logs en el contenedor
function displayLogs(logs, totalStored = 0, logsReturned = 0) {
    const logsContainer = document.getElementById('logsContainer');
    
    if (!logsContainer) {
        console.error('❌ Contenedor de logs no encontrado');
        return;
    }

    // Calcular si hay logs ocultos
    const hiddenLogs = Math.max(0, totalStored - logsReturned);
    const showingAll = hiddenLogs === 0;

    // Crear estructura HTML para los logs
    let logsHTML = `
        <div class="logs-filters">
            <div class="filter-group">
                <label for="logSortFilter">Ordenar por:</label>
                <select id="logSortFilter" onchange="filterLogs()">
                    <option value="newest">Más recientes primero</option>
                    <option value="oldest">Más antiguos primero</option>
                </select>
            </div>
            ${!showingAll ? `
            <div class="logs-info-badge">
                Mostrando últimos ${logsReturned} de ${totalStored} registros (Límite: 150)
            </div>
            ` : `
            <div class="logs-info-badge">
                Total registros: ${logs.length}
            </div>
            `}
        </div>
        <div class="logs-list" id="logsList">
    `;

    // Procesar cada log
    logs.forEach((log, index) => {
        const logDate = new Date(log.timestamp * 1000);
        const formattedDate = logDate.toLocaleDateString('es-ES');
        const formattedTime = logDate.toLocaleTimeString('es-ES');
        
        const levelClass = `log-level-${log.level.toLowerCase()}`;
        const levelIcon = getLevelIcon(log.level);
        
        logsHTML += `
            <div class="log-entry ${levelClass}" data-level="${log.level}" data-category="${log.category}" data-timestamp="${log.timestamp}">
                <div class="log-header">
                    <div class="log-meta">
                        <span class="log-level ${levelClass}">
                            <span class="level-icon">${levelIcon}</span>
                            ${log.level}
                        </span>
                        <span class="log-timestamp">
                            <span class="date">${formattedDate}</span>
                            <span class="time">${formattedTime}</span>
                        </span>
                    </div>
                </div>
                <div class="log-content">
                    <div class="log-message">${escapeHtml(log.message)}</div>
                    ${log.details ? `<div class="log-details">${escapeHtml(log.details)}</div>` : ''}
                </div>
            </div>
        `;
    });

    logsHTML += `
        </div>
        <div class="logs-actions">
            <button class="btn logs-refresh-btn" onclick="getLogsData()">
                Actualizar Logs
            </button>
        </div>
    `;

    logsContainer.innerHTML = logsHTML;
}

// Función para obtener ícono según el nivel del log
function getLevelIcon(level) {
    const icons = {
        'INFO': 'ℹ️',
        'WARN': '⚠️',
        'ERROR': '❌'
    };
    return icons[level] || 'ℹ️';
}


// Función para ordenar logs
function filterLogs() {
    const sortFilter = document.getElementById('logSortFilter').value;
    const logsList = document.getElementById('logsList');
    const logEntries = Array.from(document.querySelectorAll('.log-entry'));
    
    // Ordenar entries por timestamp
    logEntries.sort((a, b) => {
        const timestampA = parseInt(a.getAttribute('data-timestamp')) || 0;
        const timestampB = parseInt(b.getAttribute('data-timestamp')) || 0;
        
        if (sortFilter === 'oldest') {
            return timestampA - timestampB; // Más antiguos primero
        } else {
            return timestampB - timestampA; // Más recientes primero (default)
        }
    });
    
    // Reordenar entries en el DOM
    logEntries.forEach(entry => {
        logsList.appendChild(entry);
    });
}

// Función helper para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exportar funciones globales para compatibilidad
window.getLogsData = getLogsData;
window.displayLogs = displayLogs;
window.filterLogs = filterLogs;