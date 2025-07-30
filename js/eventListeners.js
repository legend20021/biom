// Event Listeners
recirculationToggle.addEventListener('change', async () => {
    await clickOnRecirculation(null, false);
});
async function clickOnRecirculation(param, byPass = false) {
    const recirculationToggle = document.getElementById('recirculationToggle');
    // Enviar el estado del botón al servidor

    const value = param !== null ? param : recirculationToggle.checked;

    const message = {
        CMD_recirculacion: recirculationToggle.checked
    };
    const originalValue = !recirculationToggle.checked; // Guardar el valor original
    try {
        if (!byPass) {
            await openModal(() => sendValue(JSON.stringify(message), recirculationToggle.checked, recirculationToggle.checked ?'Recirculación activada': 'Recirculación desactivada'));
        }
        state.recirculacion = recirculationToggle.checked; // Asignar el resultado de la promesa a `state.recirculacion`
        // console.log(`Recirculación: ${state.recirculacion ? 'Activada' : 'Desactivada'}`);
    } catch (error) {
        state.recirculacion = originalValue; // Si el modal se cierra, asignar `false`
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
    const value = param !== null ? param : temperatureBtn.checked;
    const originalValue = !value;

    const message = {
        CMD_control_temperatura: value
    };

    state.control_temperatura = value;
    temperatureBtn.checked = value;

    try {
        if (!byPass) {
            await openModal(() => sendValue(JSON.stringify(message), value, value ? 'Temperatura activada': 'Temperatura desactivada'));
        }
        state.control_temperatura = temperatureBtn.checked; // Asignar el resultado de la promesa a `state.recirculacion`
        // console.log(`Recirculación: ${state.recirculacion ? 'Activada' : 'Desactivada'}`);
        temperatureBtn.classList.toggle('active');
        temperatureInput.classList.toggle('active', state.control_temperatura);
    } catch (error) {
        state.control_temperatura = originalValue; // Si el modal se cierra, asignar `false`
        temperatureBtn.checked = originalValue;
        // console.log('Recirculación cancelada');
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

    const value = param !== null ? param : naturalPressureBtn.checked;

    const message = {
        CMD_presion_natural: value
    };
    const originalValue = !value; // Guardar el valor original

    try {
        if (!byPass) {
            await openModal(() => sendValue(JSON.stringify(message), value, value ? 'Presion natural activada': 'Presion natural desactivada'));
        }
        naturalPressureBtn.checked = value;
        state.presion_natural = naturalPressureBtn.checked; // Asignar el resultado de la promesa a `state.recirculacion`
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
        state.presion_natural = originalValue; // Si el modal se cierra, asignar `false`
        naturalPressureBtn.checked = originalValue;
        // console.log('Recirculación cancelada');
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

    const value = param !== null ? param : carbonicMacerationBtn.checked;
    const originalValue = !value; // Guardar el valor original

    const message = {
        CMD_maceracion: value
    };
    try {
        if (!byPass) {
            await openModal(() => sendValue(JSON.stringify(message), value, value ? 'Maceracion activada': 'Maceracion desactivada'));
        }
        carbonicMacerationBtn.checked = value;
        state.maceracion = carbonicMacerationBtn.checked; // Asignar el resultado de la promesa a `state.recirculacion`
        if (state.maceracion) {
            carbonicMacerationBtn.classList.add('active');
            carbonicMacerationInput.classList.add('active');
        } else {
            carbonicMacerationBtn.classList.remove('active');
            carbonicMacerationInput.classList.remove('active');
        }
        // Si se activa la presión natural, desactiva la maceración carbónica
        if (state.maceracion) {
            naturalPressureBtn.checked = false;
            state.presion_natural = false;
            naturalPressureBtn.classList.remove('active');
            naturalPressureInput.classList.remove('active');
        }
    } catch (error) {
        state.maceracion = originalValue; // Si el modal se cierra, asignar `false`
        carbonicMacerationBtn.checked = originalValue;
        // console.log('Recirculación cancelada');
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
            await openModal(() => sendValue(JSON.stringify(message), true, 'Valor enviado'));
        }
    });
});



// Función para manejar el envío de valores
function handleValueSubmit(input, key, maxValue) {
    const value = parseFloat(input.value);
    if (!isNaN(value) && value >= 0 && value <= maxValue) {
        return true;
    } else {
        showNotification(`Valor no valido. Por favor, ingresa un valor entre 0 y ${maxValue}.`, 'error');
        return false;
    }
}



async function actionPlay(byPass = false) {
    const message = {
        start: true
    };
    
    try {
        if (!byPass) {
            await openModal(() => sendValue(JSON.stringify(message), true, 'Proceso iniciado'));
        }
    } catch (error) {
        
    }

}
async function actionStop(byPass = false) {
    const message = {
        stop: true
    };
    try {
        if (!byPass) {
            await openModal(() => sendValue(JSON.stringify(message), true, 'Proceso detenido'));
        }
    } catch (error) {

    }
}
async function actionClose() {
    const message = {
        cancelar: true
    };
    await openModal(() => sendValue(JSON.stringify(message)));
}