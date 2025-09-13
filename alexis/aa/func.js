
// copia con parametros
// copia con parametros
// copia con parametros
// copia con parametros

const Papa = require('papaparse');
const fs = require('fs');

/**
 * Combina dos archivos CSV basándose en una clave común y genera un archivo de salida.
 * @param {string} archivo_a - Ruta del primer archivo CSV
 * @param {string} archivo_b - Ruta del segundo archivo CSV
 * @param {string} archivo_salida - Ruta del archivo CSV de salida
 * @param {string} clave_a - Nombre de la columna clave en el primer CSV
 * @param {string} clave_b - Nombre de la columna clave en el segundo CSV
 * @param {string} columna_transferir - Nombre de la columna a transferir del segundo CSV
 * @returns {void}
 */
function combinarCSVs(archivo_a
, archivo_b
, archivo_salida
, clave_a
, clave_b
, columna_transferir) {
    debugger
    // Leer archivos CSV
    // const csv_a = fs.readFileSync(archivo_a, 'utf8');
    // const csv_b = fs.readFileSync(archivo_b, 'utf8');

     const csv_a =archivo_a;
    const csv_b = archivo_b;

    // Parsear los CSVs a objetos
    const datos_a = Papa.parse(csv_a, { header: true, skipEmptyLines: true }).data;
    const datos_b = Papa.parse(csv_b, { header: true, skipEmptyLines: true }).data;

    // Crear un mapa para los datos de CSV B (búsqueda eficiente)
    const mapa_b = new Map(
        datos_b.map(item => [item[clave_b], item[columna_transferir]])
    );

    // Combinar datos
    const resultado = datos_a.map(item_a => ({
        ...item_a,
        [columna_transferir]: mapa_b.get(item_a[clave_a]) || null
    }));

    // Generar CSV de salida
    const csv_resultado = Papa.unparse(resultado);

    // Guardar el resultado en un archivo
    fs.writeFileSync(archivo_salida, csv_resultado);

    console.log(`Archivo ${archivo_salida} generado`);
}

// Llamada a la función
combinarCSVs(
    'archivo_a.csv',           // Ruta del primer archivo CSV
    'archivo_b.csv',           // Ruta del segundo archivo CSV
    'resultado.csv',           // Ruta del archivo de salida
    'Id equipment',            // Nombre de la columna clave en el primer CSV
    'Id equipment',            // Nombre de la columna clave en el segundo CSV
    'Equipment - ID'           // Nombre de la columna a transferir del segundo CSV
);
