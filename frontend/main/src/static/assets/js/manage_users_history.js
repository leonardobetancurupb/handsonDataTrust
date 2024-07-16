
const API_BASE_URL = 'https://http://127.0.0.1:8000/';
// Función para obtener el historial (simulación)
function getHistory() {
    // Aquí deberías hacer una llamada AJAX para obtener el historial real
    return [
        { id: 1, date: '2023-07-01', action: 'Login', schema: 'Schema1', policy: 'Policy1', category: 'Cat1' },
        { id: 2, date: '2023-07-02', action: 'Logout', schema: 'Schema2', policy: 'Policy2', category: 'Cat2' },
        // Agrega más datos según sea necesario
    ];
}

// Función para filtrar y mostrar el historial
function buscarHistorial() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const schema = document.getElementById('schema').value.toLowerCase();
    const policy = document.getElementById('policy').value.toLowerCase();
    const category = document.getElementById('category').value.toLowerCase();

    const history = getHistory();
    const filteredHistory = history.filter(item => {
        const itemDate = new Date(item.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || itemDate >= start) &&
               (!end || itemDate <= end) &&
               (!schema || item.schema.toLowerCase().includes(schema)) &&
               (!policy || item.policy.toLowerCase().includes(policy)) &&
               (!category || item.category.toLowerCase().includes(category));
    });

    const tableBody = document.getElementById('historialTableBody');
    tableBody.innerHTML = '';

    filteredHistory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>${item.action}</td>
            <td>${item.schema}</td>
            <td>${item.policy}</td>
            <td>${item.category}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Llamar a buscarHistorial para cargar todos los datos inicialmente
document.addEventListener('DOMContentLoaded', buscarHistorial);

