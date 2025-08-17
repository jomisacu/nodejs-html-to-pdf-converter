// server.js

const express = require('express');
const puppeteer = require('puppeteer');

// Creamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para que Express pueda entender payloads en formato JSON
app.use(express.json({ limit: '10mb' })); // Aumentamos el límite para HTMLs grandes

/**
 * Endpoint para generar el PDF.
 * Acepta una solicitud POST en /generate-pdf
 * Payload esperado: { "html": "..." }
 */
app.post('/generate-pdf', async (req, res) => {
    // 1. --- Validación de la solicitud ---
    const { html } = req.body;

    if (!html) {
        return res.status(400).json({ message: 'Error: La clave "html" es requerida en el payload.' });
    }

    // 2. --- Generación del PDF con Puppeteer ---
    let browser;
    try {
        console.log('Lanzando navegador headless...');
        // Lanzamos una instancia del navegador.
        // Las opciones '--no-sandbox' y '--disable-setuid-sandbox' son a menudo necesarias
        // cuando se ejecuta Puppeteer en un entorno de servidor (como Docker).
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        console.log('Estableciendo contenido HTML...');
        await page.setContent(html, { waitUntil: 'networkidle0' });

        console.log('Generando PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px',
            },
        });

        // 3. --- Envío de la respuesta ---
        console.log('PDF generado exitosamente. Enviando respuesta...');
        // Establecemos los headers para que el cliente interprete la respuesta como un archivo PDF.
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');

        // Enviamos el buffer del PDF como cuerpo de la respuesta.
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).json({ message: 'Ocurrió un error interno al generar el PDF.', error: error.message });
    } finally {
        // 4. --- Limpieza de recursos ---
        // Nos aseguramos de cerrar el navegador sin importar si hubo un error o no.
        if (browser) {
            console.log('Cerrando navegador...');
            await browser.close();
        }
    }
});

// Endpoint de bienvenida para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor de conversión HTML a PDF está en funcionamiento. Usa el endpoint POST /generate-pdf.');
});

// Iniciamos el servidor para que escuche en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
