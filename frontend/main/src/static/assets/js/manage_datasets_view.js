 // Función para filtrar categorías
 function filterDatasets() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const cards = document.querySelectorAll('.card-wrapper');

    cards.forEach(card => {
        const cardTitle = card.querySelector('.card-title').innerText.toLowerCase();
        const expirationDate = card.querySelector('.expiration-date').innerText; // Asegúrate de que esta clase exista en tu HTML

        let isTitleMatch = cardTitle.includes(searchInput);
        let isDateInRange = true;

        if (startDate || endDate) {
            const expirationTime = new Date(expirationDate).getTime();
            const start = startDate ? new Date(startDate).getTime() : null;
            const end = endDate ? new Date(endDate).getTime() : null;

            if (start && end) {
                isDateInRange = expirationTime >= start && expirationTime <= end;
            } else if (start) {
                isDateInRange = expirationTime >= start;
            } else if (end) {
                isDateInRange = expirationTime <= end;
            }
        }

        if (isTitleMatch && isDateInRange) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}



let urlToDelete; // Variable para almacenar la URL de eliminación

        function deleteDataset(event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            console.log("Se ha metido en la funcion deletedataset");
            urlToDelete = event.currentTarget.getAttribute('data-url'); // Obtiene la URL del enlace

            // Mostrar el modal de confirmación
            $('#confirmDeleteModal').modal('show');
        }

        // Función para confirmar la eliminación
        document.getElementById('confirmDeleteButton').addEventListener('click', function() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
            };

            // Hacer la solicitud DELETE al servidor
            fetch(urlToDelete, requestOptions)
                .then(response => {
                    if (response.ok) {
                        console.log("Dataset deleted successfully.");
                        // Navegar a otra página o recargar la lista de categorías
                        $('#confirmDeleteModal').modal('hide'); // Ocultar el modal de confirmación
                        loadDatasets(); // Recargar las categorías después de eliminar una
                    } else {
                        console.error("Failed to delete dataset.");
                    }
                })
                .catch(error => console.error('Error:', error));
        });

// Función para cargar las categorías desde el servidor y mostrarlas en tarjetas
const loadDatasets = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        // Hacer la solicitud GET al servidor para obtener las políticas
        const datasetResponse = await fetch('http://54.197.173.166:8000/data/', requestOptions);
        const datasets = await datasetResponse.json();
        console.log(datasets);

        // Limpiar el contenedor antes de agregar nuevas tarjetas
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; // Asegúrate de que esto esté ejecutándose correctamente

        // Iterar sobre cada política y obtener la categoría correspondiente
        for (const dataset of datasets) {
            // Obtener la categoría correspondiente
            const policyResponse = await fetch(`http://54.197.173.166:8000/policy/${dataset.idPolicy}/`, requestOptions);
            const policy = await policyResponse.json();
            const schemaResponse = await fetch(`http://54.197.173.166:8000/schema/${dataset.idSchema}/`, requestOptions);
            const schema = await schemaResponse.json();

            // Construir el HTML de la tarjeta con la data
            const cardHtml = `
            <div class="col-md-6 mb-4 card-wrapper">
                <div class="card">
                    <div class="w-100 h-25 bg-secondary rounded-top d-flex justify-content-center text-light">
                        ${dataset.id}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${schema.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted btn">Clustering</h6>
                        <p class="card-text">Date: 06/07/2024 10:30:234</p>
                        <div class="d-flex justify-content-between">
                        <a href="{% url 'holder:dataset_selected' %}" class="btn btn-success">Select</a>
                        <div>
                            <a href='../edit_policy/${dataset.id}/' class="mr-1"><img src='/static/assets/img/edit.png' alt=""></a>
                            <a href="#" data-url="http://54.197.173.166:8000/data/${dataset.id}/" data-toggle="modal" class="mr-1 delete-dataset" data-target="#staticBackdrop">
                            <img src='/static/assets/img/delete.png'  alt="">
                            </a>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            cardContainer.innerHTML += cardHtml; // Agregar la tarjeta al contenedor
        }

        // Event listeners a los nuevos enlaces de eliminación
        document.querySelectorAll('.delete-dataset').forEach(link => {
            link.addEventListener('click', deleteDataset);
        });

        // Event listener para el campo de búsqueda y los campos de fecha
        document.getElementById('searchInput').addEventListener('input', filterDatasets);
        document.getElementById('startDate').addEventListener('input', filterDatasets);
        document.getElementById('endDate').addEventListener('input', filterDatasets);


    } catch (error) {
        console.error('Error fetching datasets:', error);
    }
};


// Llamar a la función para cargar las categorías cuando la página se cargue
window.addEventListener("load", async () => {
    await loadDatasets();
});
