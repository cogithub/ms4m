const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

// Función para combinar CSVs
function combinarCSVs(rutaCsvA, rutaCsvB, rutaSalida, col_index, col_insert) {
    try {
        // Verificar si los archivos existen
        if (!fs.existsSync(rutaCsvA)) {
            throw new Error(`El archivo no se encuentra: ${rutaCsvA}`);
        }
        if (!fs.existsSync(rutaCsvB)) {
            throw new Error(`El archivo no se encuentra: ${rutaCsvB}`);
        }

        // Leer archivos CSV
        const csv_a = fs.readFileSync(rutaCsvA, 'utf8');
        const csv_b = fs.readFileSync(rutaCsvB, 'utf8');

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
           "Equipment - ID": mapa_b.get(item_a["id equipment"]) || null
        }));

        // Generar CSV de salida
        const csv_resultado = Papa.unparse(resultado);

        // Guardar el resultado en un archivo
        fs.writeFileSync(rutaSalida, csv_resultado);
        console.log(`Archivo ${rutaSalida} generado correctamente`);
    } catch (error) {
        console.error(`Error al procesar los CSVs: ${error.message}`);
        throw error; // Lanza el error para que el llamador pueda manejarlo si es necesario
    }
}

// Ejemplo de llamada a la función
try {
    col_index = "id equipment id";
    col_insert = "Equipment - ID";

    combinarCSVs(
        path.resolve(__dirname, 'archivo_a.csv'), // Ruta al CSV A
        path.resolve(__dirname, 'archivo_b.csv'), // Ruta al CSV B
        path.resolve(__dirname, 'resultado.csv'),  // Ruta al archivo de salida
        col_index,
        col_insert
    );
} catch (error) {
    console.error('Error en la ejecución:', error.message);
}