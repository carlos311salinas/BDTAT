const express = require('express');
const cors = require('cors');
const pool = require('../../../database/conexion'); // Importa la conexión

const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// Ruta para enviar una máquina a mantenimiento
router.post("/enviar-maquina/:id", async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const {
            motivoenvio, observacion, personaenvia, fechaenvio,
            tecnologia, imeiacercademac, placa, serial, lider, siminternet,
            cedula, nombrecorresponsal, codigoseta, estado, fecha, conteoenvio, ubicacion
        } = req.body;

        await client.query("BEGIN");

        // Verificar si la máquina existe en la tabla "maquinas"
        const maquinaQuery = await client.query("SELECT * FROM maquinas WHERE id = $1", [id]);
        if (maquinaQuery.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Máquina no encontrada." });
        }

        // Verificar si la máquina ya está en mantenimiento
        const mantenimientoQuery = await client.query("SELECT * FROM maquinasmantenimiento WHERE id = $1", [id]);
        if (mantenimientoQuery.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ error: "La máquina ya está en mantenimiento." });
        }

        // Insertar el nuevo historial en historialenvios
        const nuevoHistorial = await client.query(
            `INSERT INTO historialenvios (maquina_id, motivoenvio, fechaenvio, fecharegreso, observacion, personaenvia) 
             VALUES ($1, $2, $3, NULL, $4, $5) RETURNING id`,
            [id, motivoenvio, fechaenvio, observacion, personaenvia]
        );

        // Obtener todos los registros de historialenvios de la máquina
        const historialQuery = await client.query("SELECT * FROM historialenvios WHERE maquina_id = $1", [id]);
        if (historialQuery.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ error: "No hay historial de envíos para esta máquina." });
        }

        // 🔧 ACTUALIZAR LOS DATOS EN LA TABLA MAQUINAS ANTES DE ENVIAR A MANTENIMIENTO
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
                ubicacion = 'EN MANTENIMIENTO',
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

        // Insertar en maquinasmantenimiento (ubicación se pone fija como 'EN MANTENIMIENTO')
        const resultMantenimiento = await client.query(
            `INSERT INTO maquinasmantenimiento (id, tecnologia, imeiacercademac, placa, serial, lider, siminternet, cedula, nombrecorresponsal, codigoseta, ubicacion, estado, fecha, conteoenvio) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'EN MANTENIMIENTO', $11, $12, $13) RETURNING id`,
            [
                id, tecnologia, imeiacercademac, placa, serial,
                lider, siminternet, cedula, nombrecorresponsal,
                codigoseta, estado, fecha, conteoenvio
            ]
        );
        const maquinaMantenimientoId = resultMantenimiento.rows[0].id;

        // Insertar el historial en historialenviosmantenimiento
        for (const registro of historialQuery.rows) {
            await client.query(
                `INSERT INTO historialenviosmantenimiento (id, maquina_mantenimiento_id, motivoenvio, fechaenvio, fecharegreso, observacion, personaenvia) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    registro.id, maquinaMantenimientoId, registro.motivoenvio, registro.fechaenvio,
                    registro.fecharegreso, registro.observacion, registro.personaenvia
                ]
            );
        }

        await client.query("COMMIT");
        res.status(200).json({ mensaje: "Máquina enviada correctamente a mantenimiento con todo su historial." });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    } finally {
        client.release();
    }
});

module.exports = router;