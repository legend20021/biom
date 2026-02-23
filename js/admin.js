const ADMIN_TEMPLATES = {
    loginModal: () => `
        <div class="modal-content recipe-modal-content" style="max-width: 350px !important;">
            <div class="recipe-modal-header">
                <h3 class="recipe-modal-title">Iniciar sesión</h3>
                <button class="recipe-modal-close" onclick="adminManager.closeLoginModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="padding:1rem;padding-top:0" class="login-form">
                    <img class="custom-icon" src="./icons/users.svg" alt="Admin" loading="lazy" style="width: 60px;height: 60px;margin-bottom: 1rem;">
                    <div class="info-form-grid" style="display: flex; flex-direction: column; gap: 1rem;">
                        <div class="form-group full-width">
                            <input type="text" id="adminUsername" class="form-input" placeholder="Nombre de usuario" required style="width: 100%;">
                            <div id="adminUsernameError" style="color: #ef4444; font-size: 0.85rem; margin-top: 4px; display: none;"></div>
                        </div>
                        <div class="form-group full-width">
                            <input type="password" id="adminPassword" class="form-input" placeholder="Contraseña" required style="width: 100%;">
                            <div id="adminPasswordError" style="color: #ef4444; font-size: 0.85rem; margin-top: 4px; display: none;"></div>
                        </div>
                    </div>
                    <button class="btn accept-btn" onclick="adminManager.login()" style="width: 100%; margin-top:2rem;">
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    `,
    authModal: () => `
        <div class="modal-content recipe-modal-content" style="max-width: 350px !important;">
            <div class="recipe-modal-header">
                <h3 class="recipe-modal-title">Administración</h3>
                <button class="recipe-modal-close" onclick="adminManager.closeLoginModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="padding:1rem;padding-top:0">
                     <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 1.5rem;">
                        <img class="custom-icon" src="./icons/users.svg" alt="Admin" style="width: 50px;height: 50px;margin-bottom: 0.5rem;">
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">Sesión iniciada</p>
                    </div>

                    <div class="change-password-section" style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-bottom: 1.5rem;">
                        <h4 style="margin-bottom: 1rem; color: var(--text-primary);">Cambiar Contraseña</h4>
                        
                        <div class="info-form-grid" style="display: flex; flex-direction: column; gap: 1rem;">
                            <div class="form-group full-width">
                                <input type="password" id="oldPassword" class="form-input" placeholder="Contraseña anterior" style="width: 100%;">
                            </div>
                            <div class="form-group full-width">
                                <input type="password" id="newPassword" class="form-input" placeholder="Nueva contraseña" style="width: 100%;">
                            </div>
                            <div class="form-group full-width">
                                <input type="password" id="confirmNewPassword" class="form-input" placeholder="Confirmar nueva contraseña" style="width: 100%;">
                                <div id="changeDetailsError" style="color: #ef4444; font-size: 0.85rem; margin-top: 4px; display: none;"></div>
                                <div id="changeDetailsSuccess" style="color: #10b981; font-size: 0.85rem; margin-top: 4px; display: none;"></div>
                            </div>
                        </div>
                        
                        <button class="btn primary-btn" onclick="adminManager.changePassword()" style="width: 100%; margin-top: 1rem;">
                            Actualizar Contraseña
                        </button>
                    </div>

                    <button class="btn" onclick="adminManager.logout()" style="width: 100%; border: 1px solid #ef4444; color: white; background: #ef4444">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    `
};

class AdminManager {
    constructor() {
        console.log('🔐 AdminManager inicializado');
    }

    // Helper para verificar cookie de sesión
    isLoggedIn() {
        return document.cookie.split(';').some((item) => item.trim().startsWith('zenit_session='));
    }

    showLoginModal() {
        console.log("🔐 Abriendo modal de admin...");
        
        // Remover si ya existe
        const existingModal = document.getElementById('adminLoginModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'adminLoginModalOverlay';
        modal.className = 'modal-overlay active';
        
        // Elegir template según estado de sesión
        if (this.isLoggedIn()) {
            console.log("✅ Sesión detectada, mostrando panel de administración");
            modal.innerHTML = ADMIN_TEMPLATES.authModal();
        } else {
            console.log("🔒 Sin sesión, mostrando login");
            modal.innerHTML = ADMIN_TEMPLATES.loginModal();
        }
        
        // Agregar al body
        document.body.appendChild(modal);

        // Click fuera para cerrar
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeLoginModal();
            }
        });

        // Event listener para cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeLoginModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Focus según template
        setTimeout(() => {
            if (this.isLoggedIn()) {
                const oldInput = document.getElementById('oldPassword');
                if (oldInput) oldInput.focus();
            } else {
                const usernameInput = document.getElementById('adminUsername');
                if (usernameInput) usernameInput.focus();
            }
        }, 100);
    }


    closeLoginModal() {
        const modal = document.getElementById('adminLoginModalOverlay');
        if (modal) {
            // Animación de salida si se desea, por ahora remover directo
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 200); // Dar tiempo si hay transición CSS
        }
    }

    async login() {
        const userField = document.getElementById('adminUsername');
        const passField = document.getElementById('adminPassword');
        
        const username = userField ? userField.value.trim() : '';
        const password = passField ? passField.value : '';
        
        // Validación visual
        let hasError = false;
        const userRegex = /^[a-zA-Z0-9]+$/; // Solo letras y números
        
        // Validar Usuario
        if (!username) {
            this.showError(userField, 'Ingrese usuario');
            hasError = true;
        } else if (username.length > 25) {
            this.showError(userField, 'Máximo 25 caracteres');
            hasError = true;
        } else if (username.length < 3) {
            this.showError(userField, 'Mínimo 3 caracteres');
            hasError = true;
        } else if (!userRegex.test(username)) {
            this.showError(userField, 'Solo letras y números (sin espacios)');
            hasError = true;
        } else {
            this.clearError(userField);
        }
        
        // Validar Password
        if (!password) {
            this.showError(passField, 'Ingrese contraseña');
            hasError = true;
        } else if (password.length < 4) {
            this.showError(passField, 'Mínimo 4 caracteres');
            hasError = true;
        } else {
            this.clearError(passField);
        }

        if (hasError) return;

        // Por ahora solo log
        console.log(`🔐 Intento de login - Usuario: ${username}`);
        
        // Usar la API para autenticación segura
        try {
            console.log("🔐 Enviando credenciales al servidor...");
            
            // Verificar que apiManager exista
            if (typeof apiManager === 'undefined') {
                throw new Error("ApiManager no está inicializado");
            }

            // Realizar petición de login
            const response = await apiManager.login(username, password);

            console.log("✅ Autenticación exitosa en servidor");
            
            if (response && response.token) {
                // Si el servidor valida correctamente y devuelve token, lo usamos
                console.log("🔐 Estableciendo sesión segura...");
                // Establecer cookie válida por 1 día con el token del servidor
                document.cookie = `zenit_session=${response.token}; path=/; max-age=86400; SameSite=Lax`;
                
                // Limpiar cualquier cookie antigua obsoleta si existe
                document.cookie = "zenit_auth=; path=/; max-age=0;";
                
                console.log("✅ Sesión establecida, recargando aplicación...");
                window.location.reload();
            } else {
                 throw new Error("El servidor no devolvió un token de sesión válido.");
            }
            
        } catch (error) {
            console.error("❌ Error en proceso de login:", error);
            // Mensaje más amigable según el error
            let msg = 'Error de conexión o servidor';
            if (error.message && (error.message.includes('401') || error.message.includes('Credenciales'))) {
                msg = 'Usuario o contraseña incorrectos';
            }
            this.showError(passField, msg);
        }
    }

    logout() {
        console.log("👋 Cerrando sesión...");
        // Eliminar cookies
        document.cookie = "zenit_session=; path=/; max-age=0;";
        document.cookie = "zenit_auth=; path=/; max-age=0;";
        
        // Recargar para aplicar cambios (volverá al index simple)
        window.location.reload();
    }

    async changePassword() {
        const oldPassField = document.getElementById('oldPassword');
        const newPassField = document.getElementById('newPassword');
        const confirmPassField = document.getElementById('confirmNewPassword');
        
        const oldPass = oldPassField ? oldPassField.value : '';
        const newPass = newPassField ? newPassField.value : '';
        const confirmPass = confirmPassField ? confirmPassField.value : '';
        
        const msgError = document.getElementById('changeDetailsError');
        const msgSuccess = document.getElementById('changeDetailsSuccess');
        
        if(msgError) msgError.style.display = 'none';
        if(msgSuccess) msgSuccess.style.display = 'none';
        
        // Validaciones
        if (!oldPass) {
            this.showError(oldPassField, 'Requerido');
            return;
        } else { this.clearError(oldPassField); }

        if (!newPass || newPass.length < 8) {
            this.showError(newPassField, 'Mínimo 8 caracteres');
            return;
        } else { this.clearError(newPassField); }

        if (newPass !== confirmPass) {
            this.showError(confirmPassField, 'No coinciden');
            return;
        } else { this.clearError(confirmPassField); }

        try {
            console.log("🔐 Enviando solicitud de cambio de contraseña...");
             // Mostrar feedback visual de carga si se desea (simple por ahora)
             
            await apiManager.changePassword(oldPass, newPass);
            
            // Éxito
            if(msgSuccess) {
                msgSuccess.textContent = "Contraseña actualizada correctamente.";
                msgSuccess.style.display = 'block';
            }
            
            // Limpiar campos
            oldPassField.value = '';
            newPassField.value = '';
            confirmPassField.value = '';
            
            // Opcional: Cerrar modal después de un tiempo o pedir re-login
            setTimeout(() => {
                // this.closeLoginModal(); // o hacemos logout
                // alert('Por seguridad, inicie sesión nuevamente');
                // this.logout();
            }, 2000);

        } catch (error) {
            console.error("❌ Error cambiando contraseña:", error);
            if(msgError) {
                msgError.textContent = error.message || "Error al actualizar la contraseña";
                msgError.style.display = 'block';
            }
        }
    }

    // Helpers visuales para errores en el modal (reutilizando estilos si existen)
    showError(element, message) {
        if (!element) return;
        element.style.borderColor = 'var(--error-color, #ef4444)';
        
        // Mostrar mensaje debajo del input
        const errorDiv = document.getElementById(element.id + 'Error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    clearError(element) {
        if (!element) return;
        element.style.borderColor = '';
        
        // Ocultar mensaje
        const errorDiv = document.getElementById(element.id + 'Error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}

// Inicializar instancia global
window.adminManager = new AdminManager();
