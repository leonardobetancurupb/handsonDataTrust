function setCacheVariable(key_input, value_input) {
    const key = key_input;
    const value = value_input;
    
    console.log(`Setting cache: ${key} = ${value}`); // Log del valor
    
    fetch('/accounts/set_cache/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Necesario para las solicitudes POST en Django
        },
        body: JSON.stringify({ key: key, value: value })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function AdminFormSubmit(person) {
    console.log(person);
    const idPerson = person; // Id de la persona con rol de consumidor

    const data = {
        idPerson: idPerson,
    };

    console.log(JSON.stringify(data));

    // Aquí puedes enviar los datos al servidor usando fetch o alguna otra técnica
    // Ejemplo de uso de fetch para enviar los datos
    fetch('http://54.197.173.166:8000/api/admin/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Si necesitas enviar el CSRF token
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        // window.location.href = '/index';
        // Aquí puedes manejar la respuesta del servidor
    })
    .catch(error => console.error('Error:', error));
}


function HolderFormSubmit(person) {
    console.log(person);
    const idPerson = person; // Id de la persona con rol de consumidor

    const data = {
        idPerson: idPerson,
    };

    console.log(JSON.stringify(data));

    // Aquí puedes enviar los datos al servidor usando fetch o alguna otra técnica
    // Ejemplo de uso de fetch para enviar los datos
    fetch('http://54.197.173.166:8000/api/holders/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Si necesitas enviar el CSRF token
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        // window.location.href = '/index';
        // Aquí puedes manejar la respuesta del servidor
    })
    .catch(error => console.error('Error:', error));
}

function handleAdditionalFormSubmit(event, person) {
    event.preventDefault(); // Evitar el envío tradicional del formulario
    console.log(person);
    const idPerson = person; // Id de la persona con rol de consumidor
    const company = document.getElementById('company').value;
    const nit = document.getElementById('nit').value;

    const data = {
        idPerson: idPerson,
        company: company,
        nit: nit
    };

    console.log(JSON.stringify(data));

    // Aquí puedes enviar los datos al servidor usando fetch o alguna otra técnica
    // Ejemplo de uso de fetch para enviar los datos
    fetch('http://54.197.173.166:8000/api/consumers/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Si necesitas enviar el CSRF token
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        window.location.href = '/index';
        // Aquí puedes manejar la respuesta del servidor
    })
    .catch(error => console.error('Error:', error));
}

function submitRegisterPersonForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    
    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(JSON.stringify(formDataObj));
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formDataObj),
    };
    console.log(formDataObj)
    // Hacer la solicitud POST al servidor
    fetch("http://54.197.173.166:8000/api/registers/", requestOptions)
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
            window.location.href = '/accounts/log-in'
        })
        .catch(error => console.error(error));
}

// Event listener para el envío del formulario de registro
const registerForm = document.getElementById('form-sign-in');
if (registerForm) {
    registerForm.addEventListener('submit', submitRegisterPersonForm);
}






function submitLoginPersonForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    
    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(JSON.stringify(formDataObj));
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formDataObj),
    };
    
    // Hacer la solicitud POST al servidor
    fetch("http://54.197.173.166:8000/login/", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            
            // Verificar si result tiene las propiedades esperadas
            if (result && result.access && result.id) {
                console.log(result['id']);
                console.log(result.id);
                
                // Llamar a las funciones de cache
                setCacheVariable('access', result.access);
                setCacheVariable('id_session', result.id);
                
                // Obtener las variables de cache
                getCacheVariable('access');
                getCacheVariable('id_session');
                window.location.href = '../../';
            } else {
                console.error('Response does not contain expected properties:', result);
            }
            
        })
        .catch(error => console.error('Fetch error:', error));
}



// Event listener para el envío del formulario de inicio de sesión
const loginForm = document.getElementById('login_form');
if (loginForm) {
    loginForm.addEventListener('submit', submitLoginPersonForm);
}


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
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}