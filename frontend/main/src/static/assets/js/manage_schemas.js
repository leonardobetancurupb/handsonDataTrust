
function updateSelectOptions() {
    const input = document.getElementById('structure').value;
    const words = input.trim().split(/\s+/); // Divide por cualquier cantidad de espacios en blanco
    const select = document.getElementById('options');
    select.innerHTML = '';
    words.forEach(word => {
        if (word) {
            const option = document.createElement('option');
            option.value = word;
            option.textContent = word;
            select.appendChild(option);
        }
    });
}

function submitSchemaForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    
    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    
    // Convierte FormData a un objeto JSON, manejando el campo múltiple
    const formDataObj = {};
    
    const selectedFields = [];
    for (const pair of formData.entries()) {
        console.log(pair);
        if (pair[0] === 'fieldToEncrypt') { // Check for the specific field name
        selectedFields.push(pair[1]);
        }
    }

    const selectedFieldsJSON = selectedFields;
    console.log(selectedFieldsJSON);
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });


    formDataObj['fieldToEncrypt']=selectedFieldsJSON;
    name_schema = formDataObj['name']
    formDataObj['name'] = name_schema.replace(/\s/g, "_");
    console.log(formDataObj);
    const finalJsonString = JSON.stringify(formDataObj);
    console.log(finalJsonString);
    fetch(`/accounts/get_cache/?key=access`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.value) {
            console.log(data);
            console.log(data.value);

    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + data.value);
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: finalJsonString,
    };
    console.log(finalJsonString);
    // Hacer la solicitud POST al servidor
    fetch("http://54.197.173.166:8000/api/schema/", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            window.location.href = '/administrator/schemas/';
        })
        .catch(error => console.error(error));
    } else {
        console.error('Token not found in response.');
    }
})
.catch(error => {
    console.error('GET Error:', error);
});
}

// Event listener para el envío del formulario
document.getElementById('schemaForm').addEventListener('submit', submitSchemaForm);



