const myApiKey ="";
fetch('/accounts/key/')
    .then(response => response.json())
    .then(data => {
        myApiKey = data.my_api_key;
        console.log("API Key:", myApiKey);
    })
    .catch(error => console.error("Error fetching config:", error));



document.addEventListener("DOMContentLoaded", function() {
    const fetchLogs = async () => {
        try {
            const response = await fetch("/administrator/logs/");
            const jsonData = await response.json();
            const logsTableBody = document.querySelector("#logsTable tbody");

            // Convert the JSON object to an array and sort it by log_id in descending order
            const logsArray = Object.values(jsonData);
            logsArray.sort((a, b) => b.log_id - a.log_id);
            const createRow = (log) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${log.log_id}</td>
                    <td>${log.type}</td>
                    <td>${log.source}</td>
                    <td>${log.destination}</td>
                    <td>${log.description.content.description}</td>
                    <td>${new Date(log.timestamp * 1000).toLocaleString()}</td>
                `;

                return row;
            };

            const updateTable = (filteredLogs) => {
                const lastLimitLogs = filteredLogs.slice(0, 20);
                console.log(lastLimitLogs);
                logsTableBody.innerHTML = ''; // Clear the table body
                lastLimitLogs.forEach(log => logsTableBody.appendChild(createRow(log)));
            };

            const filterLogs = () => {
                const filterType = document.getElementById('filterType').value.toLowerCase();
                const filterSource = document.getElementById('filterSource').value.toLowerCase();
                const filterDestination = document.getElementById('filterDestination').value.toLowerCase();
                const startDate = new Date(document.getElementById('startDate').value);
                const endDate = new Date(document.getElementById('endDate').value);

                const filteredLogs = logsArray.filter(log => {
                    const logDate = new Date(log.timestamp * 1000);
                    const typeMatch = log.type.toLowerCase().includes(filterType);
                    const sourceMatch = log.source.toLowerCase().includes(filterSource);
                    const destinationMatch = log.destination.toLowerCase().includes(filterDestination);
                    const dateMatch = (!startDate.getTime() || logDate >= startDate) &&
                                    (!endDate.getTime() || logDate <= endDate);

                    return typeMatch && sourceMatch && destinationMatch && dateMatch;
                });

                updateTable(filteredLogs);
            };

            // Initial table population
            updateTable(logsArray);

            // Filter functionality
            document.getElementById('filterType').addEventListener('input', filterLogs);
            document.getElementById('filterSource').addEventListener('input', filterLogs);
            document.getElementById('filterDestination').addEventListener('input', filterLogs);
            document.getElementById('startDate').addEventListener('change', filterLogs);
            document.getElementById('endDate').addEventListener('change', filterLogs);
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

    fetchLogs();
});