const express = require('express');
const cors = require('cors');
const pool = require('../../../../database/conexion'); // Importa la conexión

const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// Ruta para regresar una máquina de mantenimiento
router.post("/regresar-maquina/:id", async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const {
            fecharegreso,
            tecnologia, imeiacercademac, placa, serial, lider,
            siminternet, cedula, nombrecorresponsal, codigoseta,
            ubicacion, estado, fecha, conteoenvio
        } = req.body;

        await client.query("BEGIN");

        // Actualizar la fecha de regreso en la tabla historialenvios
        await client.query(
            `UPDATE historialenvios 
             SET fecharegreso = $1 
             WHERE maquina_id = $2`,
            [fecharegreso, id]
        );

        // Actualizar los datos de la máquina en la tabla maquinas
        await client.query(
            `UPDATE maquinas SET
                tecnologia = $1,
                imeiacercademac = $2,
                placa = $3,
                serial = $4,
                lider = $5,
                siminternet = $6,
                cedula = $7,
                nombrecorresponsal = $8,
                codigoseta = $9,
                ubicacion = 'EN LABORATORIO',
                estado = $10,
                fecha = $11,
                conteoenvio = $12
             WHERE id = $13`,
            [
                tecnologia, imeiacercademac, placa, serial, lider,
                siminternet, cedula, nombrecorresponsal, codigoseta,
                estado, fecha, conteoenvio, id
            ]
        );

        // Eliminar la máquina de la tabla maquinasmantenimiento
        await client.query(
            `DELETE FROM maquinasmantenimiento 
             WHERE id = $1`,
            [id]
        );

        await client.query("COMMIT");

        res.status(200).json({ mensaje: "Máquina regresada correctamente a laboratorio" });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    } finally {
        client.release();
    }
});

module.exports = router;