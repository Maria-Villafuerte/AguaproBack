import { google } from 'googleapis';
import express from 'express';
import multer from 'multer'; // Para manejar el archivo subido
import { Readable } from 'stream'; // Para convertir el buffer a stream

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

  // Aquí está el ID de la carpeta donde quieres subir el archivo
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

    res.status(200).json({ fileId: response.data.id });
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
      const file = drive.files.get(
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

router.post('/update/:fileName', upload.single('file'), async (req, res) => {
  const { fileName } = req.params;

  try {
    const response = await drive.files.list({
      q: `name='${fileName}' and trashed=false`, // Consulta el archivo por nombre y no en la papelera
      fields: 'files(id, name)', // Obtener solo el ID y nombre
      pageSize: 1, // Limitar a un solo archivo
    });

    const files = response.data.files;

    if (files.length) {
      const fileId = files[0].id;

      const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      };

      // Actualiza el archivo con el nuevo contenido
      const updatedFile = drive.files.update({
        fileId: fileId,
        media: media,
        fields: 'id',
      });

      res.json({
        message: 'Archivo actualizado con éxito',
        fileId: updatedFile.data.id,
      });
    }
  } catch (error) {
    console.error('Error al actualizar archivo:', error);
    res.status(500).json({
      message: 'Error al actualizar archivo',
      error: error.message,
    });
  }
});

export default router;
