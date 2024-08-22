async function submitCategoryForm(event) {
    // Prevents the default form submission behavior
    event.preventDefault();
    const form = event.target; // Obtains the submitted form
    const formData = new FormData(form); // Creates a FormData object from the form data
    // Try validating the category and fetching the token
    try {
        // Fetches existing categories data using GET request
        const postResponse = await fetch(`http://127.0.0.1:8000/api/category/`, { method: 'GET' });
        if (!postResponse.ok) {
            throw new Error(`Error fetching session data: ${postResponse.statusText}`);
        }
        const result = await postResponse.json();
        console.log(result);
    
        // Checks for duplicate category names
        let unique_field = true;
        for (const item of result) {
            if (item.category === formData.get('category')) {
            unique_field = false;
            break; // Stops iterating if a duplicate is found
            }
        }
    
        if (!unique_field) {
            throw new Error("Category already exists.");
        }
    
        // Checks if category length is less than 4 or a duplicate
        if (formData.get('category').length < 4 || !unique_field) {
            throw new Error("More than 4 characters are expected.");
        }
    
        // Fetches the token using a separate GET request
        fetch(`/accounts/get_cache/?key=access`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.value) {
            console.log(data);
            console.log(data.value);
    
            // Prepares headers for the POST request to create a category
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + data.value);
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(formDataObj),
            };
    
            // Sends the POST request to create the category
            fetch("http://127.0.0.1:8000/api/category/", requestOptions)
                .then(response => response.text())
                .then(result => {
                console.log(result);
                window.location.href = '/administrator/category';
                })
                .catch(error => console.error('POST Error:', error));
            } else {
            console.error('Token not found in response.');
            }
        })
        .catch(error => console.error('Error obtaining token:', error));
    } catch (error) { // Catches errors thrown during validation or token fetch
        // Optionally displays an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> ${error.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml;
    }
}
// Attaches the submitCategoryForm function as an event listener to the form submission event
document.getElementById('categoryForm').addEventListener('submit', submitCategoryForm);