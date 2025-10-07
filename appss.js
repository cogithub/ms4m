async function downloadZipFromEndpoint() {
    const url = 'http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=2025/07&f=production';
    const fileName = 'fact_production_2024_01.zip';

    try {
        console.log('Iniciando solicitud al endpoint...');

        // Realizar la solicitud al servicio REST
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Agrega headers si el endpoint requiere autenticación
                // 'Authorization': 'Bearer tu-token'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        // Verificar que el servidor devuelva un archivo ZIP
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/zip')) {
            throw new Error('El servidor no devolvió un archivo ZIP válido');
        }

        // Obtener el contenido como Blob
        const zipBlob = await response.blob();

        // Crear un enlace temporal para la descarga
        const downloadUrl = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        console.log('Archivo ZIP descargado exitosamente');
    } catch (error) {
        console.error('Error al consumir el endpoint:', error.message);
    }
}

// Ejecutar la función
downloadZipFromEndpoint();