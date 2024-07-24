
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
        const response = await fetch(`http://54.197.173.166:8000/api/policy/${id}/`, requestOptions);
        const data = await response.json();

        // Rellenar el formulario con los datos de la política
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
    event.preventDefault(); // prevent default actions
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;
    const form = event.target; // get form
    const formData = new FormData(form); // create new form with data
    
    // FormData to Json format
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    

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
    fetch(`http://54.197.173.166:8000/api/policy/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result); 
            // reload categories
            loadPolicyData();
            window.location.href = '/administrator/policy';
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
document.getElementById('policyForm').addEventListener('submit', submitPolicyForm);
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
                fetch(`http://54.197.173.166:8000/policy/${id}/`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                            console.log("Category deleted successfully.");
                            $('#confirmDeleteModal').modal('hide'); // modal
                            window.location.href = '/administrator/policy'; // reload window
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

