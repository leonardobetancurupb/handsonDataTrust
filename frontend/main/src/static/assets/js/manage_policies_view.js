
let myApiKey = "";
fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));


// Function to filter policies based on search input and date range
function filterPolicies() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const cards = document.querySelectorAll('.card-wrapper');

    cards.forEach(card => {
        const cardTitle = card.querySelector('.card-title').innerText.toLowerCase();
        const expirationDate = card.querySelector('.expiration-date').innerText;
        let isTitleMatch = cardTitle.includes(searchInput);
        let isDateInRange = true;

        // Check if the date range filters are applied
        if (startDate || endDate) {
            const expirationTime = new Date(expirationDate).getTime();
            const start = startDate ? new Date(startDate).getTime() : null;
            const end = endDate ? new Date(endDate).getTime() : null;
            
            // Determine if the expiration date falls within the specified range
            if (start && end) {
                isDateInRange = expirationTime >= start && expirationTime <= end;
            } else if (start) {
                isDateInRange = expirationTime >= start;
            } else if (end) {
                isDateInRange = expirationTime <= end;
            }
        }

        // Show or hide the card based on filters
        card.style.display = (isTitleMatch && isDateInRange) ? '' : 'none';
    });
}

let urlToDelete; 

// Function to prepare for policy deletion
function deletePolicy(event) {
    event.preventDefault(); // Prevent default actions
    console.log("Entered deletePolicy function");
    urlToDelete = event.currentTarget.getAttribute('data-url'); // Get URL to delete
    $('#confirmDeleteModal').modal('show'); // Show confirmation modal
}

// Function to handle policy deletion upon confirmation
document.getElementById('confirmDeleteButton').addEventListener('click', async function() {
    try {
        // Fetch access token from cache
        const response = await fetch(`/accounts/get_cache/?key=access`, { method: 'GET' });
        const data = await response.json();
        
        if (data.value) {
            console.log(data);
            console.log(data.value);
            
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${data.value}`);
            
            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
            };
            
            // Send delete request
            const deleteResponse = await fetch(urlToDelete, requestOptions);
            const result = await deleteResponse.text();
            console.log("Policy deleted successfully.");
            $('#confirmDeleteModal').modal('hide'); // Hide the modal
            loadPolicies(); // Reload policies
        } else {
            console.error('Token not found in response.');
        }
    } catch (error) {
        console.error('DELETE Error:', error); // Log any errors
    }
});

// Function to load policies from the server and display them as cards
const loadPolicies = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        // Fetch policies from the server
        const policyResponse = await fetch(`http://${myApiKey}:8000/api/policy/`, requestOptions);
        const policies = await policyResponse.json();
        console.log(policies);

        // Clear the container before adding new cards
        const cardContainer = document.getElementById('cardContainerPolicies');
        cardContainer.innerHTML = '';

        // Iterate over each policy and fetch the corresponding category
        for (const policy of policies) {
            const categoryResponse = await fetch(`http://${myApiKey}:8000/api/category/${policy.idCategory}/`, requestOptions);
            const category = await categoryResponse.json();

            // Build the HTML for the card
            const cardHtml = `
                <div class="col-md-6 mb-4 card-wrapper">
                    <div class="card border border-secondary">
                        <div class="card-body">
                            <h5 class="card-title"><strong class="btn btn-secondary mr-3" disabled>${policy.id}</strong>${policy.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${category.category}</h6> 
                            <p class="card-text">
                                <ul>
                                    <li>
                                        <strong>Expiration:</strong> <span class="expiration-date">${policy.estimatedTime}</span>
                                    </li>
                                    <li>
                                        <strong>Value:</strong> $${policy.Value}
                                    </li>
                                </ul>
                            </p>
                            <div class="d-flex justify-content-end">
                                <a href='../edit_policy/${policy.id}/' class="btn btn-light btn-sm border border-secondary mr-3 h-25">
                                    <img src='/static/assets/img/edit.png' class="table-icon" alt="">
                                    Edit
                                </a>
                                <a href="#" data-url="http://${myApiKey}:8000/api/policy/${policy.id}/" class="btn btn-light btn-sm border border-secondary mr-3 h-25 delete-policy">
                                    <img src='/static/assets/img/delete.png' class="table-icon" alt="">
                                    Delete
                                </a>                                    
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.innerHTML += cardHtml; // Append the card to the container
        }

        // Add event listeners to the newly added delete buttons
        document.querySelectorAll('.delete-policy').forEach(link => {
            link.addEventListener('click', deletePolicy);
        });

        // Add event listeners for search and date fields
        document.getElementById('searchInput').addEventListener('input', filterPolicies);
        document.getElementById('startDate').addEventListener('input', filterPolicies);
        document.getElementById('endDate').addEventListener('input', filterPolicies);

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

// Load policies when the page loads
window.addEventListener("load", async () => {
    await loadPolicies();
});
