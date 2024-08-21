// Function to get the ID from the current URL
function getIdFromUrl() {
    // Get the current URL
    var currentUrl = window.location.href;
    // Split the URL by '/'
    var urlParts = currentUrl.split('/');
    // Get the last segment of the URL
    var lastSegment = urlParts[urlParts.length - 1];
    console.log(lastSegment); // Log the ID for debugging
    return lastSegment;
}

// Function to handle form submission for signing
function submitSignForm(event) {
    event.preventDefault(); // Prevents the default form submission

    // Fetch access token from the cache
    fetch(`/accounts/get_cache/?key=access`, { method: 'GET' })
        .then(response => response.json())
        .then(async data => {
            if (data.value) {
                console.log(data.value); // Log access token for debugging

                // Fetch session ID from the cache
                const sessionResponse = await fetch(`/accounts/get_cache/?key=id_session`, { method: 'GET' });
                const sessionResult = await sessionResponse.json();
                console.log(sessionResult);

                // Fetch consumers and filter by session ID
                const consumersResponse = await fetch(`http://54.197.173.166:8000/api/consumers/`, { method: 'GET' });
                const consumers = await consumersResponse.json();
                const filteredConsumers = consumers.filter(item => item.idPerson === sessionResult.value);
                console.log(filteredConsumers[0].id);

                // Fetch data details
                const dataResponse = await fetch(`http://54.197.173.166:8000/api/data/${getIdFromUrl()}/`, { method: 'GET' });
                const dataResult = await dataResponse.json();
                console.log(dataResult.idSchema);

                // Fetch all datasets
                const datasetsResponse = await fetch('http://54.197.173.166:8000/api/data/', { method: 'GET' });
                const datasets = await datasetsResponse.json();
                console.log(datasets);

                // Filter datasets by schema ID
                const filteredData = datasets.filter(item => item.idSchema === dataResult.idSchema);
                const ids = filteredData.map(item => item.id);

                // Prepare request headers and body for signing
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Authorization", "Bearer " + data.value);
                const requestOptions = {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        "idConsumer": filteredConsumers[0].id,
                        "lstDataId": ids,
                        "idSchema": dataResult.idSchema
                    }),
                };
                console.log(requestOptions);

                // Send POST request to sign the datasets
                fetch("http://54.197.173.166:8000/sign/", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        console.log(result);
                        // Optionally redirect or show success message
                        // window.location.href = '/consumer/view_datasets';
                    })
                    .catch(error => console.error('POST Error:', error));
            } else {
                console.error('Token not found in response.');
            }
        })
        .catch(error => {
            console.error('GET Error:', error);
        });
}

// Event listener for form submission
document.getElementById('confirm_terms').addEventListener('click', submitSignForm);

// Function to load datasets and display them in cards
const loadDatasets = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const requestOptions = {
        method: "GET",
        headers: headers,
    };

    try {
        // Fetch all datasets
        const datasetResponse = await fetch('http://54.197.173.166:8000/api/data/', requestOptions);
        if (!datasetResponse.ok) throw new Error(`Error fetching datasets: ${datasetResponse.statusText}`);
        const datasets = await datasetResponse.json();
        console.log(datasets);

        // Fetch session ID
        const sessionResponse = await fetch(`/accounts/get_cache/?key=id_session`, { method: 'GET' });
        if (!sessionResponse.ok) throw new Error(`Error fetching session data: ${sessionResponse.statusText}`);
        const sessionResult = await sessionResponse.json();
        console.log(sessionResult);

        // Fetch consumers and filter by session ID
        const consumersResponse = await fetch(`http://54.197.173.166:8000/api/consumers/`, { method: 'GET' });
        if (!consumersResponse.ok) throw new Error(`Error fetching consumers: ${consumersResponse.statusText}`);
        const consumers = await consumersResponse.json();
        const filteredConsumers = consumers.filter(item => item.idPerson === sessionResult.value);
        if (filteredConsumers.length === 0) throw new Error('No consumers found for the given session');

        console.log(filteredConsumers[0].authorization);

        // Group datasets by authorization
        const groupedData = {};
        filteredConsumers[0].authorization.forEach(auth => {
            const authorizedDatasets = datasets.filter(item => {
                const itemId = item.id.toString();
                return auth.lstSignedData.map(id => id.toString()).includes(itemId);
            });
            authorizedDatasets.forEach(item => {
                const key = `${auth.carpet}`;
                if (!groupedData[key]) {
                    groupedData[key] = { auth, items: [] };
                }
                groupedData[key].items.push(item);
            });
        });

        // Prepare data for output
        const outputData = [];
        for (const key in groupedData) {
            const { auth, items } = groupedData[key];
            const count = items.length;
            const dataId = items[0].id;  // Assuming data.id is always present in the first element

            outputData.push({
                count,
                auth,
                data: {
                    id: dataId,
                    idPolicy: items[0].idPolicy,
                    idSchema: items[0].idSchema,
                    idCategory: items[0].idCategory,
                    format: items[0].format,
                    carpet: items[0].carpet
                }
            });
        }
        console.log(outputData);

        // Display data in cards
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; // Clear existing cards

        // Decode and filter data based on the URL
        const decodedDateTime = decodeURIComponent(getIdFromUrl());
        const filteredData = outputData.filter(item => item.auth.carpet === decodedDateTime);
        console.log(filteredData);

        // Generate HTML for each dataset
        for (const item of filteredData) {
            const count = item.count;
            const dataset = item.data;
            console.log(`Count: ${count}, Data ID: ${dataset.id}`);

            // Fetch category and policy details
            const policyResponse = await fetch(`http://54.197.173.166:8000/api/policy/${dataset.idPolicy}/`, requestOptions);
            const policy = await policyResponse.json();
            const schemaResponse = await fetch(`http://54.197.173.166:8000/api/schema/${dataset.idSchema}/`, requestOptions);
            const schema = await schemaResponse.json();
            const categoryResponse = await fetch(`http://54.197.173.166:8000/api/category/${dataset.idCategory}/`, requestOptions);
            const category = await categoryResponse.json();

            // Card HTML
            const cost = parseFloat(count) * parseFloat(policy.Value);
            const newName = schema.name.replace(/_/g, " ");
            const structure = schema.structure.replace(/\s/g, ", ");
            const cardHtml = `
                <div class="form-group id="cardContainerDatasets"">
                    <h3>${newName}</h3>
                    <div class="d-flex justify-content-between">
                        <p>
                            Count: ${count} <br>
                            Cost: $${cost.toFixed(2)} <br> 
                            Expiration ${policy.estimatedTime}
                        </p>
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
                                        <p id="item-format"><strong>Format: </strong>${dataset.format}</p>
                                    </div>
                                    <div class="col"> 
                                        <p id="item-idPolicy"><strong>Policy: </strong>${policy.name}</p>
                                        <button type="button" class="btn btn-sm btn-outline-danger ml-3" data-toggle="modal" data-target="#ModalPolicy">View policy selected</button>
                                    </div>
                                </div>
                                <div class="col"> 
                                    <p><strong>Columns</strong><br>${structure}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += cardHtml; // Add the card to the container

            // Prepare and display the modal content
            const modalPolicyContainer = document.getElementById('ModalPolicy');
            modalPolicyContainer.innerHTML = ''; // Clear existing modal content
            const modalHtml = `
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
                                <p>ID: ${policy.id}<br>
                                <strong>Summary</strong>
                                <hr>
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
            modalPolicyContainer.innerHTML += modalHtml; // Add the modal content
        }

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
        alertContainer.innerHTML = alertHtml;
    }
};

// Load datasets when the page is loaded
window.addEventListener("load", async () => {
    await loadDatasets();
});
