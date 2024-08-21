
function filterDatasets() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchRole = document.getElementById('searchRole').value;

    const rows = document.querySelectorAll('#TableUsers tr');

    rows.forEach(row => {
        const username = row.querySelector('.username');
        const role = row.querySelector('.role');

        if (!username || !role) {
            return;
        }

        const user_name = username.innerText.toLowerCase();
        const user_role = role.innerText.toLowerCase(); 
        let isTitleMatch = user_name.includes(searchInput);
        let isRoleMatch = user_role.includes(searchRole);

        if (isTitleMatch && isRoleMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://54.197.173.166:8000/api/registers/", { method: 'GET'});
            const jsonData = await response.json();
            const logsTableBody = document.querySelector("#TableUsers");

            // Convert the JSON object to an array and sort it by log_id in descending order
            const logsArray = Object.values(jsonData);
            logsArray.sort((a, b) => b.log_id - a.log_id);

            const createRow = (log) => {
                const row = document.createElement("tr");
                if (log.role === "holder"){
                    row.innerHTML = `
                    <td>${log.id}</td>
                    <td class="username">${log.username}</td>
                    <td class="role">data subject</td>
                `;
                }else{
                    row.innerHTML = `
                        <td>${log.id}</td>
                        <td class="username">${log.username}</td>
                        <td class="role">${log.role}</td>
                    `;
                }

                return row;
            };

            const updateTable = (filteredLogs) => {
                logsTableBody.innerHTML = ''; // Clear the table body
                filteredLogs.forEach(log => logsTableBody.appendChild(createRow(log)));
            };



            // Initial table population
            updateTable(logsArray);

            // Filter functionality
            document.getElementById('searchInput').addEventListener('input', filterDatasets);
            document.getElementById('searchRole').addEventListener('input', filterDatasets);
            
        } catch (error) {
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
    };

    fetchUsers();
});




