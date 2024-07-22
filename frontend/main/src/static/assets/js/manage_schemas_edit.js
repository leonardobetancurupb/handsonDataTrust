
// Función para obtener el ID de la URL
function getIdFromUrl() {
    var urlActual = window.location.href;
    var partesUrl = urlActual.split('/');
    var ultimoSegmento = partesUrl[partesUrl.length - 2];
    console.log(ultimoSegmento);
    return ultimoSegmento
}
    


// Función para cargar los datos del registro y rellenar el formulario
async function loadSchemaData() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const response = await fetch(`http://54.197.173.166:8000/schema/${id}/`, requestOptions);
        const data = await response.json();

        // Rellenar el formulario con los datos de la política
        document.getElementById('name').value = data.name;
        document.getElementById('description').value = data.description;
        document.getElementById('structure').value = data.structure;


    } catch (error) {
        console.error('Error loading schema data:', error);
    }
}

// Llamar a la función para cargar los datos de la política cuando la página se cargue
window.addEventListener("load", loadSchemaData);



function validateJson() {
    const jsonInput = document.getElementById('structure').value;
    const validationMessage = document.getElementById('validationMessage');
    const submitJsonButton = document.getElementById('submitJsonButton');
    
    try {
        JSON.parse(jsonInput);
        validationMessage.innerHTML = '<div class="alert alert-success font-size-small p-1">Valid JSON format.</div>';
        submitJsonButton.disabled = false; // Habilitar el botón de envío
    } catch (e) {
        validationMessage.innerHTML = `<div class="alert alert-danger font-size-small p-1">Invalid JSON format: ${e.message}</div>`;
        submitJsonButton.disabled = true; // Deshabilitar el botón de envío
    }
}

// Event listener para el botón de validación
document.getElementById('validateJsonButton').addEventListener('click', validateJson);


function submitSchemaForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    
    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    const id = formDataObj.id; // Obtener el ID del registro a actualizar
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(formDataObj),
    };
    
    // Hacer la solicitud PATCH al servidor
    fetch(`http://54.197.173.166:8000/schema/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result); // Manejar la respuesta del servidor, si es necesario
            // Llamar a la función para recargar las categorías después de enviar el formulario
            loadSchemaData();
            window.location.href = '/administrator/schemas/';
        })
        .catch(error => console.error(error));
}

// Event listener para el envío del formulario
document.getElementById('schemaForm').addEventListener('submit', submitSchemaForm);

// Función para confirmar la eliminación
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
    };

    // Hacer la solicitud DELETE al servidor
    fetch(`http://54.197.173.166:8000/schema/${id}/`, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Schema deleted successfully.");
                // Navegar a otra página o recargar la lista de categorías
                $('#confirmDeleteModal').modal('hide'); // Ocultar el modal de confirmación
                window.location.href = '/administrator/schemas/'; // Recargar las categorías después de eliminar una
            } else {
                console.error("Failed to delete schema.");
            }
        })
        .catch(error => console.error('Error:', error));
});

