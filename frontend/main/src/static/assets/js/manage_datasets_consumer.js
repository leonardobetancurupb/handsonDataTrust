// Function to get key
async function getKey() {
    var Response = await fetch('/accounts/key/');
    var key_json = await Response.json();
    console.log(key_json.my_api_key);
    return key_json.my_api_key;
}

// Function to get the ID of a category from the URL
function getIdFromUrl() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const categoryID = urlParts[urlParts.length - 2]; // Assuming the ID is the second to last segment
    console.log(categoryID);
    return categoryID;
}

// Function to filter datasets based on title, start date, and end date
function filterDatasets() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const cards = document.querySelectorAll('.card-wrapper');

    cards.forEach(card => {
        const cardTitle = card.querySelector('.card-title').innerText.toLowerCase();
        const expirationDate = card.querySelector('.expiration-date').innerText; 
        const isTitleMatch = cardTitle.includes(searchInput);
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

let urlToDelete; // Variable to store the delete URL

// Function to initiate dataset deletion
function deleteDataset(event) {
    event.preventDefault(); // Prevent the default link behavior
    console.log("deleteDataset function triggered");
    urlToDelete = event.currentTarget.getAttribute('data-url'); // Get the URL from the data attribute

    // Show the confirmation modal
    $('#confirmDeleteModal').modal('show');
}

// Function to confirm deletion
document.getElementById('confirmDeleteButton').addEventListener('click', () => {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
    };
    
    fetch(urlToDelete, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Dataset deleted successfully.");
                // Hide the confirmation modal and reload datasets
                $('#confirmDeleteModal').modal('hide');
                loadDatasets();
            } else {
                console.error("Failed to delete dataset.");
            }
        })
        .catch(error => console.error('Error:', error));
});

// Function to load datasets from the server and display them as cards
const loadDatasets = async () => {
    const myHeaders = new Headers({
        "Content-Type": "application/json"
    });
    const myApiKey = getKey();
    
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        // Fetch datasets from the server
        const datasetResponse = await fetch(`http://${myApiKey}:8000/api/data/`, requestOptions);
        const datasets = await datasetResponse.json();
        console.log(datasets);

        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; // Clear the container before adding new cards

        const groupedData = {};
        datasets.forEach(item => {
            const key = `${item.idSchema}-${item.idPolicy}`;
            if (!groupedData[key]) groupedData[key] = [];
            groupedData[key].push(item);
        });

        const outputData = Object.keys(groupedData).map(key => {
            const [idSchema, idPolicy] = key.split('-');
            const count = groupedData[key].length;
            const dataId = groupedData[key][0].id; // Assuming id is always present in the first element
            return {
                count,
                data: {
                    id: dataId,
                    idPolicy: groupedData[key][0].idPolicy,
                    idSchema: groupedData[key][0].idSchema,
                    idCategory: groupedData[key][0].idCategory,
                }
            };
        });

        // Iterate over each dataset and fetch related policy, schema, and category
        for (const item of outputData) {
            const { count, data: dataset } = item;
            console.log(`Count: ${count}, Data ID: ${dataset.id}`);

            const [policy, schema, category] = await Promise.all([
                fetch(`http://${myApiKey}:8000/api/policy/${dataset.idPolicy}/`, requestOptions).then(res => res.json()),
                fetch(`http://${myApiKey}:8000/api/schema/${dataset.idSchema}/`, requestOptions).then(res => res.json()),
                fetch(`http://${myApiKey}:8000/api/category/${dataset.idCategory}/`, requestOptions).then(res => res.json())
            ]);
            const cost = parseFloat(count) * parseFloat(policy.Value);
            // Build the card HTML with dataset information
            const nameSchema = schema.name.replace(/_/g, " ");
            const cardHtml = `
            <div class="col-md-6 mb-4 card-wrapper">
                <div class="card">
                    <div class="w-100 h-25 bg-secondary rounded-top d-flex justify-content-center text-light">
                        -
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${nameSchema}</h5>
                        <h6 class="card-subtitle mb-2 text-muted btn">${policy.name}</h6>
                        <p class="card-text">Category: ${category.category} <br> Expiration: <i class="expiration-date">${policy.estimatedTime}</i> <br> Count: ${count} <br> Cost: $${cost.toFixed(2)} </p>
                        <div class="d-flex justify-content-between">
                            <a href="/consumer/select_dataset/${dataset.id}" class="btn btn-danger">Select</a>
                        </div>
                    </div>
                </div>
            </div>`;
            cardContainer.innerHTML += cardHtml;
        }

        // Add event listeners to the new delete links
        document.querySelectorAll('.delete-dataset').forEach(link => {
            link.addEventListener('click', deleteDataset);
        });

        // Add event listeners for the search input and date filters
        document.getElementById('searchInput').addEventListener('input', filterDatasets);
        document.getElementById('startDate').addEventListener('input', filterDatasets);
        document.getElementById('endDate').addEventListener('input', filterDatasets);

    } catch (error) {
        // Optionally display an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> Failed to load data.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>`;
        alertContainer.innerHTML = alertHtml;
    }
};

// Load datasets when the page is fully loaded
window.addEventListener("load", async () => {
    await loadDatasets();
});
