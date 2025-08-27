const fs = require('fs');
const zlib = require('zlib');

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);


// Leer el archivo .gz
const filePath = 'targets'+'.mss.gz';
const outputPath =filePath.replace('.gz', '');

async function openFile(filePath) {
  try {
    const command = `open "${filePath}"`; // Escapa el nombre del archivo
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error('Error:', stderr);
      return;
    }
    console.log('Archivo abierto:', stdout);
  } catch (error) {
    console.error('Error al ejecutar el comando:', error.message);
  }
}

fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Descomprimir el contenido
  zlib.gunzip(data, (err, decompressed) => {
    if (err) {
      console.error('Error al descomprimir:', err);
      return;
    }

    // Guardar el archivo descomprimido
    fs.writeFile(outputPath, decompressed, (err) => {
      if (err) {
        console.error('Error al escribir el archivo:', err);
        return;
      }
      console.log('Archivo descomprimido guardado en:', outputPath);
      // Ejemplo: abrir un archivo descomprimido
      openFile(outputPath);
    });
  });
});


