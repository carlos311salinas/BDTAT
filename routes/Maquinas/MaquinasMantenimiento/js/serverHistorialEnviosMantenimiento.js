const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../../database/conexion'); // Importa la conexión

const router = express.Router();

router.get('/api/historialenviosmantenimiento', async (req, res) => {
    const { maquina_mantenimiento_id } = req.query;

    try {
        const result = await pool.query(
            "SELECT * FROM historialenviosmantenimiento WHERE maquina_mantenimiento_id = $1 ORDER BY fechaenvio ASC",
            [maquina_mantenimiento_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener historial de envíos:", error);
        res.status(500).json({ error: "Error al obtener historial de envíos" });
    }
});

module.exports = router;
