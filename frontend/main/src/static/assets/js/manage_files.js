const API_BASE_URL = 'https://http://127.0.0.1:8000/';
// Función para exportar datos a un archivo Excel
function exportToExcel() {
    // Datos de ejemplo
    var data = [
        ["Nombre", "Edad", "Correo"],
        ["Juan", 30, "juan@example.com"],
        ["María", 28, "maria@example.com"],
        ["Carlos", 35, "carlos@example.com"]
    ];

    // Crear un libro de Excel
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    // Guardar el libro como un archivo Excel
    var filename = "datos.xlsx";
    XLSX.writeFile(wb, filename);
}

// Función para importar un archivo Excel
function importExcel(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        // Obtener la primera hoja de cálculo
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convertir la hoja de cálculo a un objeto JSON
        var jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Aquí puedes procesar los datos importados, por ejemplo, mostrarlos en la consola
        console.log(jsonData);
    };

    reader.readAsArrayBuffer(file);
}