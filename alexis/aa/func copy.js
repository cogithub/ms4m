const Papa = require('papaparse');
const fs = require('fs');

function processEquipmentCSV(idEquipment, equipmentID, csvFileA, csvFileB, outputFile) {
    // Leer archivos CSV
    const csv_a = fs.readFileSync(csvFileA, 'utf8');
    const csv_b = fs.readFileSync(csvFileB, 'utf8');

    // Parsear los CSVs a objetos
    const datos_a = Papa.parse(csv_a, { header: true, skipEmptyLines: true }).data;
    const datos_b = Papa.parse(csv_b, { header: true, skipEmptyLines: true }).data;

    // Crear un mapa para los datos de CSV B (búsqueda eficiente)
    const mapa_b = new Map(
        datos_b.map(item => [item[idEquipment], item[equipmentID]])
    );

    // Combinar datos
    const resultado = datos_a.map(item_a => ({
        ...item_a,
        [equipmentID]: mapa_b.get(item_a[idEquipment]) || null
    }));

    // Generar CSV de salida
    const csv_resultado = Papa.unparse(resultado);

    // Guardar el resultado en un archivo
    fs.writeFileSync(outputFile, csv_resultado);

    return `Archivo ${outputFile} generado`;
}

// Llamada de ejemplo
console.log(processEquipmentCSV('Id equipment', 'Equipment ID', 'archivo_a.csv', 'archivo_b.csv', 'resultado.csv'));