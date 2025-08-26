// Función para consumir el servicio CSV
async function consumirCSV() {
  const url = 'http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=2023/11/22&f=production';
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

    // Mostrar los datos en consola (puedes adaptarlo según tus necesidades)
    console.log(datos);
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
  const encabezados = lineas[0].split(',');

  // Convertir las filas en objetos
  const datos = lineas.slice(1).map(linea => {
    const valores = linea.split(',');
    return encabezados.reduce((objeto, encabezado, i) => {
      objeto[encabezado.trim()] = valores[i] ? valores[i].trim() : '';
      return objeto;
    }, {});
  });

  return datos;
}

// Llamar a la función
consumirCSV();