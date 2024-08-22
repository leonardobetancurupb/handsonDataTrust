
// Finds consumer IDs based on schema name and policy ID
function findConsumerIds(data) {
    const consumerIds = [];
    const authorization = data.authorization;

    authorization.forEach(authItem => {
        const consumerId = Object.keys(authItem)[0];
        consumerIds.push(consumerId);
        
    });

    return consumerIds;
}


const loadMoney = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    try {

        const postResponse = await fetch(`/accounts/get_cache/?key=id_session`, { method: 'GET' });
        if (!postResponse.ok) throw new Error(`Error fetching session data: ${postResponse.statusText}`);
        const result = await postResponse.json();
        console.log(result);

        const getHoldersResponse = await fetch(`http://localhost:8000/api/holders/`, { method: 'GET' });
        if (!getHoldersResponse.ok) throw new Error(`Error fetching holders: ${getHoldersResponse.statusText}`);
        const resultHolders = await getHoldersResponse.json();
        const filteredHolderss = resultHolders.filter(item => item.idPerson === result.value);
        if (filteredHolderss.length === 0) throw new Error('No consumers found for the given session');
        
        groupedData=filteredHolderss[0].authorization;

        const policyResponse = await fetch(`http://localhost:8000/api/policy/`, requestOptions);
        if (!policyResponse.ok) throw new Error(`Error fetching policy: ${policyResponse.statusText}`);
        const policies = await policyResponse.json();


        let total = 0;

        groupedData.forEach(auth => {
            const policyId = auth.idPolicy;
            const policy = policies.find(p => p.id === policyId);
            
            if (policy) {
                const value = parseFloat(policy.Value);
                const discountedValue = value * 0.80; // Apply 20% discount
                total += discountedValue;
            }
        });

        const tableContainer = document.getElementById('main');
        tableContainer.innerHTML = '';
        const rowHtmls = [];
            const rowHtml = `
            <button class=" btn-outline-success btn btn-lg">
            Total Paid: $${total.toFixed(2)} <br>
        </button>
            `;
            
            rowHtmls.push(rowHtml);
        tableContainer.innerHTML = rowHtmls.join(''); 


        // Update table with consumer data
        const tableContainer_consumption = document.getElementById('tabledata');
        tableContainer_consumption.innerHTML = '';
        
        const consumerIds = findConsumerIds(filteredHolderss[0]);
        if (consumerIds.length < 1) {
            tableContainer_consumption.innerHTML = `<tr><td colspan="4">No consumers found.</td></tr>`;
        } else {
            for (const id of consumerIds) {
                const consumerResponse = await fetch(`http://localhost:8000/api/consumers/${id}/`);
                if (!consumerResponse.ok) throw new Error(`Error fetching consumer: ${consumerResponse.statusText}`);
                const consumer = await consumerResponse.json();
                tableContainer_consumption.innerHTML += `
                    <tr>
                        <td>${consumer.id}</td>
                        <td>${consumer.company}</td>
                        <td>${consumer.nit}</td>
                    </tr>
                `;
            }
        }

    } catch (error) {
        // Optionally displays an error message to the user
        const alertContainer = document.getElementById('alertContainer');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> ${error}.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
        `;
        alertContainer.innerHTML = alertHtml;
    }
};

window.addEventListener("load", async () => {
    await loadMoney();
});
