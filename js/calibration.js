// Calibración de Presión
document.getElementById('calibrate-pressure').addEventListener('click', async function() {
    try {

        const message = {
            CMD_calibrar_presion: true
        };
        const res = await openModal(() => sendValue(JSON.stringify(message)), true, 'Calibrando presión...');

        if (res) {
            const progress = document.getElementById('pressure-progress');
            const button = this;
    
            // Establecer valor inicial
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calibrando...';
    
            //Función para actualizar el visor con decimales
            const updateVisor = (percentage) => {
                const currentPsi = (10 * (100 - percentage) / 100).toFixed(1);
                // visor.textContent = `${currentPsi} PSI`;
            };
    
            //Animar la barra y actualizar el visor
            await animateProgress(progress, 3000, (percentage) => {
                updateVisor(percentage);
            });
    
            button.classList.add('success');
            button.innerHTML = '<i class="fas fa-check"></i> Calibrado';
            
            showNotification('Calibración de presión completada');
    
            setTimeout(() => {
                button.disabled = false;
                button.classList.remove('success');
                button.innerHTML = '<i class="fas fa-sync-alt"></i> Calibrar';
                progress.style.width = '0%';
                // visor.textContent = '10.0 PSI'; // Volver al valor inicial
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error en calibración de presión:', error);
        showNotification('Error en la calibración', 'error');
    }
});

// Calibración de pH
async function calibratePH(nivel) {
    let message = {};

    if (nivel == 4) {
        message = {
            CMD_calibrar_ph_bajo: true
        }
    }
    if (nivel == 7) {
        message = {
            CMD_calibrar_ph_medio: true
        }
    }
    if (nivel == 10) {
        message = {
            CMD_calibrar_ph_alto: true
        }
    }
    const res = await openModal(() => sendValue(JSON.stringify(message), true, 'Calibrando pH...'));
    if(res) {
        const progress = document.getElementById('ph-progress');
        const button = event.target;

        button.disabled = true;

        await animateProgress(progress, 2000);

        button.classList.add('success');
        showNotification(`Calibración pH ${nivel} completada`);
        console.log(`Calibrado pH ${nivel} completado`);

        setTimeout(() => {
            button.disabled = false;
            button.classList.remove('success');
            progress.style.width = '0%';
        }, 2000);
    }
}

// Calibración de Temperatura
// Función para validar temperatura
function validateTemperature(value) {
    const temp = parseFloat(value);
    if (isNaN(temp)) {
        throw new Error('Valor no válido');
    }
    if (temp < 0 || temp > 100) {
        throw new Error('Temperatura fuera de rango (0-100°C)');
    }
    return temp;
}

// Función para calibrar temperatura de masa
async function calibrateMasaTemp() {
    const input = document.getElementById('masa-temp-input');
    const temperature = validateTemperature(input.value);
    const message = {
        CMD_calibrar_temperatura_masa: true,
        PAR_calibrar_temperatura_masa: input.value,
    };
    const res = await openModal(() => sendValue(JSON.stringify(message)));
    if(res) {
        // Efectos visuales
        showTempNotification(`Temperatura de masa calibrada a ${temperature}°C`);
        // Limpiar input
        input.value = '';
    }
}

// Función para calibrar temperatura de lixiviado
async function calibrateLixTemp() {
    const input = document.getElementById('lix-temp-input');
    const temperature = validateTemperature(input.value);
    const message = {
        CMD_calibrar_temperatura_lixiviados: true,
        PAR_calibrar_temperatura_lixiviados: input.value
    };
    const res = await openModal(() => sendValue(JSON.stringify(message)));
    if(res) {
        // Efectos visuales
        showTempNotification(`Temperatura de lixiviado calibrada a ${temperature}°C`);

        // Limpiar input
        input.value = '';
    }
}

// Event Listeners para validación en tiempo real
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        try {
            validateTemperature(this.value);
            this.style.borderColor = 'var(--primary-blue)';
        } catch (error) {
            this.style.borderColor = 'var(--error-red)';
        }
    });
});
