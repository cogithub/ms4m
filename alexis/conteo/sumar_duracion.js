const pako = require('pako');
const fetch = require('node-fetch');
const fs = require('fs');
const { parse } = require('csv-parse');

const anio = '2025';
const url = `http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=${anio}/&f=statushistory`;

async function listarEncabezados() {
  try {
    // Paso 1: Descargar el archivo
    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        // Agrega headers si la API requiere autenticación
        // 'Authorization': 'Bearer tu-token'
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status} ${respuesta.statusText}`);
    }

    // Paso 2: Obtener el contenido como ArrayBuffer
    const arrayBuffer = await respuesta.arrayBuffer();

    // Paso 3: Descomprimir con Pako
    const datosDescomprimidos = pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' });

    // Paso 4: Guardar los datos descomprimidos (opcional)
    const nombreArchivo = `statushistory_${anio}.csv`;
    fs.writeFileSync(nombreArchivo, datosDescomprimidos);
    console.log(`Archivo descomprimido guardado como: ${nombreArchivo}`);

    // Paso 5: Procesar el CSV y extraer los encabezados
    const parser = parse({
      delimiter: ',', // Ajusta si el delimitador es diferente (por ejemplo, ';')
      columns: true, // Usa la primera fila como encabezados
      skip_empty_lines: true
    });

    parser.on('columns', function (columns) {
      console.log('Encabezados del archivo:');
      console.log(columns);
    });

    parser.on('error', function (err) {
      console.error('Error al procesar el CSV:', err.message);
    });

    parser.on('end', function () {
      console.log('Procesamiento de encabezados completado.');
    });

    // Alimentar el parser con los datos
    parser.write(datosDescomprimidos);
    parser.end();
  } catch (error) {
    console.error('Error al descargar, descomprimir o procesar:', error.message);
  }
}

// Ejecutar la función
listarEncabezados();