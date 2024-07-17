
function submitCategoryForm(event) {
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
    
    // Hacer la solicitud POST al servidor
    fetch("http://54.197.173.166:8000/category/", requestOptions)
        .then(response => response.text())
        .then(result => {

            window.location.href = '/administrator/category';
        })
        .catch(error => console.error(error));
}

// Event listener para el envío del formulario
document.getElementById('categoryForm').addEventListener('submit', submitCategoryForm);

