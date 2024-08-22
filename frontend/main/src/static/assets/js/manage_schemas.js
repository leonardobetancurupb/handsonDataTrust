const myApiKey ="";
fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));


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

async function submitSchemaForm(event) {
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

    try{

    
    // Fetch existing categories data using a GET request
    const response = await fetch(`http://${myApiKey}:8000/api/schema/`, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`Error fetching session data: ${response.statusText}`); // Better error message
    }
    const schemas = await response.json();
    console.log(schemas);

    // Check for duplicate category names
    let isUnique = true;
    for (const schema of schemas) {
        if (schema.name === formData.get('schema')) {
            isUnique = false;
            break; // Stop iterating if a duplicate is found
        }
    }

    if(formDataObj['fieldToEncrypt'].length<1){
        throw new Error("Select field to encrypt, min 1.");// Better error message
    
    }

    if (!isUnique) {
        throw new Error("Schema already exists."); // Duplicate  error
    }

    // Check if the category name is less than 4 characters or a duplicate
    if (formData.get('name').length < 4 || !isUnique) {
        throw new Error("More than 4 characters are expected."); // Length validation error
    }

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
    fetch(`http://${myApiKey}:8000/api/schema/`, requestOptions)
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
} catch (error) {
    // Display error message to the user
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> Something went wrong: ${error}.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
}
}

// Event listener para el envío del formulario
document.getElementById('schemaForm').addEventListener('submit', submitSchemaForm);



