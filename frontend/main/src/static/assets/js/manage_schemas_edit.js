
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

        // set form
        const name_schema = data.name
        const new_name = name_schema.replace(/_/g, " ");
        document.getElementById('name').value = new_name;
        document.getElementById('description').value = data.description;
        document.getElementById('structure').value = data.structure;
        const defaultSelectedValues = data.fieldToEncrypt;
        console.log(defaultSelectedValues);
        
        const input = document.getElementById('structure').value;
        const words = input.trim().split(/\s+/); // Divide por cualquier cantidad de espacios en blanco
        const select = document.getElementById('fieldToEncrypt');
        select.innerHTML = '';
            // Añadir nuevas opciones
        words.forEach(word => {
            if (word) {
                const option = document.createElement('option');
                option.value = word;
                option.textContent = word;
                select.appendChild(option);
            }
        });

        defaultSelectedValues.forEach(value => {
            const option = select.querySelector(`option[value="${value}"]`);
            if (option) {
                option.selected = true;
            }
        });

    } catch (error) {
        console.error('Error loading schema data:', error);
    }
}

// Llamar a la función para cargar los datos de la política cuando la página se cargue
window.addEventListener("load", loadSchemaData);





function submitSchemaForm(event) {
    event.preventDefault(); // prevent default actions
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;
    const form = event.target; // get form
    const formData = new FormData(form); // create new form with data
    
    // FormData to Json format
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
        myHeaders.append("Authorization", "Bearer "+data.value);
        
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(formDataObj),
        };
    
    // request patch
    fetch(`http://54.197.173.166:8000/api/schema/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result); 
            // reload categories
            loadSchemaData();
            window.location.href = '/administrator/schemas';
        })
        .catch(error => console.error(error));
    } else {
        console.error('Token not found in response.');
    }
})
.catch(error => {
    console.error('PATCH Error:', error);
});
}

// Event listener para el envío del formulario
document.getElementById('schemaForm').addEventListener('submit', submitSchemaForm);

// delete validation function
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;

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
                myHeaders.append("Authorization", "Bearer "+data.value);
                
                const requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                };
    
                // delete request
                fetch(`http://54.197.173.166:8000/api/schema/${id}/`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                            console.log("Category deleted successfully.");
                            $('#confirmDeleteModal').modal('hide'); // modal
                            window.location.href = '/administrator/schemas'; // reload window
                    })
                    .catch(error => console.error(error));
            } else {
                console.error('Token not found in response.');
            }
        })
    .catch(error => {
        console.error('DELETE Error:', error);
    }); 
});

