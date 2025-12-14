// Event Listeners
recirculationToggle.addEventListener('change', async () => {
    await clickOnRecirculation(null, false);
});
async function clickOnRecirculation(param, byPass = false) {
    const recirculationToggle = document.getElementById('recirculationToggle');
    
    // Si es llamada por bypass (desde updateControlVariables), no hacer nada si hay interacción activa
    if (byPass && userInteractionLock) {
        return;
    }

    const value = param !== null ? param : recirculationToggle.checked;

    const message = {
        CMD_recirculacion: value
    };
    const originalValue = !value; // Guardar el valor original
    
    try {
        if (!byPass) {
            // Bloquear actualizaciones cuando se abre el modal
            lockUserInteraction();
            
            await openModal(() => apiManager.sendCommand(message, value, value ?'Recirculación activada': 'Recirculación desactivada'));
            
            // Desbloquear después de confirmar
            setTimeout(() => {
                unlockUserInteraction();
            }, 2000);
        }
        
        state.recirculacion = value;
        recirculationToggle.checked = value;
        // console.log(`Recirculación: ${state.recirculacion ? 'Activada' : 'Desactivada'}`);
    } catch (error) {
        // Desbloquear si se cancela el modal
        unlockUserInteraction();
        
        state.recirculacion = originalValue;
        recirculationToggle.checked = originalValue;
        // console.log('Recirculación cancelada');
    }
}



temperatureBtn.addEventListener('click', async () => {
    await clickOnTemperature(null, false);
});

async function clickOnTemperature(param, byPass = false) {
    const temperatureBtn = document.getElementById('temperatureBtn');
    const temperatureInput = document.getElementById('temperatureInput');
    
    // Si es llamada por bypass (desde updateControlVariables), no hacer nada si hay interacción activa
    if (byPass && userInteractionLock) {
        return;
    }
    
    const value = param !== null ? param : temperatureBtn.checked;
    const originalValue = !value;

    const message = {
        CMD_control_temperatura: value
    };

    try {
        if (!byPass) {
            // Bloquear actualizaciones cuando se abre el modal
            lockUserInteraction();
            
            await openModal(() => apiManager.sendCommand(message, value, value ? 'Temperatura activada': 'Temperatura desactivada'));
            
            // Desbloquear después de confirmar
            setTimeout(() => {
                unlockUserInteraction();
            }, 2000);
        }
        
        state.control_temperatura = value;
        temperatureBtn.checked = value;
        temperatureBtn.classList.toggle('active');
        temperatureInput.classList.toggle('active', state.control_temperatura);
        // console.log(`Temperatura: ${state.control_temperatura ? 'Activada' : 'Desactivada'}`);
    } catch (error) {
        // Desbloquear si se cancela el modal
        unlockUserInteraction();
        
        state.control_temperatura = originalValue;
        temperatureBtn.checked = originalValue;
        // console.log('Temperatura cancelada');
    }
}


naturalPressureBtn.addEventListener('click', async () => {
    await clickOnNaturalPressure(null, false);
});

async function clickOnNaturalPressure(param, byPass = false) {
    const naturalPressureBtn = document.getElementById('naturalPressureBtn');
    const carbonicMacerationBtn = document.getElementById('carbonicMacerationBtn');
    const naturalPressureInput = document.getElementById('naturalPressureInput');
    const carbonicMacerationInput = document.getElementById('carbonicMacerationInput');

    // Si es llamada por bypass (desde updateControlVariables), no hacer nada si hay interacción activa
    if (byPass && userInteractionLock) {
        return;
    }

    const value = param !== null ? param : naturalPressureBtn.checked;

    let  message = {
        CMD_presion_natural: value
    };
    if (value) {
        message['CMD_maceracion'] =  false;
    }
    const originalValue = !value; // Guardar el valor original

    try {
        if (!byPass) {
            // Bloquear actualizaciones cuando se abre el modal
            lockUserInteraction();
            
            await openModal(() => apiManager.sendCommand(message, value, value ? 'Presion natural activada': 'Presion natural desactivada'));
            
            // Desbloquear después de confirmar
            setTimeout(() => {
                unlockUserInteraction();
            }, 2000);
        }
        
        naturalPressureBtn.checked = value;
        state.presion_natural = value;
        
        if (state.presion_natural) {
            naturalPressureBtn.classList.add('active');
            naturalPressureInput.classList.add('active');
        } else {
            naturalPressureBtn.classList.remove('active');
            naturalPressureInput.classList.remove('active');
        }
        
        // Si se activa la presión natural, desactiva la maceración carbónica
        if (state.presion_natural) {
            carbonicMacerationBtn.checked = false;
            state.maceracion = false;
            carbonicMacerationBtn.classList.remove('active');
            carbonicMacerationInput.classList.remove('active');
        }
    } catch (error) {
        // Desbloquear si se cancela el modal
        unlockUserInteraction();
        
        state.presion_natural = originalValue;
        naturalPressureBtn.checked = originalValue;
        // console.log('Presión natural cancelada');
    }
}

carbonicMacerationBtn.addEventListener('click', async () => {
    await clickOnCarbonicMaceration(null, false);
});

async function clickOnCarbonicMaceration(param, byPass = false) {
    const naturalPressureBtn = document.getElementById('naturalPressureBtn');
    const carbonicMacerationBtn = document.getElementById('carbonicMacerationBtn');
    const naturalPressureInput = document.getElementById('naturalPressureInput');
    const carbonicMacerationInput = document.getElementById('carbonicMacerationInput');

    // Si es llamada por bypass (desde updateControlVariables), no hacer nada si hay interacción activa
    if (byPass && userInteractionLock) {
        return;
    }

    const value = param !== null ? param : carbonicMacerationBtn.checked;
    const originalValue = !value; // Guardar el valor original

    const message = {
        CMD_maceracion: value
    };

    if (value) {
        message['CMD_presion_natural'] =  false;
    }
    
    try {
        if (!byPass) {
            // Bloquear actualizaciones cuando se abre el modal
            lockUserInteraction();
            
            await openModal(() => apiManager.sendCommand(message, value, value ? 'Maceracion activada': 'Maceracion desactivada'));
            
            // Desbloquear después de confirmar
            setTimeout(() => {
                unlockUserInteraction();
            }, 2000);
        }
        
        carbonicMacerationBtn.checked = value;
        state.maceracion = value;
        
        if (state.maceracion) {
            carbonicMacerationBtn.classList.add('active');
            carbonicMacerationInput.classList.add('active');
        } else {
            carbonicMacerationBtn.classList.remove('active');
            carbonicMacerationInput.classList.remove('active');
        }
        
        // Si se activa la maceración carbónica, desactiva la presión natural
        if (state.maceracion) {
            naturalPressureBtn.checked = false;
            state.presion_natural = false;
            naturalPressureBtn.classList.remove('active');
            naturalPressureInput.classList.remove('active');
        }
    } catch (error) {
        // Desbloquear si se cancela el modal
        unlockUserInteraction();
        
        state.maceracion = originalValue;
        carbonicMacerationBtn.checked = originalValue;
        // console.log('Maceración carbónica cancelada');
    }
}

// Event listeners para los botones de envío
document.querySelectorAll('.input-group1').forEach(group => {
    const input = group.querySelector('input');
    const sendBtn = group.querySelector('.send-btn');

    sendBtn.addEventListener('click', async () => {
        let isValid = false;
        let message = {};
        // Verifica el valor del input según el grupo
        if (group.id === 'temperatureInput') {
            isValid = handleValueSubmit(input, 'temperature', 100);
            message = {
                PAR_temperatura_control: input.value
            };
        } else if (group.id === 'naturalPressureInput') {
            isValid = handleValueSubmit(input, 'naturalPressure', 10);
            message = {
                PAR_presion_control: input.value
            };
        } else if (group.id === 'carbonicMacerationInput') {
            isValid = handleValueSubmit(input, 'carbonicMaceration', 10);
            message = {
                PAR_presion_control: input.value
            };
        }

        // Si el valor es válido, cambia el botón a verde y luego vuelve al color original
        if (isValid && message) {
            try {
                // Bloquear actualizaciones cuando se abre el modal
                lockUserInteraction();
                
                await openModal(() => apiManager.sendCommand(message, true, 'Valor enviado'));
                
                // Desbloquear después de confirmar
                setTimeout(() => {
                    unlockUserInteraction();
                }, 2000);
            } catch (error) {
                // Desbloquear si se cancela el modal
                unlockUserInteraction();
            }
        }
    });
});



// Función para manejar el envío de valores
function handleValueSubmit(input, key, maxValue) {
    const value = parseFloat(input.value);
    if (!isNaN(value) && value >= 0 && value <= maxValue) {
        return true;
    } else {
        notificationManager.show(`Valor no valido. Por favor, ingresa un valor entre 0 y ${maxValue}.`, 'error');
        return false;
    }
}



async function actionPlay(byPass = false) {
    const message = {
        start: true
    };
    
    try {
        if (!byPass) {
            // Bloquear actualizaciones cuando se abre el modal
            lockUserInteraction();
            const mensajePresion = !state.presion_natural && !state.maceracion ? 'Si no seleccionas un control de presión, se tomará por defecto presion natural. ' : '';
            await openModal(
                () => apiManager.sendCommand(message, true, 'Iniciando proceso'),
                mensajePresion +'¿Iniciar el proceso?'
            );
            toggleActionButtons();
            // Desbloquear después de confirmar
            setTimeout(() => {
                unlockUserInteraction();
            }, 2000);
            //redirige a la seccion dashboard con la funcion showSection(event)
            navigateToSection('dashboard');
        }
    } catch (error) {
        toggleActionButtons();
        // Desbloquear si se cancela el modal
        unlockUserInteraction();
    }
}

async function actionStop(byPass = false) {
    const message = {
        stop: true
    };
    try {
        if (!byPass) {
            // Bloquear actualizaciones cuando se abre el modal
            lockUserInteraction();
            
            await openModal(
                () => apiManager.sendCommand(message, true, 'Deteniendo proceso'),
                '¿Detener el proceso?' + '\n\nEsta acción no se puede deshacer.'
            );


            resetControlInputs();
            toggleActionButtons();
            // Desbloquear después de confirmar
            setTimeout(() => {
                unlockUserInteraction();
            }, 2000);
        }
    } catch (error) {
        toggleActionButtons();
        // Desbloquear si se cancela el modal
        unlockUserInteraction();
    }
}

async function actionClose(byPass = false) {
    const message = {
        cancelar: true
    };

    try {
        if (!byPass) {
            // Bloquear actualizaciones cuando se abre el modal
            lockUserInteraction();

            await openModal(
                () => apiManager.sendCommand(message, true, 'Cancelando proceso'),
                '¿Estás seguro de que deseas cancelar el proceso? No se guardarán los datos asociados.'
            );
            resetControlInputs();
            toggleActionButtons();
            // Desbloquear después de confirmar
            setTimeout(() => {
                unlockUserInteraction();
            }, 2000);
        }
    } catch (error) {
        toggleActionButtons();
        // Desbloquear si se cancela el modal
        unlockUserInteraction();
    }
}

function resetControlInputs() {
    const temperatureInputElement = document.getElementById('temperatureInputElement');
    const naturalPressureInputElement = document.getElementById('naturalPressureInputElement');
    const carbonicMacerationInputElement = document.getElementById('carbonicMacerationInputElement');
    if (temperatureInputElement) temperatureInputElement.value = '';
    if (naturalPressureInputElement) naturalPressureInputElement.value = '';
    if (carbonicMacerationInputElement) carbonicMacerationInputElement.value = '';
}

window.addEventListener('load', () => {
    resetControlInputs();
});
