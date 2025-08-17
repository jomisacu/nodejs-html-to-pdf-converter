## Guía de Instalación y Uso del Servidor

Sigue estos pasos para instalar y ejecutar tu servidor de conversión de HTML a PDF.

### 1. Preparación del Proyecto

1.  **Crea un directorio para tu proyecto:**
    ```bash
    mkdir mi-servidor-pdf
    cd mi-servidor-pdf
    ```

2.  **Crea los archivos:**
    * Crea un archivo llamado `server.js` y pega el código del servidor.
    * Crea un archivo llamado `package.json` y pega el contenido del JSON de dependencias.

### 2. Instalación de Dependencias

1.  **Ejecuta `npm install`:**
    Este comando leerá tu `package.json` y descargará Express y Puppeteer.
    ```bash
    npm install
    ```
    > **¡Atención!** La primera vez que ejecutes este comando, Puppeteer descargará una versión de Chromium (~170-250MB) que puede tardar varios minutos. Esto es normal y solo ocurre una vez.

### 3. Ejecución del Servidor

1.  **Inicia el servidor:**
    Usa el script que definimos en el `package.json`.
    ```bash
    npm start
    ```

2.  **Verificación:**
    Si todo ha ido bien, deberías ver el siguiente mensaje en tu consola:
    ```
    Servidor escuchando en http://localhost:3000
    ```

### 4. Cómo Usar tu Servidor

Ahora que el servidor está en marcha, puedes enviarle solicitudes `POST` al endpoint `/generate-pdf`.

**Ejemplo con `curl`:**
```bash
curl -X POST \
  http://localhost:3000/generate-pdf \
  -H 'Content-Type: application/json'
