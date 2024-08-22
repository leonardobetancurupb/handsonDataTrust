// Function to get key
async function getKey() {
    var Response = await fetch('/accounts/key/');
    var key_json = await Response.json();
    console.log(key_json.my_api_key);
    return key_json.my_api_key;
}

// Function to set a cache variable
function setCacheVariable(key_input, value_input) {
    const key = key_input;
    const value = value_input;
    
    console.log(`Setting cache: ${key} = ${value}`); // Log the cache setting
    
    fetch('/accounts/set_cache/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // CSRF token required for POST requests in Django
        },
        body: JSON.stringify({ key: key, value: value })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Log the server response message
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors
    });
}

// Function to get the CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to handle form submission for admin roles
async function AdminFormSubmit(person) {
    console.log(person);
    const idPerson = person; // ID of the person with admin role
    const myApiKey = await getKey();
    const data = {
        idPerson: idPerson,
    };

    console.log(JSON.stringify(data)); // Log the data being sent

    fetch(`http://${myApiKey}:8000/api/admin/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // CSRF token for security
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result); // Log the server response
        window.location.href = '/administrator/menu/'; // Redirect on success
    })
    .catch(error => console.error('Error:', error)); // Log any errors
}

// Function to handle form submission for holder roles
async function HolderFormSubmit(person) {
    console.log(person);
    const idPerson = person; // ID of the person with holder role
    const myApiKey = await getKey();
    const data = {
        idPerson: idPerson,
    };

    console.log(JSON.stringify(data)); // Log the data being sent

    fetch(`http://${myApiKey}:8000/api/holders/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // CSRF token for security
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result); // Log the server response
        window.location.href = '/holder/home/'; // Redirect on success
    })
    .catch(error => console.error('Error:', error)); // Log any errors
}

// Function to handle additional form submission for consumers
async function handleAdditionalFormSubmit(event, person) {
    event.preventDefault(); // Prevent default form submission
    console.log(person);
    const idPerson = person; // ID of the person with consumer role
    const company = document.getElementById('company').value;
    const nit = document.getElementById('nit').value;
    const myApiKey = await getKey();
    const data = {
        idPerson: idPerson,
        company: company,
        nit: nit
    };

    console.log(JSON.stringify(data)); // Log the data being sent

    fetch(`http://${myApiKey}:8000/api/consumers/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // CSRF token for security
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result); // Log the server response
        window.location.href = '/consumer/info/'; // Redirect on success
    })
    .catch(error => alert("Server doesn't respond.")); // Alert on error
}

// Function to handle registration form submission
async function submitRegisterPersonForm(event) {
    event.preventDefault(); // Prevent default form submission
    const myApiKey = await getKey();
    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create FormData object with form data
    
    // Convert FormData to a JSON object
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(JSON.stringify(formDataObj)); // Log the form data
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formDataObj),
    };

    // Send POST request to the server
    fetch(`http://${myApiKey}:8000/api/registers/`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (formDataObj['role'] === 'consumer') {
                document.getElementById('additionalForm').style.display = 'block';
                document.getElementById('btn_sign').style.display = 'none';
                document.getElementById('additionalForm').addEventListener('submit', function(event) {
                    handleAdditionalFormSubmit(event, result.id);
                });
            }
            if (formDataObj['role'] === 'holder') {
                HolderFormSubmit(result.id);
            } 
            if (formDataObj['role'] === 'admin') {
                AdminFormSubmit(result.id);
            } 
        })
        .catch(error => alert("Server doesn't respond.")); // Alert on error
}

// Event listener for registration form submission
const registerForm = document.getElementById('form-sign-in');
if (registerForm) {
    registerForm.addEventListener('submit', submitRegisterPersonForm);
}

// Function to handle login form submission
async function submitLoginPersonForm(event) {
    event.preventDefault(); // Prevent default form submission
    const myApiKey = await getKey();
    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create FormData object with form data
    
    // Convert FormData to a JSON object
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(JSON.stringify(formDataObj)); // Log the form data
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formDataObj),
    };
    
    // Send POST request to the server
    fetch(`http://${myApiKey}:8000/login/`, requestOptions)
        .then(response => response.json())
        .then(async result => {
            console.log(result); // Log the server response
            
            // Check if the response contains expected properties
            if (result && result.access && result.id) {
                console.log(result['id']);
                
                // Set cache variables
                setCacheVariable('access', result.access);
                setCacheVariable('id_session', result.id);
                
                // Fetch and verify the cache variables
                getCacheVariable('access');
                getCacheVariable('id_session');

                // Fetch person details
                const PersonResponse = await fetch(`http://${myApiKey}:8000/api/registers/${result.id}/`, {method: "GET"});
                const person = await PersonResponse.json();
                
                // Redirect based on the role of the person
                if (person.role === "admin"){
                    window.location.href = '/administrator/menu/';
                }
                if (person.role === "consumer"){
                    window.location.href = '/consumer/info/';
                }
                if (person.role === "holder"){
                    window.location.href = '/holder/home/';
                }
                
            } else {
                // Display error message to the user
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> Failed to login: ${result}.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
            }
            
        })
        .catch(error => alert("Server doesn't respond.")); // Alert on error
}

// Event listener for login form submission
const loginForm = document.getElementById('login_form');
if (loginForm) {
    loginForm.addEventListener('submit', submitLoginPersonForm);
}

// Function to get a cache variable
function getCacheVariable(key) {
    const variableName = key;

    fetch(`/accounts/get_cache/?key=${variableName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the cache data
    })
    .catch(error => {
        window.location.href = '/accounts/log-in'; // Redirect to login on error
    });
}
