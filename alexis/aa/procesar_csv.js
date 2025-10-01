const axios = require('axios');
const AdmZip = require('adm-zip');
const url = 'http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=2025/&f=statushistory';

async function procesarCSV() {
  try {
    // Paso 1: Descargar el archivo ZIP
    console.log('Descargando el archivo ZIP...');
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    console.log(`Descargados ${response.data.length} bytes.`);

    // Paso 2: Descomprimir el ZIP en memoria
    console.log('Descomprimiendo el archivo ZIP...');
    const zip = new AdmZip(response.data);
    const zipEntries = zip.getEntries();
    if (zipEntries.length === 0) {
      throw new Error('El ZIP está vacío o no contiene archivos.');
    }

    // Asumir que el primer archivo es el CSV (ajusta si el nombre es específico)
    const csvEntry = zipEntries[0];
    console.log(`Archivo extraído: ${csvEntry.entryName}`);
    const csvContent = zip.readAsText(csvEntry);

    // Paso 3: Contar las líneas
    console.log('Contando líneas...');
    const lines = csvContent.trim().split('\n');
    const numLines = lines.length;
    console.log(`\nEl CSV descomprimido tiene ${numLines} líneas.`);

    // Mostrar las primeras 3 líneas para verificar
    if (numLines > 0) {
      console.log('\nPrimeras 3 líneas del CSV:');
      for (let i = 0; i < Math.min(3, numLines); i++) {
        console.log(`Línea ${i + 1}: ${lines[i]}`);
      }
    }

    // Paso 4: Aplicar el filtro (si lo necesitas)
    const condicion = 'activo'; // Cambia según tu caso
    const datos = lines.slice(1).map(line => line.split(',')); // Omitir encabezado, asumir delimitador coma
    const registrosFiltrados = datos.filter(fila => fila.length > 9 && fila[9] === condicion);
    console.log(`\nRegistros filtrados (columna 10 = "${condicion}"): ${registrosFiltrados.length}`);
    // Opcional: Mostrar primeros registros filtrados
    if (registrosFiltrados.length > 0) {
      console.log('Primeros 3 registros filtrados:');
      for (let i = 0; i < Math.min(3, registrosFiltrados.length); i++) {
        console.log(registrosFiltrados[i]);
      }
    }

    return numLines;

  } catch (error) {
    if (error.response) {
      console.error(`Error al descargar (HTTP ${error.response.status}): ${error.message}`);
    } else if (error.message.includes('adm-zip')) {
      console.error('Error al descomprimir: No es un ZIP válido.');
      // Si es GZIP en lugar de ZIP, necesitarías otra librería como 'zlib' (ver nota abajo)
    } else {
      console.error(`Error inesperado: ${error.message}`);
    }
  }
}

// Ejecutar
procesarCSV();