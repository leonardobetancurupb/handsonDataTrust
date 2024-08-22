const myApiKey ="";
fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));



function getIdFromUrl() {
    var urlActual = window.location.href;
    var partesUrl = urlActual.split('/');
    var ultimoSegmento = partesUrl[partesUrl.length - 2];
    return ultimoSegmento
}
    

async function loadCategoryOptions(selectedCategoryId) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const response = await fetch(`http://${myApiKey}:8000/category/`, requestOptions);
        const categories = await response.json();
        const categorySelect = document.getElementById('IdCategory');
        categorySelect.innerHTML = ''; 
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.category;
            categorySelect.appendChild(option);
           
            if (selectedCategoryId == category.id) {
                categorySelect.value = selectedCategoryId;
                categorySelect.textContent = category.category
            }
        });

    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadPolicyData() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const response = await fetch(`http://${myApiKey}:8000/api/policy/${id}/`, requestOptions);
        const data = await response.json();


        document.getElementById('name').value = data.name;
        document.getElementById('description').value = data.description;
        document.getElementById('estimatedTime').value = data.estimatedTime;
        document.getElementById('Value').value = data.Value;

    
        await loadCategoryOptions(data.IdCategory);

    } catch (error) {
        console.error('Error loading policy data:', error);
    }
}

window.addEventListener("load", loadPolicyData);

async function submitPolicyForm(event) {
    event.preventDefault(); // prevent default actions
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;
    const form = event.target; // get form
    const formData = new FormData(form); // create new form with data
    
    // FormData to Json format
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
                console.log(data);
                console.log(data.value);


                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer "+data.value);
                formDataObj['Value'] = parseFloat(formDataObj['Value'])
                const requestOptions = {
                    method: "PATCH",
                    headers: myHeaders,
                    body: JSON.stringify(formDataObj),
                };
            
                // request patch
                fetch(`http://${myApiKey}:8000/api/policy/${id}/`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        console.log(result); 
                        // reload categories
                        loadPolicyData();
                        window.location.href = '/administrator/policy';
                    })
                    .catch(error => console.error(error));
            } else {
                    console.error('Token not found in response.');
            }
        }).catch(error => {
            console.error('Failed to patch.');
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
};

document.getElementById('policyForm').addEventListener('submit', submitPolicyForm);
// delete validation function
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;

    fetch(`/accounts/get_cache/?key=access`, {
        method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.value) {
                console.log(data);
                console.log(data.value);


                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer "+data.value);
                
                const requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                };
    
                // delete request
                fetch(`http://${myApiKey}:8000/policy/${id}/`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                            console.log("Category deleted successfully.");
                            $('#confirmDeleteModal').modal('hide'); // modal
                            window.location.href = '/administrator/policy'; // reload window
                    })
                    .catch(error => console.error(error));
            } else {
                // Display error message to the user
                const alertContainer = document.getElementById('alertContainer');
                alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> Failed to delete data.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `;
                    }
        })
    .catch(error => {
        console.error('DELETE Error:', error);
    }); 
});

