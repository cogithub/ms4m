// Función para consumir y procesar el CSV
async function consumirCSV(url) {
  try {
    // Hacer la solicitud al servicio
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }

    // Obtener el texto del CSV
    const textoCSV = await respuesta.text();

    // Procesar el CSV
    const datos = procesarCSV(textoCSV);

    // Usar los datos (por ejemplo, mostrar en consola)
    //console.log(datos);
    return datos;
  } catch (error) {
    console.error('Error al consumir el CSV:', error);
  }
}

// Función para procesar el texto CSV en un arreglo de objetos
function procesarCSV(textoCSV) {
  // Dividir el texto en líneas
  const lineas = textoCSV.trim().split('\n');
  
  // Obtener los encabezados (primera fila)
  const encabezados = lineas[0].split(';');

  // Convertir las filas en objetos
  const datos = lineas.slice(1).map(linea => {
    const valores = linea.split(';');
    console.log(valores);
    return encabezados.reduce((objeto, encabezado, i) => {
      objeto[encabezado.trim()] = valores[i].trim();
      return objeto;
    }, {});
  });

  return datos;
}

// Llamar a la función con la URL del servicio
consumirCSV('http://10.1.64.119:6060/api/v1/cube/get/dimension/?f=equipment');