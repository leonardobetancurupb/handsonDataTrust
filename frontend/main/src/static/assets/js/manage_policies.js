
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
    fetch('http://54.197.173.166:8000/api/category/', requestOptions2)
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
function submitPolicyForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const form = event.target; // Obtiene el formulario
    const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
    
    // Convierte FormData a un objeto JSON
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    // Solicitud GET para obtener el token
    fetch(`/accounts/get_cache/?key=access`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.value) {
            console.log(data.value);

            // Configura los encabezados para la solicitud POST
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + data.value);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(formDataObj),
            };
            
            // Hacer la solicitud POST al servidor
            fetch("http://54.197.173.166:8000/api/policy/", requestOptions)
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
}
// Event listener para el envío del formulario
document.getElementById('policyForm').addEventListener('submit', submitPolicyForm);

