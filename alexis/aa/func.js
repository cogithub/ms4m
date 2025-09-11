const Papa = require('papaparse');
const fs = require('fs');

function combinarCSVs(rutaArchivoA, rutaArchivoB, col_index, col_insert, rutaSalida) {
    // Leer archivos CSV
    const csv_a = fs.readFileSync(rutaArchivoA, 'utf8');
    const csv_b = fs.readFileSync(rutaArchivoB, 'utf8');

    // Parsear los CSVs a objetos
    const datos_a = Papa.parse(csv_a, { header: true, skipEmptyLines: true }).data;
    const datos_b = Papa.parse(csv_b, { header: true, skipEmptyLines: true }).data;

    // Crear un mapa para los datos de CSV B (búsqueda eficiente)
    const mapa_b = new Map(
        datos_b.map(item => [item[col_index], item[col_insert]])
    );

    // Combinar datos
    const resultado = datos_a.map(item_a => ({
        ...item_a,
        "Equipment - ID": mapa_b.get(item_a[col_insert ]) || null
    }));

    // Generar CSV de salida
    const csv_resultado = Papa.unparse(resultado);

    // Guardar el resultado en un archivo
    fs.writeFileSync(rutaSalida, csv_resultado);

    console.log(`Archivo ${rutaSalida} generado`);
}

// Llamada a la función con parámetros
combinarCSVs('archivo_a.csv', 'archivo_b.csv', 'id equipment ','equipment ID', 'salida.csv');