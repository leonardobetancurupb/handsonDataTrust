var userIdToDelete = null;

function confirmDelete(userId) {
    userIdToDelete = userId;
}

document.addEventListener("DOMContentLoaded", function() {
    const fetchUsers = async () => {
        try {
            const response = await fetch("/administrator/api/registers/");
            const jsonData = await response.json();
            const logsTableBody = document.querySelector("#TableUsers");

            // Convert the JSON object to an array and sort it by log_id in descending order
            const logsArray = Object.values(jsonData);
            logsArray.sort((a, b) => b.log_id - a.log_id);

            const createRow = (log) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${log.log_id}</td>
                    <td>${log.username}</td>
                    <td>${log.role}</td>
                    <td>${log.destination}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="confirmDelete({{ user.id }})" data-toggle="modal" data-target="#staticBackdrop">Delete</button>
                    </td>
                `;

                return row;
            };

            const updateTable = (filteredLogs) => {
                logsTableBody.innerHTML = ''; // Clear the table body
                filteredLogs.forEach(log => logsTableBody.appendChild(createRow(log)));
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
            console.error("Error fetching logs:", error);
        }
    };

    fetchUsers();
});




document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (userIdToDelete !== null) {
        fetch(`../delete_user/${userIdToDelete}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                location.reload();  // Refresh the page to update the user list
            } else {
                alert('Failed to delete user.');
            }
        });
    }
});

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

function filterTable() {
    var nameFilter = document.getElementById('name').value.toLowerCase();
    var emailFilter = document.getElementById('email').value.toLowerCase();
    var table = document.getElementById('userTable');
    var rows = table.getElementsByTagName('tr');

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var firstName = cells[0].textContent.toLowerCase();
        var lastName = cells[1].textContent.toLowerCase();
        var email = cells[2].textContent.toLowerCase();

        var nameMatch = (firstName + ' ' + lastName).indexOf(nameFilter) > -1;
        var emailMatch = email.indexOf(emailFilter) > -1;

        if (nameMatch && emailMatch) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}