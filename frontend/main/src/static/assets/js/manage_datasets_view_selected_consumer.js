 // function to get id category
function getIdFromUrl() {
    var urlActual = window.location.href;
    var partesUrl = urlActual.split('/');
    var ultimoSegmento = partesUrl[partesUrl.length - 1];
    console.log(ultimoSegmento);
    return ultimoSegmento
}

function submitSignForm(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    fetch(`/accounts/get_cache/?key=access`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(async data => {
        if (data.value) {
            console.log(data);
            console.log(data.value);

            const postResponse = await fetch(`/accounts/get_cache/?key=id_session`, {
                method: 'GET'
            });
            const result = await postResponse.json();
            console.log(result);

            const get_id_data = await fetch(`http://54.197.173.166:8000/api/data/${getIdFromUrl()}/`, {
                method: 'GET'
            });
            const data_result = await get_id_data.json();
            console.log(data_result.idSchema);

            const datasetResponse = await fetch('http://54.197.173.166:8000/api/data/',  {
                method: 'GET'
            });
            const datasets = await datasetResponse.json();
            console.log(datasets);


            const filteredData = datasets.filter(item => item.idSchema === data_result.idSchema);
            const ids = filteredData.map(item => item.id);
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + data.value);
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    "idConsumer": result.value,
                    "lstDataId": ids,
                    "idSchema": data_result.idSchema
                }),
            };
            console.log(requestOptions);
            // Hacer la solicitud POST al servidor
            fetch("http://54.197.173.166:8000/sign/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    // window.location.href = '/consumer/view_datasets';
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
document.getElementById('confirm_terms').addEventListener('click', submitSignForm);




// Función para cargar las categorías desde el servidor y mostrarlas en tarjetas
const loadDatasets = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        // Hacer la solicitud GET al servidor para obtener las políticas
        const datasetResponse = await fetch('http://54.197.173.166:8000/api/data/', requestOptions);
        const datasets = await datasetResponse.json();
        console.log(datasets);

        // Limpiar el contenedor antes de agregar nuevas tarjetas
        const cardContainer = document.getElementById('cardContainerDatasets');
        cardContainer.innerHTML = ''; // Asegúrate de que esto esté ejecutándose correctamente

        const groupedData = {};
        for (const item of datasets) {
            const key = `${item.idSchema}-${item.idPolicy}`;
            if (!groupedData[key]) {
            groupedData[key] = [];
            }
            groupedData[key].push(item);
        }

        const outputData = [];
        for (const key in groupedData) {
            const [idSchema, idPolicy] = key.split('-');
            const count = groupedData[key].length;
            const dataId = groupedData[key][0].id;  // Assuming data.id is always present in the first element
            outputData.push({
            count,
            data: {
                id: dataId,
                idPolicy: groupedData[key][0].idPolicy,
                idSchema: groupedData[key][0].idSchema,
                idCategory: groupedData[key][0].idCategory,
                format: groupedData[key][0].format,
            }
            });
        }
        console.log(outputData);
        const filteredData = outputData.filter(item => item.data.id === getIdFromUrl());
        const ids = filteredData.map(item => item.id);
        console.log(filteredData);
        // Iterar sobre cada política y obtener la categoría correspondiente
        for (const item of filteredData) {
            const count = item.count;
            const dataset = item.data;
            console.log(item);
            console.log(`Count: ${count}, Data ID: ${dataset.id}`);
            // Obtener la categoría correspondiente
            const policyResponse = await fetch(`http://54.197.173.166:8000/api/policy/${dataset.idPolicy}/`, requestOptions);
            const policy = await policyResponse.json();
            const schemaResponse = await fetch(`http://54.197.173.166:8000/api/schema/${dataset.idSchema}/`, requestOptions);
            const schema = await schemaResponse.json();
            const categoryResponse = await fetch(`http://54.197.173.166:8000/api/category/${dataset.idCategory}/`, requestOptions);
            const category = await categoryResponse.json();
            // Construir el HTML de la tarjeta con la data
            name_schema = schema.name;
            new_name = name_schema.replace(/_/g, " ");
            list_schema = schema.structure;
            structure = list_schema.replace(/\s/g, "_");
            const cardHtml = `
                <div class="form-group id="cardContainerDatasets"">
                    <h3>
                    ${schema.name}
                    </h3>
                    <div class="d-flex justify-content-between">
                        <p>
                            Count: ${count} <br>
                            Expiration ${policy.expirationTime}
                        </p>
                        <div class=" d-flex w-25 justify-content-end">
                            <div class="d-block mr-3">
                                <button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#ModalTerms">Create new Project from this Dataset</button>
                            </div>
                        </div>
                    </div>
                    <div class="container mt-2 " >
                        <div class="card" >
                            <div class="card-header">
                                <h6 id="item-category">Category: ${category.category} </h6>
                            </div>
                            <div class="card-body">
                                <p id="item-description"><strong>Description: </strong>
                                    ${schema.description}    
                                </p>
                                <div class="row">
                                    <div class="col"> 
                                    <p id="item-format"><strong>Format: </strong>${dataset.format}</p>
                                    </div>
                                    <div class="col"> 
                                    <p id="item-idPolicy"><strong>Policy: </strong>${policy.name}</p>
                                    <button type="button" class="btn btn-sm btn-outline-danger ml-3" data-toggle="modal" data-target="#ModalPolicy">View policy selected</button>
                                </div>
                            </div>
                            <div class="col"> 
                                <p>
                                    ID: 1&nbsp;&nbsp;Since 06/07/2024 <br>
                                    <strong>
                                        Columns
                                    </strong>
                                    ${structure}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
            `;
            cardContainer.innerHTML += cardHtml; // Agregar la tarjeta al contenedor
        }



    } catch (error) {
        console.error('Error fetching datasets:', error);
    }
};


// Llamar a la función para cargar las categorías cuando la página se cargue
window.addEventListener("load", async () => {
    await loadDatasets();
});
