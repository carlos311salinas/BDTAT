const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../database/conexion'); // Importa la conexión

const router = express.Router(); // Crear un router en lugar de un servidor

// Middleware
router.use(cors());
router.use(express.json());

// Ruta para servir la página de Crear Maquina
router.get('/crear-maquina', (req, res) => {
    res.sendFile(path.join(__dirname, '../Maquinas/html/CrearMaquina.html'));
});

// Ruta para insertar un Maquina
router.post('/', async (req, res) => {
    try {
        const {
            tecnologia, imeiacercademac, placa, serial, lider, siminternet, cedula,
            nombrecorresponsal, codigoseta, fecha  // 👈 QUITÉ estado
        } = req.body;

        const query = `
            INSERT INTO maquinas (
                tecnologia, imeiacercademac, placa, serial, lider, siminternet, cedula,
                nombrecorresponsal, codigoseta, estado, fecha, conteoenvio, ubicacion
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVA', $10, '0', 'EN LABORATORIO')
            RETURNING *;
        `;

        const values = [
            tecnologia, imeiacercademac, placa, serial, lider, siminternet, cedula,
            nombrecorresponsal, codigoseta, fecha  // 👈 QUITÉ estado
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Maquina Creada', maquina: result.rows[0] });
    } catch (error) {
        console.error('Error al insertar maquina:', error);
        res.status(500).json({ error: 'Error al insertar maquina' });
    }
});

// Exportar el router
module.exports = router;