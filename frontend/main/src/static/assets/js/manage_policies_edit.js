
// Función para obtener el ID de la URL
function getIdFromUrl() {
    var urlActual = window.location.href;
    var partesUrl = urlActual.split('/');
    var ultimoSegmento = partesUrl[partesUrl.length - 2];
    console.log(ultimoSegmento);
    return ultimoSegmento
}
    

// Función para cargar las opciones del selector de categorías
async function loadCategoryOptions(selectedCategoryId) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const response = await fetch('http://54.197.173.166:8000/category/', requestOptions);
        const categories = await response.json();
        const categorySelect = document.getElementById('IdCategory');
        categorySelect.innerHTML = ''; // Limpiar las opciones actuales

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.category;
            categorySelect.appendChild(option);
            // Establecer la categoría seleccionada por defecto
            if (selectedCategoryId == category.id) {
                categorySelect.value = selectedCategoryId;
                categorySelect.textContent = category.category
            }
        });

        console.log(categorySelect)
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Función para cargar los datos del registro y rellenar el formulario
async function loadPolicyData() {
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
        const response = await fetch(`http://54.197.173.166:8000/policy/${id}/`, requestOptions);
        const data = await response.json();

        // Rellenar el formulario con los datos de la política
        document.getElementById('id').value = data.id;
        document.getElementById('name').value = data.name;
        document.getElementById('description').value = data.description;
        document.getElementById('estimatedTime').value = data.estimatedTime;
        document.getElementById('Value').value = data.Value;

        // Cargar las opciones de categorías y establecer la categoría seleccionada
        await loadCategoryOptions(data.IdCategory);

    } catch (error) {
        console.error('Error loading policy data:', error);
    }
}

// Llamar a la función para cargar los datos de la política cuando la página se cargue
window.addEventListener("load", loadPolicyData);

function submitPolicyForm(event) {
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
    fetch(`http://54.197.173.166:8000/policy/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result); // Manejar la respuesta del servidor, si es necesario
            // Llamar a la función para recargar las categorías después de enviar el formulario
            loadPolicyData();
            window.location.href = '/administrator/policy';
        })
        .catch(error => console.error(error));
}

// Event listener para el envío del formulario
document.getElementById('policyForm').addEventListener('submit', submitPolicyForm);

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
    fetch(`http://54.197.173.166:8000/policy/${id}/`, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Policy deleted successfully.");
                // Navegar a otra página o recargar la lista de categorías
                $('#confirmDeleteModal').modal('hide'); // Ocultar el modal de confirmación
                window.location.href = '/administrator/policy'; // Recargar las categorías después de eliminar una
            } else {
                console.error("Failed to delete policy.");
            }
        })
        .catch(error => console.error('Error:', error));
});
