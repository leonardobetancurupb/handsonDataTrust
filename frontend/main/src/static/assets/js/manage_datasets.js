
document.addEventListener("DOMContentLoaded", function() {
    fetchDatasets();
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
function submitDatasetForm(event) {
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
    console.log(JSON.stringify(formDataObj))
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formDataObj),
    };
    formDataObj["url"] = "nuevoValor"; 

    // Hacer la solicitud POST al servidor
    fetch("http://54.197.173.166:8000/dataset/", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            window.location.href = '/administrator/dataset';
        })
        .catch(error => console.error(error));
}

// Event listener para el envío del formulario
document.getElementById('datasetForm').addEventListener('submit', submitDatasetForm);

