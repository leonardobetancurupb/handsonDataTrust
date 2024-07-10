const API_BASE_URL = 'https://http://127.0.0.1:8000/';
document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo
    var itemDetails = {
        category: 'Tecnología',
        description: 'Un artículo sobre las últimas tendencias en tecnología.',
        format: 'Artículo',
        schema: 'SchemaTech',
        idPolicy: 'Policy123',
        url: 'https://www.ejemplo.com/articulo-tecnologia'
    };

    // Función para mostrar los detalles del elemento
    function displayItemDetails(details) {
        document.getElementById('item-category').textContent += details.category;
        document.getElementById('item-description').textContent += details.description;
        document.getElementById('item-format').textContent += details.format;
        document.getElementById('item-schema').textContent += details.schema;
        document.getElementById('item-idPolicy').textContent += details.idPolicy;
        var urlElement = document.getElementById('item-url-link');
        urlElement.href = details.url;
        urlElement.textContent = details.url;
    }

    // Llamar a la función para mostrar los detalles
    displayItemDetails(itemDetails);
});

document.getElementById('dataForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Capturar los datos del formulario
    const formData = new FormData(event.target);
    const dataObj = Object.fromEntries(formData.entries());
    const file = dataObj['File']
    // Llamar al método createData
    try {
        const response_file = await createFile(file);
        dataObj['url'] = response_file;
        const response = await createData(dataObj);
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
});

async function createFile(dataObj) {
    const response = await fetch(`${API_BASE_URL}/saveData/holder/${user_id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    });
    return response.json();
}

async function createData(dataObj) {
    const response = await fetch(`${API_BASE_URL}/data/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    });
    return response.json();
}

async function getData(id) {
    const response = await fetch(`${API_BASE_URL}/data/${id}/`, {
        method: 'GET'
    });
    return response.json();
}

async function updateData(id, dataObj) {
    const response = await fetch(`${API_BASE_URL}/data/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    });
    return response.json();
}

async function deleteData(id) {
    const response = await fetch(`${API_BASE_URL}/data/${id}/`, {
        method: 'DELETE'
    });
    return response.status === 204; // Eliminar devuelve 204 No Content si es exitoso
}

async function listData() {
    const response = await fetch(`${API_BASE_URL}/data/`, {
        method: 'GET'
    });
    return response.json();
}