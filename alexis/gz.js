
async function openFile(filePath) { // Define una función asíncrona para abrir un archivo
  try { // Inicia un bloque try para manejar errores
    const command = `open "${filePath}"`; // Crea el comando para abrir el archivo, escapando el nombre del archivo
    const { stdout, stderr } = await execPromise(command); // Ejecuta el comando usando promesas y captura la salida y errores
    if (stderr) { // Verifica si hay errores en la ejecución del comando
      console.error('Error:', stderr); // Muestra el error en la consola
      return; // Termina la ejecución de la función
    }
    console.log('Archivo abierto:', stdout); // Muestra un mensaje indicando que el archivo fue abierto
  } catch (error) { // Captura cualquier error durante la ejecución del comando
    console.error('Error al ejecutar el comando:', error.message); // Muestra el mensaje de error en la consola
  }
}

fs.readFile(filePath, (err, data) => { // Lee el archivo comprimido de forma asíncrona
  if (err) { // Verifica si hubo un error al leer el archivo
    console.error('Error al leer el archivo:', err); // Muestra el error en la consola
    return; // Termina la ejecución de la función
  }

  // Descomprimir el contenido
  zlib.gunzip(data, (err, decompressed) => { // Descomprime el contenido del archivo usando gunzip
    if (err) { // Verifica si hubo un error al descomprimir
      console.error('Error al descomprimir:', err); // Muestra el error en la consola
      return; // Termina la ejecución de la función
    }

    // Guardar el archivo descomprimido
    fs.writeFile(outputPath, decompressed, (err) => { // Escribe el contenido descomprimido en un nuevo archivo
      if (err) { // Verifica si hubo un error al escribir el archivo
        console.error('Error al escribir el archivo:', err); // Muestra el error en la consola
        return; // Termina la ejecución de la función
      }
      console.log('Archivo descomprimido guardado en:', outputPath); // Muestra un mensaje indicando que el archivo descomprimido fue guardado
      // Ejemplo: abrir un archivo descomprimido
      openFile(outputPath); // Llama a la función para abrir el archivo descomprimido
    });
  });
});