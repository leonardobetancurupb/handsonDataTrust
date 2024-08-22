// Function to get key
async function getKey() {
    var Response = await fetch('/accounts/key/');
    var key_json = await Response.json();
    console.log(key_json.my_api_key);
    return key_json.my_api_key;
}


const formData = new FormData();
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



let select_value_schema;
document.getElementById('idSchema').addEventListener('change', async function() {
    var select = document.getElementById('idSchema');
    var button = document.getElementById('viewSchemaBtn');
    const buttonExport = document.getElementById('form_dataset_create');
    select_value_schema = select.value;
    console.log(select_value_schema);

    const myApiKey = await getKey();
    if (select.value) {
        button.disabled = false;
        const schemaResponse = await fetch(`http://${myApiKey}:8000/api/schema/${select.value}/`);
        const schema = await schemaResponse.json();

        // Update modals
        const newName = schema.name.replace(/_/g, " ");
        const structure = schema.structure.replace(/\s/g, ", ");
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
        buttonExport.innerHTML+= `
                        <form  class="h-15 d-flex justify-content-center" id="ExportFileform" action="http://54.197.173.166:8000/downloadSchema/${select_value_schema}/" method="post" enctype="multipart/form-data">
                            <input id="ExportSchema" type="submit" class="btn btn-secondary h-50" value="Download Schema">
                        </form>`;
    } else {
        button.disabled = true; 

    }
});
document.getElementById('idPolicy').addEventListener('change', async function() {
    var select = document.getElementById('idPolicy');
    const myApiKey = await getKey();
    var button = document.getElementById('viewPolicyBtn');
    if (select.value) {
        button.disabled = false; 
        const policyResponse = await fetch(`http://${myApiKey}:8000/api/policy/${select.value}/`);
        const policy = await policyResponse.json();
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
        
    } else {
        button.disabled = true; 
    }
});

async function fetchDatasets() {
    const myHeaders2 = new Headers();
    myHeaders2.append("Content-Type", "application/json");
    const myApiKey = await getKey();
    const requestOptions2 = {
        method: "GET",
        headers: myHeaders2,
    };

    var select = document.getElementById('idSchema');
    select_value_schema = select.value;
    try{

    
    fetch(`http://${myApiKey}:8000/schema/`, requestOptions2)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('idSchema');
            data.forEach(schema => {
                const option = document.createElement('option');
                option.value = schema.id;
                option.textContent = schema.description;
                select.appendChild(option);
                
                
            });

        })
        .catch(error => console.error('Error fetching schemas:', error));
        fetch(`http://${myApiKey}:8000/policy/`, requestOptions2)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('idPolicy');
            data.forEach(policy => {
                const option = document.createElement('option');
                option.value = policy.id;
                option.textContent = policy.name;
                select.appendChild(option);

                
                    
                
                
            });
            
        })
        .catch(error => console.error('Error fetching policies:', error));
        fetch(`http://${myApiKey}:8000/category/`, requestOptions2)
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
        
        
}




function updateFileName() {
    var input = document.getElementById('fileInput');
    var label = input.nextElementSibling; // El elemento <label> sigue al <input> en el DOM
    var fileName = input.files.length > 0 ? input.files[0].name : 'Choose File';
    label.textContent = fileName;
}

document.addEventListener("DOMContentLoaded", function() {
    fetchDatasets();
});


const fileInput = document.getElementById('fileInput'); 
const submitBtn = document.getElementById('submitBtn');
fileInput.addEventListener('change', handleFileChange);
    function handleFileChange() {  
        formData.append('archivo', fileInput.files[0]); 
        formData.append('idCategory', document.getElementsByName('idCategory')[0].value); 
        formData.append('format', document.getElementsByName('format')[0].value); 
        formData.append('idSchema', document.getElementsByName('idSchema')[0].value);
        formData.append('idPolicy', document.getElementsByName('idPolicy')[0].value); 
        submitBtn.disabled = false; // Enable submit button after file selection 
        console.log("confirmación");
        console.log(fileInput.files[0]);
    } 



document.getElementById('viewSchemaBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    $('#myModal').modal('show'); // Show the modal
});

document.getElementById('viewPolicyBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    $('#ModalPolicy').modal('show'); // Show the modal
});