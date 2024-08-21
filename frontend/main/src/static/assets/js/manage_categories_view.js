// Filter function for category cards
function filterCategories() {
    // Get the search input value in lowercase
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    // Get all card wrappers
    const cards = document.querySelectorAll('.card-wrapper');
    // Loop through each card
    cards.forEach(card => {
      // Get the card title in lowercase
        const cardTitle = card.querySelector('.card-title').innerText.toLowerCase();
      // Check if the card title includes the search input
        if (cardTitle.includes(searchInput)) {
        // Show the card if it matches
        card.style.display = '';
        } else {
        // Hide the card if it doesn't match
        card.style.display = 'none';
        }
    });
}

  // Global variable to store the URL for deletion
let urlToDelete;

  // Function to handle delete category click
function deleteCategory(event) {
    // Prevent default form actions
    event.preventDefault();
    console.log("Delete category function triggered");

    // Get the URL for deletion from the clicked element's data-url attribute
    urlToDelete = event.currentTarget.getAttribute('data-url');

    // Show the confirmation modal
    $('#confirmDeleteModal').modal('show');
}

  // Function to handle delete confirmation button click
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    // Fetch access token
    fetch(`/accounts/get_cache/?key=access`, {
        method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.value) {
                console.log(data);
                console.log(data.value);
        
                // Create headers with authorization token
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer " + data.value);
        
                // Create request options for DELETE request
                const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                };
                // Send DELETE request to delete the category
                fetch(urlToDelete, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log("Category deleted successfully.");
                    $('#confirmDeleteModal').modal('hide'); // Hide modal on success
                    loadCategories(); // Reload categories after deletion
                })
                .catch(error => console.error(error));
            } else {
                console.error('Token not found in response.');
            }
        })
        .catch(error => {
        // Optionally display an error message to the user
            const alertContainer = document.getElementById('alertContainer');
            const alertHtml = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>DELETE Error:</strong> Not found.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
            `;
            alertContainer.innerHTML = alertHtml;
        });
    });

// Function to load categories asynchronously
const loadCategories = async () => {
    // Create headers for GET request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Create request options for GET request
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    // Send GET request to fetch categories
    fetch('http://backend:8000/api/category/', requestOptions)
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('cardContainerCategories');
            cardContainer.innerHTML = ''; // Clear container before adding cards

        // Loop through each category data and create HTML card
        data.forEach(category => {
            const cardHtml = `
                <div class="col-md-4 mb-4 card-wrapper">
                <div class="card border border-secondary">
                    <div class="card-body">
                    <h6 class="card-title">
                        <strong class="btn btn-secondary mr-3" disabled><span class="math-inline">\{category\.id\}</strong\></span>{category.category}
                    </h6>
                    <hr>
                    <div class="d-flex justify-content-end">
                    <a href='../edit_category/${category.id}/' class="btn btn-light btn-sm border border-secondary mr-3 h-25">
                        <img src='/static/assets/img/edit.png' class="table-icon" alt="">
                        Edit
                    </a>
                    <a href="#" data-url="http://backend:8000/api/category/${category.id}/" class="btn btn-light btn-sm border border-secondary mr-3 h-25 delete-category">
                        <img src='/static/assets/img/delete.png' class="table-icon" alt="">
                        Delete
                    </a>
                    </div>
                </div>
                </div>
            </div>
            `;
            cardContainer.innerHTML += cardHtml; // Add the card to the container
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-category').forEach(link => {
            link.addEventListener('click', deleteCategory);
        });

        // Add event listener to the search input
        document.getElementById('searchInput').addEventListener('input', filterCategories);
    })
    .catch(error => {
      // Optionally displays an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">   

            <strong>Error:</strong> Failed to load data.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml;
    });
}

// Load categories when the page loads
window.addEventListener("load", async () => {
    await loadCategories();
});