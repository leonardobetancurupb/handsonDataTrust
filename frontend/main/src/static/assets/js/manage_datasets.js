const formData = new FormData();
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getCacheVariable(key) {
    const variableName = key;

    data = fetch(`/accounts/get_cache/?key=${variableName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return data
}

let select_value_schema;
document.getElementById('idSchema').addEventListener('change', function() {
    var select = document.getElementById('idSchema');
    var button = document.getElementById('viewSchemaBtn');
    var buttonExport = document.getElementById('ExportSchema');
    select_value_schema = select.value;
    console.log(select_value_schema);


    if (select.value) {
        button.disabled = false;
        buttonExport.disabled = false; // Habilita el botón si se selecciona una opción
    } else {
        button.disabled = true; // Deshabilita el botón si no hay ninguna opción seleccionada
        buttonExport.disabled = true;
    }
});
document.getElementById('idPolicy').addEventListener('change', function() {
    var select = document.getElementById('idPolicy');
    var button = document.getElementById('viewPolicyBtn');
    if (select.value) {
      button.disabled = false; // Habilita el botón si se selecciona una opción
    } else {
      button.disabled = true; // Deshabilita el botón si no hay ninguna opción seleccionada
    }
});

function fetchDatasets() {
    const myHeaders2 = new Headers();
    myHeaders2.append("Content-Type", "application/json");
    
    const requestOptions2 = {
        method: "GET",
        headers: myHeaders2,
    };
    fetch('http://54.197.173.166:8000/schema/', requestOptions2)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('idSchema');
            data.forEach(schema => {
                const option = document.createElement('option');
                option.value = schema.id;
                option.textContent = schema.description;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching schemas:', error));
        fetch('http://54.197.173.166:8000/policy/', requestOptions2)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('idPolicy');
            data.forEach(policy => {
                const option = document.createElement('option');
                option.value = policy.id;
                option.textContent = policy.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching policies:', error));
        fetch('http://54.197.173.166:8000/category/', requestOptions2)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('idCategory');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.category;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}


async function submitDatasetForm(event) {
    event.preventDefault(); 
    const form = event.target; // Obtiene el formulario
    const formData3 = new FormData(form); // Crea un objeto FormData con los datos del formulario
    console.log(JSON.stringify(formData3));
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData3.forEach((value, key) => {
        formDataObj[key] = value;
    });
    console.log(formDataObj);
    try {

            // Obtiene el id de sesión desde la caché
            const sessionResponse = await fetch(`/accounts/get_cache/?key=id_session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const sessionData = await sessionResponse.json();
            
            if (sessionData.value) {
                const id_user = sessionData.value;
                console.log(id_user);

                // Obtiene los holders desde la API
                const holdersResponse = await fetch('http://54.197.173.166:8000/api/holders/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const holdersData = await holdersResponse.json();

                // Filtra el holder correspondiente
                const filteredObject = holdersData.find(item => item.idPerson === id_user);
                
                if (filteredObject) {
                    const id = filteredObject.id;
                    console.log('holder id:', id);
                    console.log(formData);
                    // Configura los encabezados para la solicitud POST
                    const myHeaders3 = new Headers();
                    myHeaders3.append("Content-Type", "multipart/form-data");
                    myHeaders3.append("Authorization", "Bearer " + tokenData.value);
                    myHeaders3.append("X-CSRFToken", getCookie('csrftoken'));

                    // Envía la solicitud POST con los datos del formulario
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders3,
                        body: formData,
                    };

                    const postResponse = await fetch(`/holder/soli_data/${id}/`, requestOptions);
                    const result = await postResponse.text();
                    console.log(result);
                    // window.location.href = '/administrator/shcemas_owner';
                } else {
                    console.log('holder not exist.');
                }
            } else {
                console.error('Session id not found in cache.');
            }
    } catch (error) {
        console.error('Error:', error);
    }
}





// document.getElementById('datasetForm').addEventListener('submit', submitDatasetForm);
document.getElementById('ExportFileform').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    // Aquí puedes definir tu lógica para establecer la URL de destino
    const dynamicAction = `http://54.197.173.166:8000/downloadSchema/${select_value_schema}/`;
    
    // Asigna la acción dinámica al formulario
    this.action = dynamicAction;
    
    // O puedes enviar el formulario manualmente usando fetch u otra técnica
    const formData2 = new FormData(this);
    
    fetch(dynamicAction, {
        method: 'POST',
        body: formData2
    }).then(response => {
        if (response.ok) {
            return response.blob(); // Suponiendo que la respuesta es un archivo para descargar
        } else {
            throw new Error('Network response was not ok.');
        }
    }).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'app.xlsx'; // Cambia 'filename.extension' por el nombre que quieras para el archivo
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});


document.addEventListener("DOMContentLoaded", function() {
    fetchDatasets();
});


const fileInput = document.getElementById('fileInput'); 
const submitBtn = document.getElementById('submitBtn');
fileInput.addEventListener('change', handleFileChange);
    function handleFileChange() {  
        formData.append('archivo', fileInput.files[0]); 
        formData.append('idCategory', document.getElementsByName('idCategory')[0].value); 
        formData.append('format', document.getElementsByName('format')[0].value); 
        formData.append('idSchema', document.getElementsByName('idSchema')[0].value);
        formData.append('idPolicy', document.getElementsByName('idPolicy')[0].value); 
        submitBtn.disabled = false; // Enable submit button after file selection 
        console.log("confirmación");
        console.log(fileInput.files[0]);
    } 


    // form.addEventListener('submit', handleFormSubmit);
    //  function handleFormSubmit(event) { event.preventDefault(); 
    //     // Prevent default form submission 
    //     fetch('http://127.0.0.1:8000/saveData/holder/1/',
    //      { method: 'POST', body: formData, }) 
    //      .then(response => response.json()) // Handle response as JSON 
    //      .then(data => { 
    //         console.log('Form submitted successfully:', data); 
    //     }) .catch(error => {
    //          console.error('Error submitting form:', error); 
    //         }); 
    //     }