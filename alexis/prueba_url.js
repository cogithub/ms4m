const axios = require('axios');
const zlib = require('zlib');
const util = require('util');

// Promisify para usar async/await con zlib
const gunzip = util.promisify(zlib.gunzip);

// URL del servicio REST que devuelve el archivo GZ
const url = 'http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=2025/&f=statushistory'
// debugger
async function fstatushistory() {
    try {
        // Hacer la solicitud al servicio REST
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Descomprimir el contenido
        const decompressedData = await gunzip(response.data);

        // Guardar el resultado en una variable (como string, si es texto)
        const result = decompressedData.toString('utf-8'); // Ajusta la codificación si es necesario

        // Imprimir o usar la variable
        console.log(result);
        

    } catch (error) {
        if (error.response) {
            console.error(`Error al consumir el servicio: ${error.response.status}`);
        } else if (error.code === 'Z_DATA_ERROR') {
            console.error('El archivo recibido no es un archivo GZ válido');
        } else {
            console.error(`Error inesperado: ${error.message}`);
        }
    }
}

// Función para consumir un servicio REST
async function consumirServicio(url, metodo = 'GET', datos = null) {
  try {
    // Configuración de la solicitud
    const opciones = {
      method: metodo, // GET, POST, etc.
      headers: {
        'Content-Type': 'application/json', // Para JSON, ajusta según necesites
      },
    };

    // Si hay datos (para POST, PUT, etc.), agregarlos al body
    if (datos) {
      opciones.body = JSON.stringify(datos);
    }

    // Hacer la petición
    const response = await fetch(url, opciones);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parsear y devolver el contenido en una variable
    const resultado = await response.json();
    return resultado; // Retorna los datos para usarlos fuera
  } catch (error) {
    console.error('Error al consumir el servicio:', error);
    throw error; // Propaga el error para manejarlo fuera si es necesario
  }
}

// Función para consumir un servicio REST y guardar el CSV en una variable
async function consumirServicioCSV(url, metodo = 'GET', datos = null) {
  let resultadoCSV; // Variable para almacenar el contenido

  try {
    // Configuración de la solicitud
    const opciones = {
      method: metodo,
      headers: {
        'Accept': 'text/csv', // Indica que esperamos CSV
        'Content-Type': 'application/json', // Para el body, si aplica
      },
    };

    // Si hay datos (para POST, etc.), agregarlos al body
    if (datos) {
      opciones.body = JSON.stringify(datos);
    }

    // Hacer la petición
    const response = await fetch(url, opciones);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Guardar el contenido como texto CSV en la variable
    resultadoCSV = await response.text();

    // Opcional: Parsear el CSV a un array de objetos
    const datosParseados = parsearCSV(resultadoCSV);
    
    // Retornar ambos: texto crudo y parseado (puedes elegir cuál usar)
    return { texto: resultadoCSV, parseado: datosParseados };
  } catch (error) {
    console.error('Error al consumir el servicio:', error);
    throw error;
  }
}

// Función auxiliar para parsear CSV
function parsearCSV(csvTexto) {
  // Dividir en líneas
  const lineas = csvTexto.trim().split('\n');
  // Obtener encabezados (primera línea)
  const encabezados = lineas[0].split(',').map(h => h.trim());
  // Convertir el resto en objetos
  const resultado = lineas.slice(1).map(linea => {
    const valores = linea.split(',').map(v => v.trim());
    return encabezados.reduce((obj, encabezado, i) => {
      obj[encabezado] = valores[i] || ''; // Asignar valores, manejar vacíos
      return obj;
    }, {});
  });
  return resultado;
}

// Ejemplo de llamada a la función y almacenamiento en una variable

// codigo de prueba

// const axios = require('axios');
const { parse } = require('csv-parse');

// URL del servicio REST que devuelve el texto plano (supuesto CSV)
const urlq = 'http://10.1.64.119:6060/api/v1/cube/get/dimension/?f=statusdetail';

async function fstatusdetail() {
  let result; // Variable para almacenar el texto plano
  try {
    // Hacer la solicitud al servicio REST
    const response = await axios.get(urlq, { responseType: 'text' });

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

// // Ejecutar y usar el resultado
// fetchAndParseCSV().then(({ result, csvData }) => {
//   if (csvData) {
//     // Usar csvData (lista de filas) como necesites
//     console.log('Contenido completo del CSV:', csvData);
//   } else {
//     // Usar result (texto plano) para inspección adicional
//     console.log('No se pudo parsear como CSV. Texto plano:', result.slice(0, 500));
//   }
// });

// codigo de prueba


// Llamar al ejemplo statushistory
fstatushistory();

// Ejecutar y usar el resultado statusdetail
fstatusdetail().then(({ result, csvData }) => {
  if (csvData) {
    // Usar csvData (lista de filas) como necesites
    console.log('Contenido completo del CSV:', csvData);
    
    debugger
  } else {
    // Usar result (texto plano) para inspección adicional
    console.log('No se pudo parsear como CSV. Texto plano:', result.slice(0, 500));
  }
});