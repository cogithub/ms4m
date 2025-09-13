
function statushistory(){
    const axios = require('axios');

    const AdmZip = require('adm-zip');
    const fs = require('fs').promises;
    const path = require('path');

    // Reemplaza '${a}' con el valor correspondiente para la variable 'd'
    const fecha = '2025'; // Ejemplo, cambia esto según sea necesario
    const url = `http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=${fecha}/&f=statushistory`;

    // Carpeta de destino para los archivos descomprimidos
    const outputDir = 'descomprimido';

    async function downloadAndUnzip() {
    try {
        // ************ Crear la carpeta de destino si no existe
        await fs.mkdir(outputDir, { recursive: true });

        // Descargar el archivo ZIP
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Verificar si la solicitud fue exitosa
        if (response.status === 200) {
        // Guardar temporalmente el archivo ZIP
        const zipPath = path.join(outputDir, 'statushistory.zip');
        await fs.writeFile(zipPath, response.data);

        // Descomprimir el archivo ZIP
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true);

        console.log(`Archivo descargado y descomprimido en: ${outputDir}`);

        // Listar los archivos descomprimidos
        const files = await fs.readdir(outputDir);
        files.forEach(file => {
            if (file !== 'temp.zip') {
            console.log(` - ${file}`);
            }
        });

        // Eliminar el archivo ZIP temporal
        await fs.unlink(zipPath);
        } else {
        console.error(`Error al descargar el archivo. Código de estado: ${response.status}`);
        }
    } catch (error) {
        if (error.response) {
        console.error(`Error en la solicitud: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.code === 'ENOENT' || error.code === 'EACCES') {
        console.error('Error de permisos o directorio no accesible.');
        } else {
        console.error(`Error inesperado: ${error.message}`);
        }
    }
    }
}

    const axios = require('axios');
    const fs = require('fs').promises;

    async function fetchAndSaveEquipmentData() {
        try {
            // Hacer la solicitud a la API
            const response = await axios.get('http://10.1.64.119:6060/api/v1/cube/get/dimension/?f=equipment');
            
            // Convertir los datos a string (formato JSON con formato legible)
            const dataString = JSON.stringify(response.data, null, 2);
            
            // Guardar los datos en equipment.txt
            await fs.writeFile('equipment.txt', dataString, 'utf8');
            console.log('Datos guardados exitosamente en equipment.txt');
        } catch (error) {
            console.error('Error al consumir la API o guardar el archivo:', error.message);
        }
    }

    // Ejecutar la función
    fetchAndSaveEquipmentData();


// function matchreg(t1,t2,f){

// }


// Ejecutar la función
// downloadAndUnzip();

// matchreg('statushistory','equipment','Id equipment');