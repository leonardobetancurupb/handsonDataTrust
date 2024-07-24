


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
                method: "POST",
                headers: myHeaders,
            };

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
        const datasetResponse = await fetch('http://54.197.173.166:8000/api/data/', requestOptions);
        const datasets = await datasetResponse.json();
        console.log(datasets);

        // Limpiar el contenedor antes de agregar nuevas tarjetas
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; // Asegúrate de que esto esté ejecutándose correctamente

        // Iterar sobre cada política y obtener la categoría correspondiente
        for (const dataset of datasets) {
            // Obtener la categoría correspondiente
            const policyResponse = await fetch(`http://54.197.173.166:8000/api/policy/${dataset.idPolicy}/`, requestOptions);
            const policy = await policyResponse.json();
            const schemaResponse = await fetch(`http://54.197.173.166:8000/api/schema/${dataset.idSchema}/`, requestOptions);
            const schema = await schemaResponse.json();
            const categoryResponse = await fetch(`http://54.197.173.166:8000/api/category/${dataset.idSchema}/`, requestOptions);
            const category = await categoryResponse.json();
            // Construir el HTML de la tarjeta con la data
            const cardHtml = `
            <div class="col-md-6 mb-4 card-wrapper">
                <div class="card">
                    <div class="w-100 h-25 bg-secondary rounded-top d-flex justify-content-center text-light">
                        ${dataset.id}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${schema.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted btn">${category.category}</h6>
                        <p class="card-text">Date: ${policy.estimatedTime}</p>
                        <div class="d-flex justify-content-between">
                        <a href="/dataset_selected/${dataset.id}" class="btn btn-success">Select</a>
                        <div>
                            <a href='../edit_datasets/${dataset.id}/' class="mr-1"><img src='/static/assets/img/edit.png' alt=""></a>
                            <a href="#" data-url="http://54.197.173.166:8000/deleteData/${dataset.id}" class="mr-1 delete-dataset">
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


    } catch (error) {
        console.error('Error fetching datasets:', error);
    }
};


// Llamar a la función para cargar las categorías cuando la página se cargue
window.addEventListener("load", async () => {
    await loadDatasets();
});
