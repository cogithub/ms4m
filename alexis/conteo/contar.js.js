const pako = require('pako');
const fetch = require('node-fetch');
const fs = require('fs');
const { parse } = require('csv-parse');

const anio = '2025';
const url = `http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=${anio}/&f=statushistory`;

async function descargarListarYSumar() {
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

    // Paso 5: Procesar el CSV para listar encabezados y sumar duración
    const sumasPorMainStatus = {};
    const parser = parse({
      delimiter: ',', // Ajusta si el delimitador es diferente (por ejemplo, ';')
      columns: true,
      skip_empty_lines: true
    });

    parser.on('columns', function (columns) {
      console.log(`Encabezados del archivo ${nombreArchivo}:`);
      console.log(columns);
    });

    parser.on('readable', function () {
      let registro;
      while ((registro = parser.read()) !== null) {
        const mainStatus = registro['Main status'] || registro['Main_status'] || 'desconocido';
        const duracion = parseFloat(registro.duración || registro.Duración || registro.duration || 0);
        if (!isNaN(duracion)) {
          sumasPorMainStatus[mainStatus] = (sumasPorMainStatus[mainStatus] || 0) + duracion;
        } else {
          console.warn(`Valor no numérico en duración para Main status ${mainStatus}: ${registro.duración}`);
        }
      }
    });

    parser.on('error', function (err) {
      console.error(`Error al procesar el CSV ${nombreArchivo}:`, err.message);
    });

    parser.on('end', function () {
      console.log(`Suma de duración por Main status en ${nombreArchivo}:`);
      for (const [mainStatus, suma] of Object.entries(sumasPorMainStatus)) {
        console.log(`Main status: ${mainStatus}, Suma de duración: ${suma}`);
      }
      console.log(`Procesamiento completado para ${nombreArchivo}.`);
    });

    parser.write(datosDescomprimidos);
    parser.end();
  } catch (error) {
    console.error('Error al descargar, descomprimir o procesar:', error.message);
  }
}

descargarListarYSumar();