const Papa = require('papaparse');
const fs = require('fs');

// Leer archivos CSV (reemplaza con las rutas reales de tus archivos)
const csv_a = fs.readFileSync('archivo_a.csv', 'utf8');
const csv_b = fs.readFileSync('archivo_b.csv', 'utf8');

// Parsear los CSVs a objetos
const datos_a = Papa.parse(csv_a, { header: true, skipEmptyLines: true }).data;
const datos_b = Papa.parse(csv_b, { header: true, skipEmptyLines: true }).data;

// Crear un mapa para los datos de CSV B (búsqueda eficiente)
const mapa_b = new Map(
    datos_b.map(item => [item["Id equipment"], item["Equipment - ID"]])
);

// Combinar datos
const resultado = datos_a.map(item_a => ({
    ...item_a,
    "Equipment - ID": mapa_b.get(item_a["Id equipment"]) || null
}));

// Generar CSV de salida
const csv_resultado = Papa.unparse(resultado);

// Guardar el resultado en un archivo
fs.writeFileSync('resultado.csv', csv_resultado);

console.log('Archivo resultado.csv generado');