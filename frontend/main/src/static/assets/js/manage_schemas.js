

function submitSchemaForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    
    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formDataObj),
    };
    console.log(JSON.stringify(formDataObj))
    // Hacer la solicitud POST al servidor
    fetch("http://54.197.173.166:8000/schema/", requestOptions)
        .then(response => response.text())
        .then(result => {

            window.location.href = '/administrator/schemas/';
        })
        .catch(error => console.error(error));
}

// Event listener para el envío del formulario
document.getElementById('schemaForm').addEventListener('submit', submitSchemaForm);


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



