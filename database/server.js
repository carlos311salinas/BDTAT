const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// IMPORTACIÓN DE ROUTERS PARA CORRESPONSALES
const corresponsalesRouter = require('../routes/corresponsales/js/serverCrearCorresponsal.js'); // router para crear
const buscarCorresponsalesRouter = require('../routes/corresponsales/js/serverBuscarCorresponsal.js'); // router para buscar
const editarCorresponsalesRouter = require('../routes/corresponsales/js/serverEditarCorresponsal.js'); // router para editar
const retirarCorresponsalesRouter = require('../routes/corresponsales/js/serverRetirarCorresponsal.js'); // router para retirar corresponsales
// IMPORTACIÓN DE ROUTERS PARA CORRESPONSALES RETIRADOS
const buscarRetiradosRouter = require('../routes/corresponsales/corresponsalesretirados/js/serverBuscarCorresponsalRetirado.js'); // router para buscar corresponsales retirados
const editarRetiradosRouter = require('../routes/corresponsales/corresponsalesretirados/js/serverEditarCorresponsalRetirado.js'); // router para editar corresponsales retirados


// IMPORTACIÓN DE ROUTERS PARA MAQUINAS
const maquinasRouter = require('../routes/Maquinas/js/serverCrearMaquina.js'); // router para crear
const buscarMaquinasRouter = require('../routes/Maquinas/js/serverBuscarMaquina.js'); // router para buscar
const editarMaquinasRouter = require('../routes/Maquinas/js/serverEditarMaquina.js'); // router para editar
const enviarMaquinasRouter = require('../routes/Maquinas/js/serverEnviarMantenimiento.js'); // router para enviar maquina

//IMPORTACION DE ROUTER PARA HISTORIALENVIOS
const historialEnviosRouter = require('../routes/Maquinas/js/serverHistorialEnvios.js');
const historialEnviosMantenimientoRouter = require('../routes/Maquinas/MaquinasMantenimiento/js/serverHistorialEnviosMantenimiento.js');
// IMPORTACIÓN ROUTESS PARA MAQUINAS EN MANTENIMIENTO
const buscarMaquinasMantenimientoRouter = require('../routes/Maquinas/MaquinasMantenimiento/js/serverBuscarMaquinaMantenimiento.js'); // router para buscar
const editarMaquinaMantenimientoRouter = require('../routes/Maquinas/MaquinasMantenimiento/js/serverEditarMaquinaMantenimiento.js'); // router para editar maquinas en mantenimiento

const regresarMaquinaMantenimientoRouter = require('../routes/Maquinas/MaquinasMantenimiento/js/serverRegresarMantenimiento.js'); //router para regresar maquinas de mantenimiento

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde 'routes'
app.use(express.static(path.join(__dirname, '../routes')));

// Middleware para registrar solicitudes en la consola
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

// Ruta para servir la página principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/inicio/html/index.html'));
});

// Usar los routers para manejar las rutas de corresponsales
app.use('/api/corresponsales', corresponsalesRouter);
app.use('/api/buscar-corresponsales', buscarCorresponsalesRouter);
app.use('/api', editarCorresponsalesRouter);
app.use('/api', retirarCorresponsalesRouter);

app.use('/api/buscar-corresponsales-retirados', buscarRetiradosRouter); // Se mantiene la ruta correcta
app.use('/api', editarRetiradosRouter);

// Rutas para servir las páginas HTML de CORRESPONSALES
app.get('/crear-corresponsal', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/corresponsales/html/CrearCorresponsal.html'));
});
app.get('/corresponsales', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/corresponsales/html/Corresponsales.html'));
});
app.get('/buscar-corresponsal', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/corresponsales/html/BuscarCorresponsal.html'));
});

// Rutas para servir las páginas HTML de CORRESPONSALES RETIRADOS
app.get('/corresponsales-retirados', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/corresponsales/corresponsalesretirados/html/corresponsalesRetirados.html'));
});

// Usar los routers para manejar las rutas de MAQUINAS
app.use('/api/maquinas', maquinasRouter);
app.use('/api/buscar-maquinas', buscarMaquinasRouter);
app.use('/api', editarMaquinasRouter);
app.use('/api', enviarMaquinasRouter);

app.use('/api/buscar-maquinas-mantenimiento', buscarMaquinasMantenimientoRouter); // Se mantiene la ruta correcta
app.use('/api', editarMaquinaMantenimientoRouter);
app.use('/api', regresarMaquinaMantenimientoRouter);

//Historial envios
app.use(historialEnviosRouter);
app.use(historialEnviosMantenimientoRouter);

// Rutas para servir las páginas HTML de MAQUINAS
app.get('/crear-maquina', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/Maquinas/html/CrearMaquina.html'));
});
app.get('/maquinas', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/Maquinas/html/Maquinas.html'));
});
app.get('/buscar-maquina', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/Maquinas/html/BuscarMaquina.html'));
});

// Rutas para servir las páginas HTML de MAQUINAS EN MANTENIMIENTO
app.get('/buscar-maquinas-mantenimiento', (req, res) => {
    res.sendFile(path.join(__dirname, '../routes/Maquinas/MaquinasMantenimiento/html/MaquinasMantenimiento.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});