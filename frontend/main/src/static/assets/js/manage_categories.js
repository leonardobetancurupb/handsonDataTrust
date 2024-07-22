function submitCategoryForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    // Solicitud GET para obtener el token
    fetch(`/accounts/get_cache/?key=access`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.value) {
            console.log(data);
            console.log(data.value);

            // Configura los encabezados para la solicitud POST
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + data.value);
            console.log(myHeaders.keys);
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(formDataObj),
            };
            
            // Hacer la solicitud POST al servidor
            fetch("http://54.197.173.166:8000/api/category/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    window.location.href = '/administrator/category';
                })
                .catch(error => console.error('POST Error:', error));
        } else {
            console.error('Token not found in response.');
        }
    })
    .catch(error => {
        console.error('GET Error:', error);
    });
}

// Event listener para el envío del formulario
document.getElementById('categoryForm').addEventListener('submit', submitCategoryForm);
