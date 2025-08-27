const fs = require('fs');
const zlib = require('zlib');

// Leer el archivo .gz
const filePath = 'targets'+'.mss.gz';
const outputPath =filePath.replace('.gz', '');

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
    });
  });
});