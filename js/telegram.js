
//TELEGRAM WIFI
// const users = [
//     { id: 4, name: "Juan Pérez" },
//     { id: 5, name: "María López" },
//     { id: 6, name: "Carlos García" }
// ];

const renderUserTable = () => {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = state.users.map((user, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>
                <button class="action-button" onclick="editUser(${index})">✏️</button>
                <button class="action-button" onclick="openModal(() => deleteUser(${index}))">🗑️</button>
            </td>
        </tr>
    `).join("");
};

document.getElementById("addUser").addEventListener("click", () => {
    const name = document.getElementById("userName").value.trim();
    const id = parseInt(document.getElementById("userId").value.trim());

    if (!name || !id) {
        showNotification("Por favor, completa todos los campos.", 'error');
        return;
    }

    const existingUserIndex = state.users.findIndex(user => user.id === id);

    if (existingUserIndex === -1) {
        state.users.push({ id, name });
        console.log(JSON.stringify({ action: "agregar", user: { id, name } }));
    } else if (document.getElementById("addUser").innerText === "Actualizar Usuario") {
        state.users[existingUserIndex] = { id, name };
        console.log(JSON.stringify({ action: "actualizar", user: { id, name } }));
        document.getElementById("addUser").innerText = "Agregar Usuario";
    } else {
        showNotification("El ID ya existe. Por favor, usa un ID diferente.", 'error');
        return;
    }

    renderUserTable();
    clearInputs();
    showNotification(`Se ha agregado el usuario ${name} `);
});

const deleteUser = async (index) => {
    const deletedUser = state.users.splice(index, 1)[0];

    const message = {
        eliminar_tg: deletedUser.id,
    };

    sendValue(message, false, `Se ha eliminado el usuario ${deletedUser.name}`);
    
    console.log({ action: "eliminar", user: deletedUser });
    renderUserTable();
    showNotification(`Se ha eliminado el usuario ${deletedUser.name}`);
};

const editUser = async (index) => {
    const { id, name } = state.users[index];

    const message = {
        id_usuario_tg: id,
        nombre_usuario_tg: name,
    };

    //await openModal(() => sendValue(JSON.stringify(message)));

    document.getElementById("userName").value = name;
    document.getElementById("userId").value = id;
    document.getElementById("addUser").innerText = "Actualizar Usuario";

};

const clearInputs = () => {
    document.getElementById("userName").value = "";
    document.getElementById("userId").value = "";
};

clearInputs();