
// Función para obtener el ID de la URL
function getIdFromUrl() {
    var urlActual = window.location.href;
    var partesUrl = urlActual.split('/');
    var ultimoSegmento = partesUrl[partesUrl.length - 2];
    console.log(ultimoSegmento);
    return ultimoSegmento
}
    



        




// Función para cargar los datos del registro y rellenar el formulario
function loadCategoryData() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;
    const myHeaders2 = new Headers();
    myHeaders2.append("Content-Type", "application/json");
    
    const requestOptions2 = {
        method: "GET",
        headers: myHeaders2,
    };
    fetch(`http://54.197.173.166:8000/category/${id}/`, requestOptions2)
        .then(response => response.json())
        .then(data => {
            document.getElementById('id').value = data.id;
            document.getElementById('name').value = data.category;
        })
        .catch(error => console.error('Error loading category data:', error));
}

function submitCategoryForm(event) {
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
    fetch(`http://54.197.173.166:8000/category/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result); // Manejar la respuesta del servidor, si es necesario
            // Llamar a la función para recargar las categorías después de enviar el formulario
            loadCategoryData();
            window.location.href = '/administrator/category';
        })
        .catch(error => console.error(error));
}

// Event listener para el envío del formulario
document.getElementById('categoryForm').addEventListener('submit', submitCategoryForm);

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
    fetch(`http://54.197.173.166:8000/category/${id}/`, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Category deleted successfully.");
                // Navegar a otra página o recargar la lista de categorías
                $('#confirmDeleteModal').modal('hide'); // Ocultar el modal de confirmación
                window.location.href = '/administrator/category'; // Recargar las categorías después de eliminar una
            } else {
                console.error("Failed to delete category.");
            }
        })
        .catch(error => console.error('Error:', error));
});
// Cargar los datos del registro al cargar la página
document.addEventListener('DOMContentLoaded', loadCategoryData);
