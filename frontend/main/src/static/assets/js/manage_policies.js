
const API_BASE_URL = 'https://http://127.0.0.1:8000/';
function getPolicies_dropdown() {
    // Example policies - replace with your actual data fetching logic
    const policies = [
        { id: 1, name: 'Policy 1' },
        { id: 2, name: 'Policy 2' },
        { id: 3, name: 'Policy 3' }
    ];

    const select = document.getElementById('idPolicy');
    policies.forEach(policy => {
        const option = document.createElement('option');
        option.value = policy.id;
        option.textContent = policy.name;
        select.appendChild(option);
    });
}


document.addEventListener('DOMContentLoaded', getPolicies_dropdown);


async function createPolicy(policyData) {
    const response = await fetch(`${API_BASE_URL}/policy/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(policyData)
    });
    return response.json();
}

async function getPolicy(id) {
    const response = await fetch(`${API_BASE_URL}/policy/${id}/`, {
        method: 'GET'
    });
    return response.json();
}

async function updatePolicy(id, policyData) {
    const response = await fetch(`${API_BASE_URL}/policy/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(policyData)
    });
    return response.json();
}

async function deletePolicy(id) {
    const response = await fetch(`${API_BASE_URL}/policy/${id}/`, {
        method: 'DELETE'
    });
    return response.status === 204; 
}

async function listPolicies() {
    const response = await fetch(`${API_BASE_URL}/policy/`, {
        method: 'GET'
    });
    return response.json();
}