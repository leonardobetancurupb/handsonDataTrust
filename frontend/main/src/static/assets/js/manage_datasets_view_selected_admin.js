// Retrieves the dataset ID from the current URL
function getIdFromUrl() {
    const url = window.location.href;
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    console.log(lastSegment); // Logs the dataset ID
    return lastSegment;
}

let urlToDelete; // Stores the URL for deletion

// Handles click events to initiate dataset deletion
function deleteDataset(event) {
    event.preventDefault(); // Prevents the default link behavior
    console.log("Entering deleteDataset function");
    urlToDelete = event.currentTarget.getAttribute('data-url'); // Gets the URL from the clicked element

    // Show confirmation modal
    $('#confirmDeleteModal').modal('show');
}

// Confirms deletion of the dataset and performs the request
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: headers,
    };

    try {
        const response = await fetch(urlToDelete, requestOptions);
        if (response.ok) {
            console.log("Dataset deleted successfully.");
            $('#confirmDeleteModal').modal('hide'); // Hide confirmation modal
            loadDatasets(); // Reload datasets after deletion
        } else {
            console.error("Failed to delete dataset.");
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Loads and displays datasets from the server
const loadDatasets = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: headers,
    };

    try {
        // Fetch datasets from server
        const response = await fetch('http://127.0.0.1:8000/api/data/', requestOptions);
        const datasets = await response.json();
        console.log(datasets);

        // Clear the existing dataset cards
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = '';

        // Group datasets by schema and policy
        const groupedData = datasets.reduce((acc, item) => {
            const key = `${item.idSchema}-${item.idPolicy}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});

        // Prepare dataset output
        const outputData = Object.keys(groupedData).map(key => {
            const [idSchema, idPolicy] = key.split('-');
            const items = groupedData[key];
            const count = items.length;
            const firstItem = items[0];
            return {
                count,
                data: {
                    id: firstItem.id,
                    idPolicy: firstItem.idPolicy,
                    idSchema: firstItem.idSchema,
                    idCategory: firstItem.idCategory,
                    format: firstItem.format,
                }
            };
        });

        console.log(outputData);

        // Filter datasets based on the current URL
        const filteredData = outputData.filter(item => item.data.id === getIdFromUrl());
        console.log(filteredData);

        // Fetch and display dataset details
        for (const item of filteredData) {
            const { count, data } = item;

            // Fetch policy, schema, and category details
            const [policyResponse, schemaResponse, categoryResponse] = await Promise.all([
                fetch(`http://127.0.0.1:8000/api/policy/${data.idPolicy}/`, requestOptions),
                fetch(`http://127.0.0.1:8000/api/schema/${data.idSchema}/`, requestOptions),
                fetch(`http://127.0.0.1:8000/api/category/${data.idCategory}/`, requestOptions)
            ]);

            const [policy, schema, category] = await Promise.all([
                policyResponse.json(),
                schemaResponse.json(),
                categoryResponse.json()
            ]);

            // Format schema details for display
            const formattedName = schema.name.replace(/_/g, " ");
            const formattedStructure = schema.structure.replace(/\s/g, "; ");
            const cost = parseFloat(count) * parseFloat(policy.Value);

            // Generate HTML for dataset card
            const cardHtml = `
                <div class="form-group">
                    <h3>${formattedName}</h3>
                    <div class="d-flex justify-content-between">
                        <p>Count: ${count} <br>Expiration ${policy.estimatedTime}</p>
                    </div>
                    <div class="container mt-2">
                        <div class="card">
                            <div class="card-header">
                                <h6>Category: ${category.category}</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Description:</strong> ${schema.description} <br><b>Cost: ${cost.toFixed(2)}</b></p>
                                <div class="row">
                                    <div class="col"><p><strong>Format:</strong> ${data.format}</p></div>
                                    <div class="col">
                                        <p><strong>Policy:</strong> ${policy.name}</p>
                                        <button type="button" class="btn btn-sm btn-outline-primary ml-3" data-toggle="modal" data-target="#ModalPolicy">View policy selected</button>
                                    </div>
                                    <div class="col">
                                        <p><strong>Columns:</strong><br>${formattedStructure}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += cardHtml;

            // Update policy modal content
            const modalPolicyContainer = document.getElementById('ModalPolicy');
            const policyModalHtml = `
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content h-100">
                        <div class="modal-header">
                            <h4 class="modal-title">Information Policy</h4>
                            ${policy.name}
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="home" class="container"><br>
                                <p>ID: ${policy.id}<br><strong>Summary</strong><hr>
                                <ul>
                                    <li><strong>Description:</strong> ${policy.description}</li>
                                    <li><strong>Category:</strong> ${category.category}</li>
                                    <li><strong>Expiration Time:</strong> ${policy.estimatedTime}</li>
                                    <li><strong>Value:</strong> $${policy.Value}</li>
                                </ul></p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
            modalPolicyContainer.innerHTML = policyModalHtml;
        }

        // Add event listeners to new delete links
        document.querySelectorAll('.delete-dataset').forEach(link => {
            link.addEventListener('click', deleteDataset);
        });

    } catch (error) {
        // Display error message if fetching data fails
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

// Load datasets on page load
window.addEventListener("load", loadDatasets);
