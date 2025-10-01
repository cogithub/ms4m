const axios = require('axios');
const pako = require('pako');
const fs = require('fs').promises;

const url = 'http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=2025/&f=statushistory';
const outputFile = 'statushistory_2025.csv';

async function procesarCSV() {
  try {
    // Paso 1: Descargar el archivo GZIP
    console.log('Descargando el archivo GZIP...');
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    console.log(`Descargados ${response.data.length} bytes.`);

    // Paso 2: Descomprimir con Pako
    console.log('Descomprimiendo el archivo GZIP...');
    const decompressedData = pako.ungzip(response.data, { to: 'string' });
    const csvContent = decompressedData;

    // Paso 3: Guardar el CSV descomprimido
    console.log(`Guardando CSV en ${outputFile}...`);
    await fs.writeFile(outputFile, csvContent, 'utf-8');
    console.log(`CSV guardado exitosamente en ${outputFile}.`);

    // Paso 4: Procesar el CSV
    console.log('Procesando CSV...');
    const lines = csvContent.trim().split('\n');
    const totalLines = lines.length;
    console.log(`El CSV tiene ${totalLines} líneas (incluyendo encabezado).`);

    // Mostrar las primeras 3 líneas para verificar
    if (totalLines > 0) {
      console.log('\nPrimeras 3 líneas del CSV:');
      for (let i = 0; i < Math.min(3, totalLines); i++) {
        console.log(`Línea ${i + 1}: ${lines[i]}`);
      }
    }

    // Paso 5: Filtrar registros donde id_status == 1 (columna 10, índice 9)
    console.log('\nFiltrando registros con id_status == 1...');
    const datos = lines.slice(1).map(line => line.split(',')); // Omitir encabezado
    const registrosFiltrados = datos.filter(fila =>  fila[2] === parseInt('1'));
    
    // Paso 6: Contar registros filtrados
    const numRegistrosFiltrados = registrosFiltrados.length;
    console.log(`Registros con id_status == 1 (columna 10): ${numRegistrosFiltrados}`);

    // Mostrar primeros 3 registros filtrados
    if (numRegistrosFiltrados > 0) {
      console.log('Primeros 3 registros filtrados:');
      for (let i = 0; i < Math.min(3, numRegistrosFiltrados); i++) {
        console.log(registrosFiltrados[i]);
      }
    }

    return numRegistrosFiltrados;

  } catch (error) {
    if (error.response) {
      console.error(`Error al descargar (HTTP ${error.response.status}): ${error.message}`);
    } else if (error.message.includes('incorrect header check')) {
      console.error('Error al descomprimir: No es un archivo GZIP válido.');
      console.error('Es posible que sea un ZIP. Usa JSZip en lugar de Pako.');
    } else {
      console.error(`Error inesperado: ${error.message}`);
    }
    return 0;
  }
}

// Ejecutar
procesarCSV();