function setMode(mode) {
    if (mode === 'automatic') {
        state.isAutomatic = true;
        state.isManual = false;
        elements.mainContent.classList.add('mode-automatic');
        elements.controlCards.style.cssText = 'display: noupdateTimerValuene !important';
        elements.modeIndicator.style.display = 'block';
    } else if (mode === 'manual') {
        state.isAutomatic = false;
        state.isManual = true;
        elements.mainContent.classList.remove('mode-automatic');
        elements.controlCards.style.cssText = 'display: grid !important';
        elements.modeIndicator.style.display = 'none';

        // Force style recalculation
        requestAnimationFrame(() => {
            elements.controlCards.style.opacity = '0';
            requestAnimationFrame(() => {
                elements.controlCards.style.opacity = '1';
            });
        });
    }
}

// fin para los estados true y false modo manual y auto


// Selección de elementos
// const menuIcon = document.getElementById('menuIcon');
// const menu = document.getElementById('menu');
// const buttons = document.querySelectorAll('.menu button');

// Estado del menú
let menuOpen = false;

// Botones por defecto

// // Inicializa los estados de los botones
// buttons.forEach((button) => {
//     const isActive = button.id === 'pauseButton'; // El botón de pausa comienza activo
//     button.classList.toggle('active', isActive);
//     button.setAttribute('data-state', isActive);
// });


// // Lógica de botones
// buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//         const buttonId = button.id;

//         // Cambia el estado del botón pulsado
//         buttons.forEach((btn) => {
//             const isActive = btn === button;
//             btn.classList.toggle('active', isActive);
//             btn.classList.toggle('inactive', !isActive);
//             btn.setAttribute('data-state', isActive);
//         });

//         // Log del estado actualizado
//         console.log(`${buttonId} activado: true`);
//     });
// });

// Cierra el menú al hacer clic fuera de él
function selectMenuItem(element, content) {
    // Llama a la función para mostrar el contenido
    showContent(content);

    // // Oculta el menú
    // menuOpen = false;
    // // menu.style.right = '-120px'; // Ajusta según tu diseño
    // menuIcon.classList.remove('open');

    // // Resalta el botón seleccionado
    // const links = menu.querySelectorAll('a');
    // links.forEach(link => {
    //     link.classList.remove('selected'); // Elimina la clase de selección de todos los enlaces
    // });
    // element.classList.add('selected'); // Agrega la clase de selección al enlace clicado
}

// // Cierra el menú al hacer clic fuera de él
// document.addEventListener('click', (event) => {
//     const isOutsideMenu = !menu.contains(event.target) && !menuIcon.contains(event.target);
//     if (isOutsideMenu && menuOpen) {
//         menuOpen = false;
//         menu.style.right = '-120px'; // Ajusta según tu diseño
//         menuIcon.classList.remove('open');
//     }
// });

//fin botones pausa play stop

// Función para mostrar/ocultar el menú
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show"); // Alterna entre mostrar y ocultar el menú
}
//actualizarModo(); //EJECUTA LA FUNCION PARA SABER SI ESTOY EN MODO MANUAL O AUTOMATICO

// Función para recargar la página
function reloadPage() {
    location.reload(); // Recarga la página actual
}



// Función para cerrar el menú cuando se hace clic fuera
document.addEventListener("click", function(event) {
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");

    // Verificar si el clic fue fuera del sidebar y del botón del menú
    if (!sidebar.contains(event.target) &&
        !menuButton.contains(event.target) &&
        sidebar.classList.contains("show")
    ) {
        sidebar.classList.remove("show");
    }
});

// Evitar que los clics dentro del sidebar cierren el menú
document.getElementById("sidebar").addEventListener("click", function(event) {
    // Solo detenemos la propagación si el clic no fue en un enlace
    if (!event.target.closest("a")) {
        event.stopPropagation();
    }
});



// JavaScript para manejar la visibilidad de las secciones
function showSection(event) {
    event.preventDefault();
    const sectionId = event.target.getAttribute('data-section');
    const sections = document.querySelectorAll('.main-content .content');

    // Ocultar todas las secciones
    sections.forEach(section => {
        section.style.display = 'none';
    });

    //elimina la clase 'active' de todos los enlaces
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.classList.remove('active');
    });
    //agrega la clase 'active' al enlace clicado
    event.target.classList.add('active');

    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    initializeHeader(); // Inicializa el header al mostrar una sección
}

// Mostrar por defecto la sección "dashboard"
document.getElementById('dashboard').style.display = 'block';


function toggleActionButtons() {
    // Selecciona los botones
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    const closeButton = document.getElementById('closeButton');

    // Alterna la clase 'slideUp' en ambos botones
    playButton.classList.toggle('slideUp');
    stopButton.classList.toggle('slideUp');
    closeButton.classList.toggle('slideUp');
}


function toggleCalibration(idElement) {
    const phButtons = document.getElementById(idElement);
    phButtons.classList.toggle('hideCalibration');
}

function openModal(callback) {
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('active');

    // Retornar una promesa que se resuelve o rechaza según la acción del usuario
    return new Promise((resolve, reject) => {
        // Asignar la función de confirmación
        state.modalFunction = () => {
            if (typeof callback === 'function') {
                callback(); // Ejecutar la función pasada como parámetro
            }
            resolve(true); // Resolver la promesa con `true` si se confirma
            closeModal(); // Cerrar el modal
        };

        // Modificar la función closeModal para rechazar la promesa
        const originalCloseModal = closeModal;
        closeModal = () => {
            modal.classList.remove('active');
            reject(false); // Rechazar la promesa con `false` si se cierra el modal
            closeModal = originalCloseModal; // Restaurar la función original
        };
    });
}





// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('active');
}

// Función para manejar la acción de aceptar
function confirmAction() {
    if (typeof state.modalFunction === 'function') {
        state.modalFunction();
    }
    closeModal(); // Cerrar el modal
}




function toggleAccordion(header) {
    // Obtener el contenido asociado al encabezado
    const content = header.nextElementSibling;
  
    // Alternar la clase 'active' en el encabezado
    header.classList.toggle('active');
  
    // Alternar la visibilidad del contenido
    if (content.classList.contains('active')) {
      content.classList.remove('active');
      content.style.display = 'none';
    } else {
      content.classList.add('active');
      content.style.display = 'block';
    }
  }