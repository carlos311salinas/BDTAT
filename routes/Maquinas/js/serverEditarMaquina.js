const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../database/conexion'); // Importa la conexión

const router = express.Router();


const esFechaValida = (fecha) => {
    if (!fecha) return true;
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) return false;
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);
    return fechaObj.getFullYear() === year &&
           fechaObj.getMonth() === month - 1 &&
           fechaObj.getDate() === day;
};

// Ruta para editar una máquina y su historial
router.put('/editar-maquina/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        let {
            tecnologia, imeiacercademac, placa, serial, lider, siminternet, 
            cedula, nombrecorresponsal, codigoseta, estado, fecha, conteoenvio, ubicacion, historial
        } = req.body;

        // ⚠️ Si la fecha viene como "", la convertimos a null
        if (fecha === "") fecha = null;

        // ✅ Validar solo si tiene valor
        if (fecha && !esFechaValida(fecha)) {
            return res.status(400).json({ mensaje: 'Fecha inválida. Use formato YYYY-MM-DD' });
        }

        console.log("📌 Datos recibidos para actualizar máquina:", req.body);

        // ACTUALIZAR MAQUINA
        let campos = [
            "tecnologia", "imeiacercademac", "placa", "serial", "lider", "siminternet",
            "cedula", "nombrecorresponsal", "codigoseta", "estado", "fecha", "conteoenvio", "ubicacion"
        ];
        let valores = [
            tecnologia, imeiacercademac, placa, serial, lider, siminternet, 
            cedula, nombrecorresponsal, codigoseta, estado, fecha, conteoenvio, ubicacion
        ];

        let setQuery = campos.map((campo, index) => `${campo} = $${index + 1}`).join(", ");
        let query = `UPDATE maquinas SET ${setQuery} WHERE id = $${valores.length + 1} RETURNING *;`;
        valores.push(id);

        const result = await client.query(query, valores);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Máquina no encontrada' });
        }

        // ACTUALIZAR HISTORIALENVIOS
        if (historial && historial.length > 0) {
            console.log("📦 Intentando actualizar historial de envíos...");

            for (let envio of historial) {
                if (!envio.id) {
                    console.log("⚠️ Advertencia: El historial no tiene ID. No se puede actualizar:", envio);
                    continue;
                }

                // ⚠️ Convertir "" a null para fechas vacías
                if (envio.fechaenvio === "") envio.fechaenvio = null;
                if (envio.fecharegreso === "") envio.fecharegreso = null;

                // ✅ Validar fechas si tienen valor
                if (envio.fechaenvio && !esFechaValida(envio.fechaenvio)) {
                    return res.status(400).json({ mensaje: `Fecha de envío inválida en historial ID ${envio.id}` });
                }
                if (envio.fecharegreso && !esFechaValida(envio.fecharegreso)) {
                    return res.status(400).json({ mensaje: `Fecha de regreso inválida en historial ID ${envio.id}` });
                }

                console.log(`🔄 Actualizando historial ID ${envio.id}...`);
                
                const updateResult = await client.query(
                    `UPDATE historialenvios
                     SET motivoenvio = $1, observacion = $2, personaenvia = $3, fechaenvio = $4, fecharegreso = $5 
                     WHERE id = $6 RETURNING *;`,
                    [envio.motivoenvio, envio.observacion, envio.personaenvia, envio.fechaenvio, envio.fecharegreso, envio.id]
                );

                if (updateResult.rowCount === 0) {
                    console.log(`⚠️ Advertencia: No se encontró un historial de envíos con ID ${envio.id}`);
                } else {
                    console.log(`✅ Historial ID ${envio.id} actualizado correctamente.`);
                }
            }
        } else {
            console.log("⚠️ No se recibió historial para actualizar.");
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Máquina e historial actualizados correctamente' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error al actualizar máquina o historial:', error);
        res.status(500).json({ error: 'Error en la actualización', details: error.message });
    } finally {
        client.release();
    }
});

module.exports = router;