let myApiKey = "";

fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));


const loadDatasets = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {
        const datasetResponse = await fetch(`http://${myApiKey}:8000/api/data/`, requestOptions);
        if (!datasetResponse.ok) throw new Error(`Error fetching datasets: ${datasetResponse.statusText}`);
        const datasets = await datasetResponse.json();

        const postResponse = await fetch(`/accounts/get_cache/?key=id_session`, { method: 'GET' });
        if (!postResponse.ok) throw new Error(`Error fetching session data: ${postResponse.statusText}`);
        const result = await postResponse.json();
        console.log(result);

        const getConsumerResponse = await fetch(`http://${myApiKey}:8000/api/consumers/`, { method: 'GET' });
        if (!getConsumerResponse.ok) throw new Error(`Error fetching consumers: ${getConsumerResponse.statusText}`);
        const resultConsumer = await getConsumerResponse.json();
        const filteredConsumers = resultConsumer.filter(item => item.idPerson === result.value);
        if (filteredConsumers.length === 0) throw new Error('No consumers found for the given session');


        const groupedData = {};

        filteredConsumers[0].authorization.forEach(auth => {
            const authorizedDatasets = datasets.filter(item => {
                const itemId = item.id.toString();
                const includes = auth.lstSignedData.map(id => id.toString()).includes(itemId);
                return includes;
            });

            authorizedDatasets.forEach(item => {
                const key = `${auth.carpet}`;
                if (!groupedData[key]) {
                    groupedData[key] = {
                        auth,
                        items: []
                    };
                }
                groupedData[key].items.push(item);

            });
        });

        const outputData = [];
        for (const key in groupedData) {
            const { auth, items } = groupedData[key];
            const count = items.length;
            const dataId = items[0].id;  

            outputData.push({
                count,
                auth,
                data: {
                    id: dataId,
                    idPolicy: items[0].idPolicy,
                    idSchema: items[0].idSchema,
                    idCategory: items[0].idCategory,
                    format: items[0].format,
                    carpet: items[0].carpet
                }
            });
        }

        const tableContainer = document.getElementById('tableProjectsConsumers');
        tableContainer.innerHTML = '';

        const rowHtmls = [];
        for (const item of outputData) {
            const count = item.count;
            const dataset = item.data;
            const auth = item.auth;

            const policyResponse = await fetch(`http://${myApiKey}:8000/api/policy/${dataset.idPolicy}/`, requestOptions);
            if (!policyResponse.ok) throw new Error(`Error fetching policy: ${policyResponse.statusText}`);
            const policy = await policyResponse.json();

            const schemaResponse = await fetch(`http://${myApiKey}:8000/api/schema/${dataset.idSchema}/`, requestOptions);
            if (!schemaResponse.ok) throw new Error(`Error fetching schema: ${schemaResponse.statusText}`);
            const schema = await schemaResponse.json();

            const categoryResponse = await fetch(`http://${myApiKey}:8000/api/category/${dataset.idCategory}/`, requestOptions);
            if (!categoryResponse.ok) throw new Error(`Error fetching category: ${categoryResponse.statusText}`);
            const category = await categoryResponse.json();

            const nameSchema = schema.name;
            const newName = nameSchema.replace(/_/g, " ");
            const listSchema = schema.structure;
            const structure = listSchema.replace(/\s/g, "; ");
            const cost = parseFloat(count) * parseFloat(policy.Value);


            const rowHtml = `
                <tr>
                    <td>${dataset.id}</td>
                    <td><b class="name-project">${newName}</b></td>
                    <td>${policy.name}</td>
                    <td><i class="expiration-date">${policy.estimatedTime}</i></td>
                    <td>${cost.toFixed(2)}</td>
                </tr>
            `;
            
            rowHtmls.push(rowHtml);
        }
        if( outputData.length<1){
            const rowHtml = `
                <tr>
                    <td colspan="7">No projects found.</td>
                </tr>
            `;
            
            rowHtmls.push(rowHtml);
        }

        tableContainer.innerHTML = rowHtmls.join(''); 

    } catch (error) {
        // Optionally displays an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> Failed to load data.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml;
    }
};

window.addEventListener("load", async () => {
    await loadDatasets();
});
