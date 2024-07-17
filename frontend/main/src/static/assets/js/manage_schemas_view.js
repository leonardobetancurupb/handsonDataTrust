 // Función para filtrar categorías
function filterSchemas() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card-wrapper');

    cards.forEach(card => {
        const cardTitle = card.querySelector('.card-title').innerText.toLowerCase();
        if (cardTitle.includes(searchInput)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}



let urlToDelete; // Variable para almacenar la URL de eliminación

        function deleteSchema(event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            console.log("Se ha metido en la funcion deleteschema");
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
                        console.log("Schema deleted successfully.");
                        // Navegar a otra página o recargar la lista de categorías
                        $('#confirmDeleteModal').modal('hide'); // Ocultar el modal de confirmación
                        loadSchemas(); // Recargar las categorías después de eliminar una
                    } else {
                        console.error("Failed to delete schema.");
                    }
                })
                .catch(error => console.error('Error:', error));
        });

// Función para cargar las categorías desde el servidor y mostrarlas en tarjetas
const loadSchemas = async () => {
    console.log("Executing loadschemas");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET", // Cambiado a GET para obtener las categorías
        headers: myHeaders,
    };

    // Hacer la solicitud GET al servidor para obtener las categorías
    fetch('http://54.197.173.166:8000/schema/', requestOptions)
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('cardContainerSchemas');
            cardContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

            // Iterar sobre cada categoría recibida y crear la tarjeta correspondiente
            data.forEach(schema => {
                const cardHtml = `
                <div class="col-md-4 mb-4 card-wrapper">
                    <div class="card border border-secondary">
                        <div class="card-body">
                            <h5 class="card-title"><strong class="btn btn-secondary mr-3" disabled>${schema.id}</strong>${schema.description}</h5>
                            <hr>
                            <div class="d-flex justify-content-end">
                                <a href='../edit_schemas/${schema.id}/' class="btn btn-light btn-sm border border-secondary mr-3  h-25">
                                    <img src='/static/assets/img/edit.png' class="table-icon" alt="">
                                    Edit
                                </a>
                                <a href="#" data-url="http://54.197.173.166:8000/schema/${schema.id}/" class="btn btn-light btn-sm border border-secondary mr-3 h-25 delete-schema">
                                    <img src='/static/assets/img/delete.png'  class="table-icon" alt="">
                                    Delete
                                </a>                                    
                            </div>
                        </div>
                    </div>
                </div>
                `;
                cardContainer.innerHTML += cardHtml; // Agregar la tarjeta al contenedor
            });

            // Event listeners a los nuevos enlaces de eliminación
            document.querySelectorAll('.delete-schema').forEach(link => {
                link.addEventListener('click', deleteSchema);
            });
            // Event listener para el filtro de búsqueda
            document.getElementById('searchInput').addEventListener('input', filterSchemas);
        })
        .catch(error => {
            console.error('Error fetching schemas:', error);
        });
}

// Llamar a la función para cargar las categorías cuando la página se cargue
window.addEventListener("load", async () => {
    await loadSchemas();
});
