let menuOpen = false;

// Función para mostrar/ocultar el menú
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const mainContent = document.querySelector(".main-content");
    const menuButton = document.getElementById("menuButton");
    
    const isOpen = sidebar.classList.contains("show");
    
    if (isOpen) {
        // Cerrar sidebar
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
        mainContent.classList.remove("sidebar-open");

        menuButton.classList.remove("active");
    } else {
        // Abrir sidebar
        sidebar.classList.add("show");
        overlay.classList.add("show");
        mainContent.classList.add("sidebar-open");

        menuButton.classList.add("active");
    }
}

// Función para cerrar el sidebar
function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const mainContent = document.querySelector(".main-content");
    const menuButton = document.getElementById("menuButton");
    
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
    mainContent.classList.remove("sidebar-open");

    menuButton.classList.remove("active");
}

// Event listener para cerrar el sidebar al hacer clic en el overlay y manejar rutas iniciales
document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("sidebarOverlay");
    const mainContent = document.querySelector(".main-content");
    
    // Asegurar estado inicial correcto
    if (overlay) {
        overlay.classList.remove("show");
        overlay.addEventListener("click", closeSidebar);
    }
    if (mainContent) {
        mainContent.classList.remove("sidebar-open");
    }

    // Verificar si hay una ruta inicial específica (como upload)
    handleInitialRouting();
});

// Función para manejar el enrutamiento inicial basado en la URL
function handleInitialRouting() {
    // Revisar tanto el path (/upload) como el hash (#upload) y query param (?section=upload)
    const path = window.location.pathname;
    const hash = window.location.hash;
    const href = window.location.href; // Revisión completa por si acaso

    // Detectar intención de ir a upload
    if (path.includes('/upload') || hash.includes('upload') || href.includes('upload')) {
        console.log("📂 Ruta de actualización detectada, navegando a sección upload...");
        
        // Usamos setTimeout para asegurar que el resto de componentes se hayan inicializado
        setTimeout(() => {
            // Verificar si navigateToSection está disponible
            if (typeof navigateToSection === 'function') {
                // Forzar la navegación a la sección upload
                navigateToSection('upload');
            } else {
                // Fallback manual si la función no está lista
                const uploadSection = document.getElementById('upload');
                if (uploadSection) {
                    // Ocultar otras secciones
                    document.querySelectorAll('.main-content .content').forEach(s => s.style.display = 'none');
                    // Mostrar upload
                    uploadSection.style.display = 'block';
                }
            }
        }, 100);
    }
}

// Event listener para cerrar el sidebar con la tecla ESC
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        const sidebar = document.getElementById("sidebar");
        if (sidebar.classList.contains("show")) {
            closeSidebar();
        }
    }
});
//actualizarModo(); //EJECUTA LA FUNCION PARA SABER SI ESTOY EN MODO MANUAL O AUTOMATICO

// Función para cerrar el menú cuando se hace clic fuera
document.addEventListener("click", function(event) {
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const overlay = document.getElementById("sidebarOverlay");

    // Verificar si el clic fue fuera del sidebar y del botón del menú
    if (!sidebar.contains(event.target) &&
        !menuButton.contains(event.target) &&
        !overlay.contains(event.target) &&
        sidebar.classList.contains("show")
    ) {
        closeSidebar();
    }
});

// Evitar que los clics dentro del sidebar cierren el menú
document.getElementById("sidebar").addEventListener("click", function(event) {
    // Cerrar sidebar al hacer clic en enlaces de navegación
    if (event.target.closest("a.nav-link")) {
        // Pequeño delay para permitir que la navegación se complete
        setTimeout(() => {
            closeSidebar();
        }, 150);
    } else if (!event.target.closest("button") && !event.target.closest("input")) {
        // Solo detenemos la propagación si no es un botón o input
        event.stopPropagation();
    }
});


//event listener para scrollTop para hacer scroll hacia arriba
// document.getElementById('scrollTop').addEventListener('click', function() {
//     scrollToTop();
// });

// Función para hacer scroll hacia arriba
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Desplazamiento suave
    });
}
scrollToTop(); // Llamada inicial para asegurar que el scroll esté al inicio


// JavaScript para manejar la visibilidad de las secciones
function showSection(event, curveDetail = null) {

    // Para mostrar detalles de una curva anterior igual se carga la sección de gráfica, el parametro para esa sección es grafica-static
    event.preventDefault();
    let sectionId = event.target.getAttribute('data-section');
    const sections = document.querySelectorAll('.main-content .content');
    const diagnosisHeader = document.getElementById('diagnosis-header');

    

    if (sectionId === 'diagnostico') {
        sectionId = 'dashboard';
        window.state.diagnosis = true;
        if (window.state.start && window.state.diagnosis) {
            notificationManager.show("Hay un proceso activo. No se puede realizar un diagnóstico.", "error");
            return;
        }
        window.changeDisableStateForced(false);
        diagnosisHeader.style.display = 'block';
    } else {
        window.state.diagnosis = false;
        window.changeDisableStateForced(true);
        diagnosisHeader.style.display = 'none';
    }

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
    if (sectionId === 'graficas-static' && curveDetail) {
        const seccionGraficas = document.getElementById('graficas');
        if (seccionGraficas) {
            seccionGraficas.style.display = 'block';
        }
    }
    
    // Manejar la visibilidad del header global
    initializeHeader(); // Inicializa el header al mostrar una sección

    //carga la data inicial de las graficas
    if (sectionId === 'graficas') {
        getInitialChartData();
    }
    if (sectionId === 'graficas-static' && curveDetail) {
        getInitialChartData(curveDetail);
    }

    const indicatorsContainer = document.querySelectorAll('#dashboard .indicators');
    if (window.state.diagnosis) {
        indicatorsContainer.forEach(indicator => {
            indicator.style.display = 'none';
        });
    } else {
        indicatorsContainer.forEach(indicator => {
            indicator.style.display = 'grid';
        });
    }

    if (sectionId === 'conexiones') {
        initWiFiConfiguration();
    }

    if (sectionId === 'log') {
        getLogsData();
    }

    if (sectionId === 'recetas') {
        // Verificar que la función existe antes de llamarla
        if (typeof loadInitReceipes === 'function') {
            loadInitReceipes();
        } else {
            console.error('❌ loadInitReceipes no está definida. Verifica que recipes.js esté cargado.');
        }
    }
    if (sectionId === 'curvas') {
        // Verificar que la función existe antes de llamarla
        if (typeof loadInitCurves === 'function') {
            loadInitCurves();
        } else {
            console.error('❌ loadInitCurves no está definida. Verifica que curves.js esté cargado.');
        }
        
        // Inicializar filtros de curvas para resetear estado
        setTimeout(() => {
            if (typeof initializeCurveFilters === 'function') {
                initializeCurveFilters();
            }
        }, 100);
    }
}

// Mostrar por defecto la sección "dashboard"
// // si tiene la clase default lo pone como grid y sino lo pone como block
// const dashboardElement = document.getElementById('dashboard');
// if (dashboardElement.classList.contains('default')) {
//     document.getElementById('dashboard').style.display = 'grid';
// } else {
//     document.getElementById('dashboard').style.display = 'block';
// }
document.getElementById('dashboard').style.display = 'block';

// Función simplificada para navegar a una sección específica (útil para botones de navegación)
function navigateToSection(sectionId) {
    // Crear un evento sintético que funcione con showSection
    const fakeEvent = {
        preventDefault: () => {},
        target: {
            getAttribute: (attr) => attr === 'data-section' ? sectionId : null,
            classList: {
                add: () => {} // Función vacía para evitar errores
            }
        }
    };
    
    showSection(fakeEvent);
}


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

function openModal(callback, confirmationText = '¿Estás seguro de que deseas realizar esta acción?') {
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('active');

    const modalText = document.getElementById('confirmation-modal-text');
    modalText.textContent = confirmationText;

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
