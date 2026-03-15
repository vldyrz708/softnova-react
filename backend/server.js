const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const conection = require('./config/db');

const PORT = process.env.PORT || 3000;

async function start() {
    await conection();
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
        console.log(`Documentación: http://localhost:${PORT}/doc`);
    });
}

start().catch((err) => {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
});
