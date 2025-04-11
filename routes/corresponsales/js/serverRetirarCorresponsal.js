const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../database/conexion'); // Importa la conexión

const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// Ruta para retirar un corresponsal
router.post("/retirar-corresponsal/:id", async (req, res) => {
    const { id } = req.params;
    const {
        nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
        codigodane, codigopostal, lider, nombrecompleto, telefono, correo, direccion,
        tiponegocio, zona, categoria, siminternet, modalidad, fecha, longitud, latitud,
        activosfijos, fecharetiro, personaretira, comentario
    } = req.body;

    try {
        // Iniciar una transacción
        await pool.query("BEGIN");

        // Insertar en corresponsalesretirados con estado 'Inactivo'
        await pool.query(
            `INSERT INTO corresponsalesretirados (
                nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio, 
                codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo, 
                direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha, 
                longitud, latitud, activosfijos, fecharetiro, personaretira, comentario
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 'Inactivo', $10, $11, $12, $13, $14, 
                $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
            )`,
            [
                nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
                codigodane, codigopostal, lider, nombrecompleto, telefono, correo, direccion,
                tiponegocio, zona, categoria, siminternet, modalidad, fecha, longitud, latitud,
                activosfijos, fecharetiro, personaretira, comentario
            ]
        );

        // Eliminar de corresponsales
        await pool.query("DELETE FROM corresponsales WHERE id = $1", [id]);

        // Confirmar la transacción
        await pool.query("COMMIT");

        res.json({ message: "Corresponsal retirado exitosamente" });

    } catch (error) {
        await pool.query("ROLLBACK");
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;