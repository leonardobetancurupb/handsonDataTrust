
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


function submitDatasetForm(event) {
    
    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    console.log(formData)
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(JSON.stringify(formDataObj['archivo']))


    
    const requestOptions2 = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formDataObj['archivo']),
    };
    // Hacer la solicitud POST al servidor
    console.log("hola");
            fetch("http://54.197.173.166:8000/data/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    // window.location.href = '/administrator/shcemas_owner';
                })
                .catch(error => console.error(error));
            // window.location.href = '/administrator/shcemas_owner';
        
    
}

document.getElementById('filedataset').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const form = event.target;
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: 'POST',
        body: formData,
        headers: myHeaders
    };

    fetch("http://54.197.173.166:8000/api/saveData/holder/2/", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Maneja la respuesta exitosa aquí (por ejemplo, mostrar un mensaje de éxito)
        })
        .catch(error => {
            console.error('Error:', error);
            // Maneja los errores aquí (por ejemplo, mostrar un mensaje de error)
        });
});

// Event listener para el envío del formulario
// document.getElementById('datasetForm').addEventListener('submit', submitDatasetForm);


document.addEventListener("DOMContentLoaded", function() {
    fetchDatasets();
});

