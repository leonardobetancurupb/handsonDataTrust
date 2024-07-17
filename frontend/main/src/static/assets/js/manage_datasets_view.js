 // Función para filtrar categorías
 function filterPolicies() {
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

        function deletePolicy(event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            console.log("Se ha metido en la funcion deletepolicy");
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
                        console.log("Policy deleted successfully.");
                        // Navegar a otra página o recargar la lista de categorías
                        $('#confirmDeleteModal').modal('hide'); // Ocultar el modal de confirmación
                        loadPolicies(); // Recargar las categorías después de eliminar una
                    } else {
                        console.error("Failed to delete policy.");
                    }
                })
                .catch(error => console.error('Error:', error));
        });

// Función para cargar las categorías desde el servidor y mostrarlas en tarjetas
const loadPolicies = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        // Hacer la solicitud GET al servidor para obtener las políticas
        const policyResponse = await fetch('http://54.197.173.166:8000/policy/', requestOptions);
        const policies = await policyResponse.json();
        console.log(policies);

        // Limpiar el contenedor antes de agregar nuevas tarjetas
        const cardContainer = document.getElementById('cardContainerPolicies');
        cardContainer.innerHTML = ''; // Asegúrate de que esto esté ejecutándose correctamente

        // Iterar sobre cada política y obtener la categoría correspondiente
        for (const policy of policies) {
            // Obtener la categoría correspondiente
            const categoryResponse = await fetch(`http://54.197.173.166:8000/category/${policy.idCategory}/`, requestOptions);
            const category = await categoryResponse.json();

            // Construir el HTML de la tarjeta con la data
            const cardHtml = `
                <div class="col-md-6 mb-4 card-wrapper">
                    <div class="card border border-secondary">
                        <div class="card-body">
                            <h5 class="card-title"><strong class="btn btn-secondary mr-3" disabled>${policy.id}</strong>${policy.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted"> ${category.category}</h6> 
                            <p class="card-text">
                                <ul>
                                    <li>
                                        <strong>Expiration:</strong> <span class="expiration-date">${policy.estimatedTime}</span>
                                    </li>
                                    <li>
                                        <strong>Value:</strong> $${policy.Value}
                                    </li>
                                </ul>
                            </p>
                            <div class="d-flex justify-content-end">
                                <a href='../edit_policy/${policy.id}/' class="btn btn-light btn-sm border border-secondary mr-3  h-25">
                                    <img src='/static/assets/img/edit.png' class="table-icon" alt="">
                                    Edit
                                </a>
                                <a href="#" data-url="http://54.197.173.166:8000/policy/${policy.id}/" class="btn btn-light btn-sm border border-secondary mr-3 h-25 delete-policy">
                                    <img src='/static/assets/img/delete.png' class="table-icon" alt="">
                                    Delete
                                </a>                                    
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += cardHtml; // Agregar la tarjeta al contenedor
        }

        // Event listeners a los nuevos enlaces de eliminación
        document.querySelectorAll('.delete-policy').forEach(link => {
            link.addEventListener('click', deletePolicy);
        });

        // Event listener para el campo de búsqueda y los campos de fecha
        document.getElementById('searchInput').addEventListener('input', filterPolicies);
        document.getElementById('startDate').addEventListener('input', filterPolicies);
        document.getElementById('endDate').addEventListener('input', filterPolicies);


    } catch (error) {
        console.error('Error fetching policies:', error);
    }
};


// Llamar a la función para cargar las categorías cuando la página se cargue
window.addEventListener("load", async () => {
    await loadPolicies();
});
