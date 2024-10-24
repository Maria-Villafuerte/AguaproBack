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
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file; // Aquí debe estar el archivo subido
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Aquí está el ID de la carpeta donde quieres subir el archivo
  const folderId = '1NbbMCg2VslIaUjttwJSIuwTlzR8FvjQ0';

  try {
    const fileMetadata = {
      name: file.originalname, // Nombre del archivo en Google Drive
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

// Endpoint para obtener el ID del archivo basado en su nombre
app.get('/findFileByName/:fileName', async (req, res) => {
  const { fileName } = req.params;

  try {
    const response = await drive.files.list({
      q: `name='${fileName}' and trashed=false`, // Consulta el archivo por nombre y no en la papelera
      fields: 'files(id, name)', // Especifica que queremos obtener el ID y el nombre del archivo
      pageSize: 1, // Limita el número de archivos para evitar múltiples coincidencias
    });

    const files = response.data.files;

    if (files.length) {
      res.json({
        message: 'File found',
        file: {
          id: files[0].id,
          name: files[0].name,
        },
      });
    } else {
      res.status(404).json({
        message: 'No file found with the specified name',
      });
    }
  } catch (error) {
    console.error('Error finding file:', error);
    res.status(500).json({
      message: 'Error finding file',
      error: error.message,
    });
  }
});

export default router;
