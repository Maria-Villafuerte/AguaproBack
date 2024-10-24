import { google } from 'googleapis';
import express from 'express';
import multer from 'multer'; // Para manejar el archivo subido
import { Readable } from 'stream'; // Para convertir el buffer a stream
import fs from 'fs';

const router = express.Router();

// Configuración de OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Inicializa el servicio de Google Drive
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// Configuración de multer para manejar archivos subidos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Función para convertir el buffer en un stream
function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// POST para subir imágenes a Google Drive
router.post('/upload/:productId', upload.single('file'), async (req, res) => {
  const file = req.file; // Aquí debe estar el archivo subido
  const filename = req.params.productId; // ID para el nombre de archivo

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // ID de la carpeta donde se quiere subir el archivo
  const folderId = '1NbbMCg2VslIaUjttwJSIuwTlzR8FvjQ0';

  try {
    const fileMetadata = {
      name: filename, // Nombre del archivo en Google Drive
      parents: [folderId],           // Subir a la carpeta específica
    };

    const media = {
      mimeType: file.mimetype,
      body: bufferToStream(file.buffer), // Convierte el buffer a stream
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    const fileId = response.data.id
    // Asignar permisos de visualización pública
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    res.status(200).json({ fileId: fileId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

// Endpoint para obtener un archivo basado en su nombre
router.get('/visualize/:fileName', async (req, res) => {
  const { fileName } = req.params;

  try {
    // Buscar el archivo por nombre
    const response = await drive.files.list({
      q: `name='${fileName}' and trashed=false`, // Consulta el archivo por nombre y no en la papelera
      fields: 'files(id, name)', // Obtener solo el ID y nombre
      pageSize: 1, // Limitar a un solo archivo
    });

    const files = response.data.files;

    if (files.length) {
      const fileId = files[0].id;

      // Obtener el archivo usando su ID
      const file = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      // Enviar el archivo como respuesta (streaming)
      file.data
        .on('end', () => console.log('Descarga finalizada'))
        .on('error', (error) => res.status(500).send('Error al descargar la imagen'))
        .pipe(res);

    } else {
      // Si no se encuentra el archivo
      res.status(404).json({
        message: 'No file found with the specified name',
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      message: 'Error processing request',
      error: error.message,
    });
  }
});

// Endpoint para obtener un archivo a través de enlace
router.get('/getLink/:fileName', async (req, res) => {
  const { fileName } = req.params;

  try {
    // Buscar el archivo por nombre
    const response = await drive.files.list({
      q: `name='${fileName}' and trashed=false`, // Consulta el archivo por nombre y no en la papelera
      fields: 'files(id, name)', // Obtener solo el ID y nombre
      pageSize: 1, // Limitar a un solo archivo
    });

    const files = response.data.files;

    if (files.length) {
      const fileId = files[0].id;

      // Obtener el enlace público del archivo
      const file = await drive.files.get({
        fileId,
        fields: 'webViewLink, webContentLink',
      });

      // Devolver la respuesta con los enlaces públicos
      res.json({
        message: 'Archivo encontrado',
        fileId: fileId,
        webViewLink: file.data.webViewLink, // Enlace para visualizar el archivo
      });

    } else {
      // Si no se encuentra el archivo
      res.status(404).json({
        message: 'No file found with the specified name',
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      message: 'Error processing request',
      error: error.message,
    });
  }
});

// Endpoint para modificar una imagen
router.post('/replace/:fileName', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Archivo de reemplazo no subido correctamente' });
  }
  const { fileName } = req.params;

  try {
    // Buscar el archivo por nombre
    const response = await drive.files.list({
      q: `name='${fileName}' and trashed=false`, // Consulta el archivo por nombre y no en la papelera
      fields: 'files(id, name)', // Obtener solo el ID y nombre
      pageSize: 1, // Limitar a un solo archivo
    });

    const files = response.data.files;

    if (files.length) {
      const fileId = files[0].id;

      // 2. Eliminar el archivo antiguo
      await drive.files.delete({ fileId });

      const folderId = '1NbbMCg2VslIaUjttwJSIuwTlzR8FvjQ0';
      // Subir el nuevo archivo
      const fileMetadata = { 
        name: fileName,
        parents: [folderId],           // Subir a la carpeta específica
      };
      const media = {
        mimeType: req.file.mimetype,
        body: bufferToStream(req.file),
      };

      const newFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });

      const newFileId = newFile.data.id
      // Asignar permisos de visualización pública
      await drive.permissions.create({
        newFileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Enviar la respuesta con el ID del nuevo archivo
      res.json({
        message: 'Archivo reemplazado con éxito',
        fileId: newFileId,
      });
    } else {
      res.status(404).json({
        message: `Archivo ${fileName} no encontrado para reemplazar`,
      });
    }
  } catch (error) {
    console.error('Error al reemplazar archivo:', error);
    res.status(500).json({
      message: 'Error al reemplazar archivo',
      error: error.message,
    });
  }
});

export default router;
