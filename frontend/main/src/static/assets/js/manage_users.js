var userIdToDelete = null;

function confirmDelete(userId) {
    userIdToDelete = userId;
}

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