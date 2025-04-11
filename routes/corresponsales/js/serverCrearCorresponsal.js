const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../database/conexion'); // Importa la conexión

const router = express.Router(); // Crear un router en lugar de un servidor

// Middleware
router.use(cors());
router.use(express.json());

// Ruta para servir la página de Crear Corresponsal
router.get('/crear-corresponsal', (req, res) => {
    res.sendFile(path.join(__dirname, '../corresponsales/html/CrearCorresponsal.html'));
});

// Ruta para insertar un corresponsal
router.post('/', async (req, res) => { // Usa la ruta /api/corresponsales desde server.js
    try {
        const {
            nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
            codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo,
            direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha,
            longitud, latitud, activosfijos// Agregamos las nuevas columnas
        } = req.body;

        const query = `
            INSERT INTO corresponsales (
                nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
                codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo,
                direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha,
                longitud, latitud, activosfijos
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            RETURNING *;
        `;

        const values = [
            nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
            codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo,
            direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha,
            longitud, latitud, activosfijos // Agregamos los valores correspondientes
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Corresponsal creado', corresponsal: result.rows[0] });
    } catch (error) {
        console.error('Error al insertar corresponsal:', error);
        res.status(500).json({ error: 'Error al insertar corresponsal' });
    }
});

// Exportar el router
module.exports = router;