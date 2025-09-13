const axios = require('axios');
const { parse } = require('csv-parse');

// URL del servicio REST que devuelve el texto plano (supuesto CSV)
const url = 'http://10.1.64.119:6060/api/v1/cube/get/dimension/?f=statusdetail';

async function fetchAndParseCSV() {
  let result; // Variable para almacenar el texto plano
  try {
    // Hacer la solicitud al servicio REST
    const response = await axios.get(url, { responseType: 'text' });

    // Obtener el contenido como texto plano
    result = response.data;

    // Verificar si hay BOM (UTF-8 con BOM) y eliminarlo
    if (result.startsWith('\ufeff')) {
      result = result.slice(1);
      console.log('Codificación detectada: UTF-8 con BOM');
    } else {
      console.log('Codificación asumida: UTF-8');
    }

    // Mostrar los primeros 500 caracteres para inspección
    console.log('Contenido de la respuesta (primeros 500 caracteres):', result.slice(0, 500));

    // Intentar parsear como CSV
    const delimiters = [',', ';', '\t', '|']; // Coma, punto y coma, tabulador, pipe
    let parsedCSV = null;

    for (const delimiter of delimiters) {
      try {
        parsedCSV = await new Promise((resolve, reject) => {
          const records = [];
          parse(result, {
            delimiter: delimiter,
            trim: true, // Eliminar espacios en blanco
            skip_empty_lines: true, // Ignorar líneas vacías
            relax_quotes: true, // Tolerar comillas malformadas
            relax_column_count: true // Tolerar filas con diferente número de columnas
          })
            .on('data', (record) => records.push(record))
            .on('end', () => resolve(records))
            .on('error', (err) => reject(err));
        });

        // Mostrar las primeras 5 filas para inspección
        console.log(`Delimitador '${delimiter}' parece funcionar. Primeras filas:`, parsedCSV.slice(0, 5));
        break; // Si funciona, salir del bucle
      } catch (error) {
        console.log(`Delimitador '${delimiter}' no funcionó: ${error.message}`);
        parsedCSV = null;
      }
    }

    if (!parsedCSV) {
      console.log('Error: No se pudo parsear el CSV con los delimitadores probados.');
      console.log('Contenido de la respuesta (primeros 500 caracteres):', result.slice(0, 500));
      return { result, csvData: null }; // Devolver el texto plano para inspección
    }

    // Guardar el CSV parseado en una variable
    const csvData = parsedCSV;
    console.log(`CSV procesado correctamente. Total de filas: ${csvData.length}`);

    // Devolver tanto el texto plano como el CSV parseado
    return { result, csvData };

  } catch (error) {
    if (error.response) {
      console.error(`Error al consumir el servicio: ${error.response.status}`);
    } else {
      console.error(`Error inesperado: ${error.message}`);
    }
    console.log('Contenido de la respuesta (primeros 500 caracteres):', result ? result.slice(0, 500) : 'No disponible');
    return { result, csvData: null };
  }
}

// Ejecutar y usar el resultado
fetchAndParseCSV().then(({ result, csvData }) => {
  if (csvData) {
    // Usar csvData (lista de filas) como necesites
    console.log('Contenido completo del CSV:', csvData);
  } else {
    // Usar result (texto plano) para inspección adicional
    console.log('No se pudo parsear como CSV. Texto plano:', result.slice(0, 500));
  }
});