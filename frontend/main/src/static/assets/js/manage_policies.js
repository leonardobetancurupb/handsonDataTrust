
let myApiKey = "";
fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));


document.addEventListener("DOMContentLoaded", function() {
    fetchPolicies();
});
function fetchPolicies() {
    const myHeaders2 = new Headers();
    myHeaders2.append("Content-Type", "application/json");
    
    const requestOptions2 = {
        method: "GET",
        headers: myHeaders2,
    };
    fetch(`http://${myApiKey}:8000/api/category/`, requestOptions2)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('idCategory');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.category;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}
async function submitPolicyForm(event) {
    event.preventDefault(); 

    const form = event.target; // get form
    const formData = new FormData(form); 
    
    
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    try{
        // Fetch existing categories data using a GET request
        const response = await fetch(`http://${myApiKey}:8000/api/policy/`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching session data: ${response.statusText}`); // Better error message
        }
        const policies = await response.json();
        console.log(policies);
    
        // Check for duplicate category names
        let isUnique = true;
        for (const policy of policies) {
            if (policy.name === formData.get('policy')) {
                isUnique = false;
                break; // Stop iterating if a duplicate is found
            }
        }
    
        if (!isUnique) {
            throw new Error("Policy already exists."); // Duplicate category error
        }
    
        // Check if the category name is less than 4 characters or a duplicate
        if (formData.get('name').length < 4 || !isUnique) {
            throw new Error("More than 4 characters are expected."); // Length validation error
        }
    

    

    fetch(`/accounts/get_cache/?key=access`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.value) {
            console.log(data.value);

            // headers options
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + data.value);
            formDataObj['Value'] = parseFloat(formDataObj['Value'])
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(formDataObj),
            };
            
            // send request post
            fetch(`http://${myApiKey}:8000/api/policy/`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    window.location.href = '/administrator/policy';
                })
                .catch(error => console.error('POST Error:', error));
        } else {
            console.error('Token not found in response.');
        }
    })
    .catch(error => {
        console.error('GET Error:', error);
    });
} catch (error) {
    // Display error message to the user
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> Something went wrong: ${error}.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
}
}
// Event listener to send form
document.getElementById('policyForm').addEventListener('submit', submitPolicyForm);

