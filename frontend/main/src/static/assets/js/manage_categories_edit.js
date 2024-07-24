
// function to get id category
function getIdFromUrl() {
    var urlActual = window.location.href;
    var partesUrl = urlActual.split('/');
    var ultimoSegmento = partesUrl[partesUrl.length - 2];
    console.log(ultimoSegmento);
    return ultimoSegmento
}

// function to load and set data form to update
function loadCategoryData() {
    const id = getIdFromUrl();
    console.log(id);
    if (!id) return;
    const myHeaders2 = new Headers();
    myHeaders2.append("Content-Type", "application/json");
    
    const requestOptions2 = {
        method: "GET",
        headers: myHeaders2,
    };
    fetch(`http://54.197.173.166:8000/api/category/${id}/`, requestOptions2)
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.category;
        })
        .catch(error => console.error('Error loading category data:', error));
}


function submitCategoryForm(event) {
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
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(formDataObj),
        };
    
    // request patch
    fetch(`http://54.197.173.166:8000/api/category/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result); 
            // reload categories
            loadCategoryData();
            window.location.href = '/administrator/category';
        })
        .catch(error => console.error(error));
    } else {
        console.error('Token not found in response.');
    }
})
.catch(error => {
    console.error('PATCH Error:', error);
});
}

// Event listener to send form
document.getElementById('categoryForm').addEventListener('submit', submitCategoryForm);

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
                fetch(`http://54.197.173.166:8000/category/${id}/`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        
                            console.log("Category deleted successfully.");
                            $('#confirmDeleteModal').modal('hide'); // modal
                            window.location.href = '/administrator/category'; // reload window
                       
                    })
                    .catch(error => console.error(error));
            } else {
                console.error('Token not found in response.');
            }
        })
    .catch(error => {
        console.error('DELETE Error:', error);
    }); 
});

// LOAD DATA ON WINDOWS RELOAD
document.addEventListener('DOMContentLoaded', loadCategoryData);
