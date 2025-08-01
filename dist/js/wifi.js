
//WIFI

// const wifiNetworks = [
//     { id: 1, name: "Red1", intensity: "Fuerte" },
//     { id: 2, name: "Red2", intensity: "Media" },
//     { id: 3, name: "Red3", intensity: "Débil" },
//     { id: 4, name: "Red4", intensity: "Fuerte" }
// ];

const renderWifiTable = () => {
    const tbody = document.querySelector("#wifiTable5 tbody");
    tbody.innerHTML = state.wifiNetworks.map((network, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${network.name}</td>
            <td>${network.intensity}</td>
            <td>
                <button class="action-button5" onclick="connectToWifi('${network.name}')">🔗</button>
            </td>
        </tr>
    `).join("");
};
// renderWifiTable();

const connectToWifi = (networkName) => {
    document.getElementById("wifiPasswordContainer5").style.display = "block";
    document.getElementById("connectWifi5").style.display = "block";
    document.getElementById("disconnectWifi5").style.display = "none";

    // Cambiar el texto del label correctamente
    const label = document.getElementById("labelWifiPassword5");
    if (label) {
        label.innerText = "Contraseña de " + networkName;
    }

    document.getElementById("connectWifi5").onclick = async () => {
        const passwordInput = document.getElementById("wifiPassword5");
        const password = passwordInput.value.trim();

        if (!password) {
            showTempNotification("Por favor, ingresa una contraseña.", 'error');
            return;
        }

        // Log the connection details as a JavaScript object
        const connectionDetails = {
            nombre_red: networkName,
            contraseña_red: password
        };
        console.log("Detalles de conexión:", connectionDetails);

        await openModal(() => sendValue(connectionDetails, true, `Conectado a ${networkName}`));
        
        clearWifiInputs();

        // Mostrar botón de desconexión
        document.getElementById("connectWifi5").style.display = "none";
        document.getElementById("disconnectWifi5").style.display = "block";
    };
};

const clearWifiInputs = () => {
    document.getElementById("wifiPassword5").value = "";
};

document.getElementById("disconnectWifi5").addEventListener("click", () => {
    console.log("Desconectado de la red Wi-Fi.");
    showTempNotification("Desconectado de la red Wi-Fi", 'success');
    clearWifiInputs();

    // Ocultar elementos relacionados con la conexión
    document.getElementById("wifiPasswordContainer5").style.display = "none";
    document.getElementById("connectWifi5").style.display = "none";
    document.getElementById("disconnectWifi5").style.display = "none";
});

document.getElementById("togglePassword5").addEventListener("click", () => {
    const passwordInput = document.getElementById("wifiPassword5");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    document.getElementById("togglePassword5").textContent = type === "password" ? "👁️" : "🙈";
});
//FIN TELEGRAM WIFI
