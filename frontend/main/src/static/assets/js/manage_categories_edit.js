// Function to get the category ID from the URL
function getIdFromUrl() {
    var currentUrl = window.location.href; // Use a more descriptive variable name
    var urlParts = currentUrl.split('/'); // Use camelCase for variable names
    var lastSegment = urlParts[urlParts.length - 2]; // Last segment before the last slash
    console.log(lastSegment);
    return lastSegment;
}

// Function to load and set form data to update a category
function loadCategoryData() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return; // Exit if there's no ID

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    const requestOptions = {
        method: "GET",
        headers: headers,
    };

    fetch(`http://localhost:8000/api/category/${id}/`, requestOptions)
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.category; // Set the form field value
        })
        .catch(error => console.error('Error loading category data:', error)); // Improved error handling
}

async function submitCategoryForm(event) {
    event.preventDefault(); // Prevent default form submission
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create a FormData object
    
    // Convert FormData to JSON format
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    try {
        // Fetch existing categories data using a GET request
        const response = await fetch(`http://localhost:8000/api/category/`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Error fetching session data: ${response.statusText}`); // Better error message
        }
        const categories = await response.json();
        console.log(categories);
    
        // Check for duplicate category names
        let isUnique = true;
        for (const category of categories) {
            if (category.category === formData.get('category')) {
                isUnique = false;
                break; // Stop iterating if a duplicate is found
            }
        }
    
        if (!isUnique) {
            throw new Error("Category already exists."); // Duplicate category error
        }
    
        // Check if the category name is less than 4 characters or a duplicate
        if (formData.get('category').length < 4 || !isUnique) {
            throw new Error("More than 4 characters are expected."); // Length validation error
        }
    
        // Fetch session token and update the category
        const tokenResponse = await fetch(`/accounts/get_cache/?key=access`, { method: 'GET' });
        const tokenData = await tokenResponse.json();

        if (tokenData.value) {
            console.log(tokenData);
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + tokenData.value);
            
            const requestOptions = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(formDataObj),
            };
        
            // Send PATCH request to update the category
            const updateResponse = await fetch(`http://localhost:8000/api/category/${id}/`, requestOptions);
            const updateResult = await updateResponse.text();
            console.log(updateResult);

            loadCategoryData(); // Reload the category data
            window.location.href = '/administrator/category'; // Redirect to the category list
        } else {
            console.error('Token not found in response.'); // Error if token is not found
        }
    } catch (error) { // Handle errors thrown during validation or token fetch
        // Optionally display an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> ${error.message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml; // Inject alert HTML into the page
    }
}

// Event listener to handle form submission
document.getElementById('categoryForm').addEventListener('submit', submitCategoryForm);

// Function to delete a category
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;

    fetch(`/accounts/get_cache/?key=access`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.value) {
                console.log(data);

                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Authorization", "Bearer " + data.value);
                
                const requestOptions = {
                    method: "DELETE",
                    headers: headers,
                };
    
                // Send DELETE request to remove the category
                fetch(`http://localhost:8000/category/${id}/`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        console.log("Category deleted successfully.");
                        $('#confirmDeleteModal').modal('hide'); // Hide the modal
                        window.location.href = '/administrator/category'; // Redirect to the category list
                    })
                    .catch(error => console.error(error)); // Handle delete errors
            } else {
                console.error('Token not found in response.');
            }
        })
    .catch(error => {
        console.error('DELETE Error:', error); // Handle fetch errors
        // Optionally display an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> Failed on delete data, try again or reload this page.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml; // Inject alert HTML into the page
    }); 
});

// Load category data when the page is fully loaded
document.addEventListener('DOMContentLoaded', loadCategoryData);
