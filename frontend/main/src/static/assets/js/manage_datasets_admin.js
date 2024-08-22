let myApiKey = "";
fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));



// Function to get the category ID from the URL
function getIdFromUrl() {
    var currentUrl = window.location.href; // Use a more descriptive variable name
    var urlParts = currentUrl.split('/'); // Use camelCase for variable names
    var lastSegment = urlParts[urlParts.length - 2]; // Last segment before the last slash
    console.log(lastSegment);
    return lastSegment;
}

// Function to filter datasets
function filterDatasets() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const cards = document.querySelectorAll('.card-wrapper'); // Get all card elements

    cards.forEach(card => {
        const cardTitle = card.querySelector('.card-title').innerText.toLowerCase(); // Convert title to lowercase
        const expirationDate = card.querySelector('.expiration-date').innerText; 
        let isTitleMatch = cardTitle.includes(searchInput); // Check if title matches search input
        let isDateInRange = true; // Assume date is in range unless proven otherwise

        if (startDate || endDate) {
            const expirationTime = new Date(expirationDate).getTime();
            const start = startDate ? new Date(startDate).getTime() : null;
            const end = endDate ? new Date(endDate).getTime() : null;

            if (start && end) {
                isDateInRange = expirationTime >= start && expirationTime <= end; // Check if date is within the range
            } else if (start) {
                isDateInRange = expirationTime >= start; // Check if date is after the start date
            } else if (end) {
                isDateInRange = expirationTime <= end; // Check if date is before the end date
            }
        }

        if (isTitleMatch && isDateInRange) {
            card.style.display = ''; // Show the card if it matches the search and date range
        } else {
            card.style.display = 'none'; // Hide the card if it doesn't match
        }
    });
}

let urlToDelete; // Variable to store the deletion URL

function deleteDataset(event) {
    event.preventDefault(); // Prevent the default behavior of the link
    console.log("Entered the deleteDataset function");
    urlToDelete = event.currentTarget.getAttribute('data-url'); // Get the URL from the link's data attribute

    // Show the confirmation modal
    $('#confirmDeleteModal').modal('show');
}

// Function to confirm the deletion
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: headers,
    };

    fetch(urlToDelete, requestOptions)
        .then(response => {
            if (response.ok) {
                console.log("Dataset deleted successfully.");
                // Navigate to another page or reload the category list
                $('#confirmDeleteModal').modal('hide'); // Hide the confirmation modal
                loadDatasets(); // Reload the datasets after deletion
            } else {
                console.error("Failed to delete dataset.");
            }
        })
        .catch(error => {
                    // Optionally displays an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> Failed to delete data. try again or reload this page.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml;
        }); // Improved error handling
});

// Function to load datasets from the server and display them in cards
const loadDatasets = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: headers,
    };

    try {
        // Make a GET request to the server to get the datasets
        const datasetResponse = await fetch(`http://${myApiKey}:8000/api/data/`, requestOptions);
        const datasets = await datasetResponse.json();
        console.log(datasets);
        
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; // Ensure this is running correctly

        const groupedData = {};
        for (const item of datasets) {
            const key = `${item.idSchema}-${item.idPolicy}`;
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(item); // Group datasets by schema and policy IDs
        }

        const outputData = [];
        for (const key in groupedData) {
            const [idSchema, idPolicy] = key.split('-');
            const count = groupedData[key].length;
            const dataId = groupedData[key][0].id;  // Assuming data.id is always present in the first element
            outputData.push({
                count,
                data: {
                    id: dataId,
                    idPolicy: groupedData[key][0].idPolicy,
                    idSchema: groupedData[key][0].idSchema,
                    idCategory: groupedData[key][0].idCategory,
                }
            });
        }

        // Iterate over each dataset and get the corresponding category
        for (const item of outputData) {
            const count = item.count;
            const dataset = item.data;
            console.log(`Count: ${count}, Data ID: ${dataset.id}`);

            // Get the corresponding category
            const policyResponse = await fetch(`http://${myApiKey}:8000/api/policy/${dataset.idPolicy}/`, requestOptions);
            const policy = await policyResponse.json();
            const schemaResponse = await fetch(`http://${myApiKey}:8000/api/schema/${dataset.idSchema}/`, requestOptions);
            const schema = await schemaResponse.json();
            const categoryResponse = await fetch(`http://${myApiKey}:8000/api/category/${dataset.idCategory}/`, requestOptions);
            const category = await categoryResponse.json();

            // Build the HTML for the card with the dataset information
            const schemaName = schema.name.replace(/_/g, " ");
            const cost = parseFloat(count) * parseFloat(policy.Value);

            const cardHtml = `
            <div class="col-md-6 mb-4 card-wrapper">
                <div class="card">
                    <div class="w-100 h-25 bg-secondary rounded-top d-flex justify-content-center text-light">
                        -
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${schemaName}</h5>
                        <h6 class="card-subtitle mb-2 text-muted btn">${policy.name}</h6>
                        <p class="card-text">Category: ${category.category} <br> Expiration: <i class="expiration-date">${policy.estimatedTime}</i> <br> Count: ${count} <br>Cost: $${cost.toFixed(2)} </p>
                        <div class="d-flex justify-content-between">
                            <a href="/administrator/data_selected/${dataset.id}" class="btn btn-primary">Select</a>
                        </div>
                    </div>
                </div>
            </div>
            `;
            cardContainer.innerHTML += cardHtml; // Add the card to the container
        }

        // Add event listeners to the new delete links
        document.querySelectorAll('.delete-dataset').forEach(link => {
            link.addEventListener('click', deleteDataset);
        });

        // Add event listeners for the search and date input fields
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
            </div>
        `;
        alertContainer.innerHTML = alertHtml; // Inject alert HTML into the page
    }
};

// Call the function to load datasets when the page loads
window.addEventListener("load", async () => {
    await loadDatasets();
});
