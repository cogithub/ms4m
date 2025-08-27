const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

// Ejemplo: abrir un archivo descomprimido
openFile('targets.mss');