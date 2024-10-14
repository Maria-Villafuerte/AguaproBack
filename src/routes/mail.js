import express from 'express';
import createTransport from 'nodemailer';

const router = express.Router();

// Configura el transportador
let transporter = createTransport({
    service: 'Gmail', 
    auth: {
        user: 'aguatesaautomatizado@gmail.com',
        pass: 'Auto_correos1410'
    }
});

router.post('/confirmacion', (req, res) => {
    const { mailto } = req.body;

    // Configura el contenido del correo con HTML
    let mailOptions = {
        from: 'aguatesaautomatizado@gmail.com',
        to: mailto,
        subject: 'Gracias por tu compra en Aguatesa en línea',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                }
                .header {
                    background-color: #007bff;
                    padding: 10px;
                    text-align: center;
                    color: #ffffff;
                    border-radius: 10px 10px 0 0;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .content p {
                    line-height: 1.6;
                }
                .order-details {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .order-details h2 {
                    font-size: 18px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #28a745;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #666666;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <h1>¡Gracias por tu compra en Aguatesa!</h1>
                </div>

                <!-- Body Content -->
                <div class="content">
                    <p>Hola [Nombre del cliente],</p>
                    <p>Gracias por realizar una compra en nuestra tienda. Aquí están los detalles de tu pedido:</p>

                    <!-- Order Details -->
                    <div class="order-details">
                        <h2>Detalles del pedido</h2>
                        <p><strong>Producto:</strong> [Nombre del producto]</p>
                        <p><strong>Cantidad:</strong> [Cantidad]</p>
                        <p><strong>Precio total:</strong> $[Precio total]</p>
                    </div>

                    <!-- Call to Action Button -->
                    <a href="[Enlace a la tienda]" class="button">Ir a la tienda</a>

                    <p>Si tienes alguna pregunta, no dudes en <a href="[Enlace a contacto]">contactarnos</a>.</p>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>&copy; 2024 [Nombre de la tienda]. Todos los derechos reservados.</p>
                    <p>[Dirección de la tienda] | [Teléfono] | <a href="[Enlace a sitio web]">Sitio web</a></p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    // Enviar correo de confirmación
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error al enviar el correo');
        }
        res.status(200).send('Correo enviado y compra procesada');
    });
});
export default router;