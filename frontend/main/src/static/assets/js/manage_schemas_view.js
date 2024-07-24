 // filter
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



let urlToDelete; 

function deleteSchema(event) {
    event.preventDefault(); // prevent default actions
    console.log("Se ha metido en la funcion deleteschema");
    urlToDelete = event.currentTarget.getAttribute('data-url'); // Obtiene la URL del enlace
    // view modal
    $('#confirmDeleteModal').modal('show');
}
// delete validation function
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
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
                fetch(urlToDelete, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        console.log("Schema deleted successfully.");
                        $('#confirmDeleteModal').modal('hide'); // hide modal
                        loadSchemas(); // reload schemas
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

const loadSchemas = async () => {
    console.log("Executing loadschemas");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET", 
        headers: myHeaders,
    };

    fetch('http://54.197.173.166:8000/api/schema/', requestOptions)
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('cardContainerSchemas');
            cardContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas
            console.log(data)
            data.forEach(schema => {
                name_schema = schema.name
                const new_name = name_schema.replace(/_/g, " ");
                const cardHtml = `
                <div class="col-md-4 mb-4 card-wrapper">
                    <div class="card border border-secondary">
                        <div class="card-body">
                            <h5 class="card-title"><strong class="btn btn-secondary mr-3" disabled>${schema.id}</strong>${new_name}</h5>
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

            document.querySelectorAll('.delete-schema').forEach(link => {
                link.addEventListener('click', deleteSchema);
            });
            document.getElementById('searchInput').addEventListener('input', filterSchemas);
        })
        .catch(error => {
            console.error('Error fetching schemas:', error);
        });
}

window.addEventListener("load", async () => {
    await loadSchemas();
});
