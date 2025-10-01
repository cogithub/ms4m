import pako from 'pako';
import fs from 'fs-extra';
import path from 'path';

const url = 'http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=2025/09&f=statushistory';

async function descargarYDescomprimir() {
  try {
    console.log('Descargando archivo desde la URL...');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la descarga: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();

    // Asumiendo que el archivo es GZIP, usa Pako para descomprimir
    console.log('Descomprimiendo con Pako...');
    const descomprimido = pako.inflate(new Uint8Array(buffer), { to: 'string' });
  } catch (error) {
    console.error('Error:', error.message);
  }}

  descargarYDescomprimir();


const arreglo2 = csvToObjectArray(descomprimido);
console.table(arreglo2);
  