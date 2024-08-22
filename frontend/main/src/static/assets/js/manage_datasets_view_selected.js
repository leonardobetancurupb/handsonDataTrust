// Extracts the last segment of the current URL
function getIdFromUrl() {
    const urlParts = window.location.href.split('/');
    const lastSegment = urlParts[urlParts.length - 1];
    console.log(lastSegment);
    return lastSegment;
}

let urlToDelete;

// Handles the dataset deletion process
function deleteDataset(event) {
    event.preventDefault();
    console.log("Entered deleteDataset function");
    urlToDelete = event.currentTarget.getAttribute('data-url');
    $('#confirmDeleteModal').modal('show'); // Show the confirmation modal
}

// Finds consumer IDs based on schema name and policy ID
function findConsumerIds(data, nameSchema, idPolicy) {
    const consumerIds = [];
    const authorization = data.authorization;

    authorization.forEach(authItem => {
        const consumerId = Object.keys(authItem)[0];
        if (authItem[consumerId] === nameSchema && authItem.idPolicy === idPolicy) {
            consumerIds.push(consumerId);
        }
    });

    return consumerIds;
}

// Deletes a dataset and updates the UI
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch(urlToDelete, { method: "POST", headers: myHeaders })
        .then(response => {
            if (response.ok) {
                console.log("Dataset deleted successfully.");
                $('#confirmDeleteModal').modal('hide'); // Hide the confirmation modal
                loadDatasets(); // Reload datasets
            } else {
                console.error("Failed to delete dataset.");
            }
        })
        .catch(error => console.error('Error:', error));
});

// Loads and displays datasets
const loadDatasets = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
        // Fetch session data
        const sessionResponse = await fetch(`/accounts/get_cache/?key=id_session`);
        if (!sessionResponse.ok) throw new Error(`Error fetching session data: ${sessionResponse.statusText}`);
        const sessionData = await sessionResponse.json();
        
        // Fetch holders
        const holdersResponse = await fetch(`http://localhost:8000/api/holders/`);
        if (!holdersResponse.ok) throw new Error(`Error fetching holders: ${holdersResponse.statusText}`);
        const holders = await holdersResponse.json();
        const filteredHolders = holders.filter(item => item.idPerson === sessionData.value);
        if (filteredHolders.length === 0) throw new Error('No holders found for the session');
        
        // Fetch dataset
        const datasetResponse = await fetch(`http://localhost:8000/api/data/${getIdFromUrl()}`);
        const dataset = await datasetResponse.json();

        // Clear and update card container
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; 

        const policyResponse = await fetch(`http://localhost:8000/api/policy/${dataset.idPolicy}/`);
        const policy = await policyResponse.json();
        const schemaResponse = await fetch(`http://localhost:8000/api/schema/${dataset.idSchema}/`);
        const schema = await schemaResponse.json();
        const categoryResponse = await fetch(`http://localhost:8000/api/category/${dataset.idSchema}/`);
        const category = await categoryResponse.json();
        
        const newName = schema.name.replace(/_/g, " ");
        const structure = schema.structure.replace(/\s/g, ", ");
        
        const cardHtml = `
            <h3>${newName}</h3>
            <div class="d-flex justify-content-between">
                <p>ID: ${dataset.id}<br>Expiration ${policy.estimatedTime}</p>
                <div class="d-flex w-25 justify-content-end h-75">
                    <div class="d-block mr-3">
                        <a href="../edit_datasets/${dataset.id}" class="text-success">
                            <img src='/static/assets/img/edit.png' alt="">
                            <p class="ml-1">Edit</p>
                        </a>
                    </div>
                    <div class="d-block mr-3">
                        <a href="#" class="delete-dataset text-success" data-url="http://localhost:8000/api/data/${dataset.id}/">
                            <img src='/static/assets/img/delete.png' alt="">
                            <p class="">Delete</p>
                        </a>
                    </div>
                </div>
            </div>
            <div class="card" id="card_info">
                <div class="card-header">
                    <h4 id="item-category">Category: ${category.category}</h4>
                </div>
                <div class="card-body">
                    <p id="item-description"><strong>Description:</strong> ${schema.description}</p>
                    <div class="row">
                        <div class="col">
                            <p id="item-format"><strong>Format:</strong> ${dataset.format}</p>
                        </div>
                        <div class="col">
                            <p id="item-idPolicy"><strong>Policy:</strong> ${policy.name}</p>
                            <button type="button" class="btn btn-sm btn-outline-success ml-3" data-toggle="modal" data-target="#ModalPolicy">View policy</button>
                        </div>
                        <div class="col">
                            <p id="item-schema"><strong>Schema:</strong> ${schema.name}</p>
                            <button type="button" class="btn btn-sm btn-outline-success ml-3" data-toggle="modal" data-target="#myModal">View schema</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHtml;

        // Update table with consumer data
        const tableContainer = document.getElementById('tabledata');
        tableContainer.innerHTML = '';
        
        const consumerIds = findConsumerIds(filteredHolders[0], schema.name, policy.id);
        if (consumerIds.length < 1) {
            tableContainer.innerHTML = `<tr><td colspan="4">No consumers found.</td></tr>`;
        } else {
            for (const id of consumerIds) {
                const consumerResponse = await fetch(`http://localhost:8000/api/consumers/${id}/`);
                if (!consumerResponse.ok) throw new Error(`Error fetching consumer: ${consumerResponse.statusText}`);
                const consumer = await consumerResponse.json();
                tableContainer.innerHTML += `
                    <tr>
                        <td>${consumer.id}</td>
                        <td>${consumer.company}</td>
                        <td>${consumer.nit}</td>
                    </tr>
                `;
            }
        }

        // Update modals
        const modalSchemaContainer = document.getElementById('myModal');
        modalSchemaContainer.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content h-100">
                    <div class="modal-header">
                        <div>
                            <h4 class="modal-title">Information Schema</h4>
                            ${newName}
                        </div>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="home" class="container"><br>
                            <p>ID: ${schema.id}<br><strong>Summary</strong><hr>
                            <ul>
                                <li><strong>Description</strong> ${schema.description}</li>
                                <li><strong>Columns</strong> ${structure}</li>
                                <li><strong>Encrypted columns</strong> ${schema.fieldToEncrypt}</li>
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

        const modalPolicyContainer = document.getElementById('ModalPolicy');
        modalPolicyContainer.innerHTML = `
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

        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-dataset').forEach(link => {
            link.addEventListener('click', deleteDataset);
        });

    } catch (error) {
        // Display error message to the user
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> Failed to load data.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
    }
};

// Load datasets on page load
window.addEventListener("load", loadDatasets);
