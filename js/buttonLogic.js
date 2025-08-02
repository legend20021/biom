let menuOpen = false;

// Función para mostrar/ocultar el menú
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const mainContent = document.querySelector(".main-content");
    const menuButton = document.getElementById("menuButton");
    const dashboardFooter = document.getElementById("dashboardFooter");
    
    const isOpen = sidebar.classList.contains("show");
    
    if (isOpen) {
        // Cerrar sidebar
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
        mainContent.classList.remove("sidebar-open");
        dashboardFooter.classList.remove("sidebar-open");
        menuButton.classList.remove("active");
    } else {
        // Abrir sidebar
        sidebar.classList.add("show");
        overlay.classList.add("show");
        mainContent.classList.add("sidebar-open");
        dashboardFooter.classList.add("sidebar-open");
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
    dashboardFooter.classList.remove("sidebar-open");
    menuButton.classList.remove("active");
}

// Event listener para cerrar el sidebar al hacer clic en el overlay
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
        dashboardFooter.classList.remove("sidebar-open");
    }
});

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
document.getElementById('scrollTop').addEventListener('click', function() {
    scrollToTop();
});

// Función para hacer scroll hacia arriba
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Desplazamiento suave
    });
}
scrollToTop(); // Llamada inicial para asegurar que el scroll esté al inicio


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
    
    // Manejar la visibilidad del header global
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