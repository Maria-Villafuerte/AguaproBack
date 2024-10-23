import { google } from 'googleapis';
import express from 'express';
import multer from 'multer';

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
  auth: oauth2Client,
});

// Configuración de multer para manejar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// POST para subir imágenes a Google Drive
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname, // Nombre del archivo en Google Drive
    };

    const media = {
      mimeType: req.file.mimetype,
      body: Buffer.from(req.file.buffer), // Utiliza el buffer directamente
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
