// Function to get key
async function getKey() {
    var Response = await fetch('/accounts/key/');
    var key_json = await Response.json();
    console.log(key_json.my_api_key);
    return key_json.my_api_key;
}


// Function to get the ID category from the URL
function getIdFromUrl() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const lastSegment = urlParts[urlParts.length - 2];
    console.log(lastSegment);
    return lastSegment;
}

// Function to filter datasets based on search input and date range
function filterDatasets() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const cards = document.querySelectorAll('.card-wrapper');

    cards.forEach(card => {
        const cardTitle = card.querySelector('.card-title').innerText.toLowerCase();
        const expirationDate = card.querySelector('.expiration-date').innerText;

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

        card.style.display = (isTitleMatch && isDateInRange) ? '' : 'none';
    });
}

let urlToDelete; // Variable to store the URL for deletion

// Function to handle the deletion of a dataset
function deleteDataset(event) {
    event.preventDefault(); // Prevent the default link behavior
    console.log("Entered deleteDataset function");
    urlToDelete = event.currentTarget.getAttribute('data-url'); // Get the URL from the link

    // Show the confirmation modal
    $('#confirmDeleteModal').modal('show');
}

// Function to confirm the deletion
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
    };

    fetch(urlToDelete, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Dataset deleted successfully.");
                $('#confirmDeleteModal').modal('hide'); // Hide the confirmation modal
                loadDatasets(); // Reload the datasets after deletion
            } else {
                console.error("Failed to delete dataset.");
            }
        })
        .catch(error => {
            // Display an error message to the user
            const alertContainer = document.getElementById('alertContainer');
            const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> Failed to delete data, try again or reload this page.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>
            `;
            alertContainer.innerHTML = alertHtml;
        });
});

// Function to load datasets from the server and display them as cards
const loadDatasets = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const myApiKey = await getKey();

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        // Fetch datasets from the server
        const datasetResponse = await fetch('http://${myApiKey}:8000/api/data/', requestOptions);
        const datasets = await datasetResponse.json();
        console.log(datasets);

        const getIdPersonResponse = await fetch(`/accounts/get_cache/?key=id_session`, requestOptions);
        const IdPerson = await getIdPersonResponse.json();
        console.log(IdPerson);

        const getIdHolderResponse = await fetch(`http://${myApiKey}:8000/api/holders/`, requestOptions);
        const IdHolder = await getIdHolderResponse.json();
        const filteredHolder = IdHolder.find(item => item.idPerson === IdPerson.value);
        console.log(filteredHolder);

        const filteredData = datasets.filter(item => item.idHolder === filteredHolder.id);
        console.log(filteredData);

        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; // Clear the container

        // Iterate over the filtered datasets and create cards
        for (const dataset of filteredData) {
            const policyResponse = await fetch(`http://${myApiKey}:8000/api/policy/${dataset.idPolicy}/`, requestOptions);
            const policy = await policyResponse.json();
            const schemaResponse = await fetch(`http://${myApiKey}:8000/api/schema/${dataset.idSchema}/`, requestOptions);
            const schema = await schemaResponse.json();
            const categoryResponse = await fetch(`http://${myApiKey}:8000/api/category/${dataset.idCategory}/`, requestOptions);
            const category = await categoryResponse.json();

            const schemaName = schema.name.replace(/_/g, " ");
            const cardHtml = `
                <div class="col-md-6 mb-4 card-wrapper">
                    <div class="card">
                        <div class="w-100 h-25 bg-secondary rounded-top d-flex justify-content-center text-light">
                            -
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${schemaName}</h5>
                            <h6 class="card-subtitle mb-2 text-muted btn">${category.category}</h6>
                            <p class="card-text">Expiration: <i class="expiration-date">${policy.estimatedTime}</i></p>
                            <div class="d-flex justify-content-between">
                                <a href="../dataset_selected/${dataset.id}" class="btn btn-success">Select</a>
                                <div>
                                    <a href='../edit_datasets/${dataset.id}' class="mr-1"><img src='/static/assets/img/edit.png' alt="Edit"></a>
                                    <a href="#" data-url="http://${myApiKey}:8000/data/${dataset.id}/" class="mr-1 delete-dataset">
                                        <img src='/static/assets/img/delete.png' alt="Delete">
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += cardHtml; // Add the card to the container
        }

        // Attach event listeners to the new delete links
        document.querySelectorAll('.delete-dataset').forEach(link => {
            link.addEventListener('click', deleteDataset);
        });

        // Attach event listeners to the search input and date fields
        document.getElementById('searchInput').addEventListener('input', filterDatasets);
        document.getElementById('startDate').addEventListener('input', filterDatasets);
        document.getElementById('endDate').addEventListener('input', filterDatasets);

    } catch (error) {
        // Display an error message to the user
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
    }
};

// Call the function to load datasets when the page loads
window.addEventListener("load", async () => {
    await loadDatasets();
});
