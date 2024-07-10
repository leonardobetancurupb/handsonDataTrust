const API_BASE_URL = 'https://http://127.0.0.1:8000/';

async function createAdmin(adminData) {
    const response = await fetch(`${API_BASE_URL}/admin/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
    });
    return response.json();
}

async function getAdmin(id) {
    const response = await fetch(`${API_BASE_URL}/admin/${id}/`, {
        method: 'GET'
    });
    return response.json();
}

async function updateAdmin(id, adminData) {
    const response = await fetch(`${API_BASE_URL}/admin/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
    });
    return response.json();
}

async function deleteAdmin(id) {
    const response = await fetch(`${API_BASE_URL}/admin/${id}/`, {
        method: 'DELETE'
    });
    return response.status === 204; // Eliminar devuelve 204 No Content si es exitoso
}

async function listAdmins() {
    const response = await fetch(`${API_BASE_URL}/admin/`, {
        method: 'GET'
    });
    return response.json();
}

async function createConsumer(consumerData) {
    const response = await fetch(`${API_BASE_URL}/consumers/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(consumerData)
    });
    return response.json();
}

async function getConsumer(id) {
    const response = await fetch(`${API_BASE_URL}/consumers/${id}/`, {
        method: 'GET'
    });
    return response.json();
}

async function updateConsumer(id, consumerData) {
    const response = await fetch(`${API_BASE_URL}/consumers/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(consumerData)
    });
    return response.json();
}

async function deleteConsumer(id) {
    const response = await fetch(`${API_BASE_URL}/consumers/${id}/`, {
        method: 'DELETE'
    });
    return response.status === 204; // Eliminar devuelve 204 No Content si es exitoso
}

async function listConsumers() {
    const response = await fetch(`${API_BASE_URL}/consumers/`, {
        method: 'GET'
    });
    return response.json();
}

async function createHolder(holderData) {
    const response = await fetch(`${API_BASE_URL}/holders/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(holderData)
    });
    return response.json();
}

async function getHolder(id) {
    const response = await fetch(`${API_BASE_URL}/holders/${id}/`, {
        method: 'GET'
    });
    return response.json();
}

async function updateHolder(id, holderData) {
    const response = await fetch(`${API_BASE_URL}/holders/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(holderData)
    });
    return response.json();
}

async function deleteHolder(id) {
    const response = await fetch(`${API_BASE_URL}/holders/${id}/`, {
        method: 'DELETE'
    });
    return response.status === 204; // Eliminar devuelve 204 No Content si es exitoso
}

async function listHolders() {
    const response = await fetch(`${API_BASE_URL}/holders/`, {
        method: 'GET'
    });
    return response.json();
}