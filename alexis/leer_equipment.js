// HTML necesario: <input type="file" id="csvFile" accept=".csv">
document.getElementById('csvFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (!file) {
        console.error('No se seleccionó ningún archivo');
        return;
    }

    // Verificar que sea un archivo CSV
    if (!file.name.endsWith('.csv')) {
        console.error('Por favor, selecciona un archivo CSV');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const data = parseCSV(text);
        console.log('Datos CSV:', data);
        // Aquí puedes trabajar con los datos, por ejemplo, mostrarlos en una tabla
    };

    reader.onerror = function(e) {
        console.error('Error al leer el archivo:', e);
    };

    reader.readAsText(file);
});

// Función para parsear el CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',').map(item => item.trim());

        // Verificar que la línea tenga la misma cantidad de columnas que los encabezados
        if (currentLine.length === headers.length) {
            headers.forEach((header, index) => {
                obj[header] = currentLine[index];
            });
            result.push(obj);
        } else {
            console.warn(`Línea ${i + 1} ignorada: formato incorrecto`);
        }
    }

    return result;
}