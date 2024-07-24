 
function getCacheVariable(key) {
    const variableName = key;

    fetch(`/accounts/get_cache/?access=${variableName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        return data.value;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


 // filter
function filterCategories() {
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

        function deleteCategory(event) {
            event.preventDefault(); // prevent default actions
            console.log("Se ha metido en la funcion deletecategory");
            urlToDelete = event.currentTarget.getAttribute('data-url'); // get url to request

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
                        console.log("Category deleted successfully.");
                        $('#confirmDeleteModal').modal('hide'); // hide modal
                        loadCategories(); // reload category
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


// get categories
const loadCategories = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET", 
        headers: myHeaders,
    };

    // send request
    fetch('http://54.197.173.166:8000/api/category/', requestOptions)
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('cardContainerCategories');
            cardContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

            
            data.forEach(category => {
                const cardHtml = `
                    <div class="col-md-4 mb-4 card-wrapper">
                        <div class="card border border-secondary">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <strong class="btn btn-secondary mr-3" disabled>${category.id}</strong>${category.category} 
                                </h6>
                                <hr>
                                <div class="d-flex justify-content-end">
                                    <a href='../edit_category/${category.id}/' class="btn btn-light btn-sm border border-secondary mr-3 h-25">
                                        <img src='/static/assets/img/edit.png' class="table-icon" alt="">
                                        Edit
                                    </a>
                                    <a href="#" data-url="http://54.197.173.166:8000/api/category/${category.id}/" class="btn btn-light btn-sm border border-secondary mr-3 h-25 delete-category">
                                        <img src='/static/assets/img/delete.png' class="table-icon" alt="">
                                        Delete
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cardContainer.innerHTML += cardHtml; // Agregar la tarjeta al contenedor
            });

            // Event listeners to delete
            document.querySelectorAll('.delete-category').forEach(link => {
                link.addEventListener('click', deleteCategory);
            });
            // Event listener to filter
            document.getElementById('searchInput').addEventListener('input', filterCategories);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

window.addEventListener("load", async () => {
    await loadCategories();
});
