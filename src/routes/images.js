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
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
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
  try {
    const fileMetadata = {
      name: req.file.originalname, // Nombre del archivo en Google Drive
    };

    const media = {
      mimeType: req.file.mimetype,
      body: bufferToStream(req.file.buffer), // Convierte el buffer a stream
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

export default router;
