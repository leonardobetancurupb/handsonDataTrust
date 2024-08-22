
let myApiKey = "";
fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));


// Extracts the last segment of the current URL
function getIdFromUrl() {
    const url = window.location.href;
    const segments = url.split('/');
    return segments[segments.length - 1];
}

// Handles form submission to fetch and process data
function submitSignForm(event) {
    event.preventDefault(); // Prevents the default form submission

    fetch(`/accounts/get_cache/?key=access`, { method: 'GET' })
        .then(response => response.json())
        .then(async data => {
            if (data.value) {
                // Fetch session ID
                const sessionResponse = await fetch(`/accounts/get_cache/?key=id_session`, { method: 'GET' });
                const sessionData = await sessionResponse.json();

                // Fetch consumer data
                const consumerResponse = await fetch(`http://${myApiKey}:8000/api/consumers/`, { method: 'GET' });
                const consumers = await consumerResponse.json();
                const filteredConsumers = consumers.filter(item => item.idPerson === sessionData.value);

                // Fetch dataset details
                const datasetResponse = await fetch(`http://${myApiKey}:8000/api/data/${getIdFromUrl()}/`, { method: 'GET' });
                const dataset = await datasetResponse.json();

                // Fetch all datasets
                const allDatasetsResponse = await fetch(`http://${myApiKey}:8000/api/data/`, { method: 'GET' });
                const allDatasets = await allDatasetsResponse.json();

                // Filter datasets based on schema and policy
                const filteredData = allDatasets.filter(item => item.idSchema === dataset.idSchema && item.idPolicy === dataset.idPolicy);
                const ids = filteredData.map(item => item.id);

                // Prepare request headers and body
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Authorization", "Bearer " + data.value);

                const requestOptions = {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        idConsumer: filteredConsumers[0].id,
                        lstDataId: ids,
                        idSchema: dataset.idSchema,
                        idPolicy: dataset.idPolicy
                    })
                };

                // Submit the POST request
                fetch(`http://${myApiKey}:8000/sign/`, requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.error('POST Error:', error));
            } else {
                console.error('Token not found in response.');
            }
        })
        .catch(error => console.error('GET Error:', error));
}

// Attach event listener to the form submit button
document.getElementById('confirm_terms').addEventListener('click', submitSignForm);

// Loads datasets from the server and displays them in cards
const loadDatasets = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: headers
    };

    try {
        // Fetch datasets
        const response = await fetch(`http://${myApiKey}:8000/api/data/`, requestOptions);
        const datasets = await response.json();

        // Clear the card container
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = '';

        // Group datasets by schema and policy
        const groupedData = {};
        datasets.forEach(item => {
            const key = `${item.idSchema}-${item.idPolicy}`;
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(item);
        });

        const outputData = Object.keys(groupedData).map(key => {
            const [idSchema, idPolicy] = key.split('-');
            const count = groupedData[key].length;
            const data = groupedData[key][0];
            return {
                count,
                data: {
                    id: data.id,
                    idPolicy: data.idPolicy,
                    idSchema: data.idSchema,
                    idCategory: data.idCategory,
                    format: data.format
                }
            };
        });

        // Filter data based on the current URL
        const filteredData = outputData.filter(item => item.data.id === getIdFromUrl());

        for (const item of filteredData) {
            const { count, data } = item;

            // Fetch policy, schema, and category details
            const [policyResponse, schemaResponse, categoryResponse] = await Promise.all([
                fetch(`http://${myApiKey}:8000/api/policy/${data.idPolicy}/`, requestOptions),
                fetch(`http://${myApiKey}:8000/api/schema/${data.idSchema}/`, requestOptions),
                fetch(`http://${myApiKey}:8000/api/category/${data.idCategory}/`, requestOptions)
            ]);

            const [policy, schema, category] = await Promise.all([
                policyResponse.json(),
                schemaResponse.json(),
                categoryResponse.json()
            ]);

            const newName = schema.name.replace(/_/g, " ");
            const structure = schema.structure.replace(/\s/g, "; ");
            const cost = parseFloat(count) * parseFloat(policy.Value);
            // Generate HTML for dataset card
            const cardHtml = `
                <div class="form-group id="cardContainerDatasets"">
                    <h3>${newName}</h3>
                    <div class="d-flex justify-content-between">
                        <p>Count: ${count} <br>Expiration ${policy.estimatedTime} <br> Cost: $${cost.toFixed(2)}</p>
                        <div class="d-flex w-25 justify-content-end">
                            <div class="d-block mr-3">
                                <button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#ModalTerms">Create new Project from this Dataset</button>
                            </div>
                        </div>
                    </div>
                    <div class="container mt-2">
                        <div class="card">
                            <div class="card-header">
                                <h6 id="item-category">Category: ${category.category}</h6>
                            </div>
                            <div class="card-body">
                                <p id="item-description"><strong>Description: </strong>${schema.description}</p>
                                <div class="row">
                                    <div class="col">
                                        <p id="item-format"><strong>Format: </strong>${data.format}</p>
                                    </div>
                                    <div class="col">
                                        <p id="item-idPolicy"><strong>Policy: </strong>${policy.name}</p>
                                        <button type="button" class="btn btn-sm btn-outline-danger ml-3" data-toggle="modal" data-target="#ModalPolicy">View policy selected</button>
                                    </div>
                                    <div class="col">
                                        <p><strong>Columns</strong><br>${structure}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += cardHtml;

            const modalPolicyHtml = `
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content h-100">
                        <div class="modal-header">
                            <div>
                                <h4 class="modal-title">Information Policy</h4>
                                ${policy.name}
                            </div>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="home" class="container"><br>
                                <p>ID: ${policy.id}<br><strong>Summary</strong><hr>
                                <ul>
                                    <li><strong>Description</strong> ${policy.description}</li>
                                    <li><strong>Category</strong> ${category.category}</li>
                                    <li><strong>Expiration Time</strong> ${policy.estimatedTime}</li>
                                    <li><strong>Value</strong> $${policy.Value}</li>
                                </ul>
                                </p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('ModalPolicy').innerHTML = modalPolicyHtml;
        }
    } catch (error) {
        // Display error message to the user
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
