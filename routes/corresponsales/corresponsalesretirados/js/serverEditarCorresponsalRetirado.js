const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../../database/conexion'); // Importa la conexión

const router = express.Router();

// Función para validar fechas en formato YYYY-MM-DD
const esFechaValida = (fecha) => {
    if (!fecha) return true; // Si no hay fecha, no validamos nada

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato YYYY-MM-DD
    if (!fechaRegex.test(fecha)) return false;

    const [year, month, day] = fecha.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);

    return fechaObj.getFullYear() === year &&
           fechaObj.getMonth() === month - 1 &&
           fechaObj.getDate() === day;
};

// Ruta para actualizar un corresponsal retirado
router.put('/editar-corresponsal-retirado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let {
            nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
            codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo,
            direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha,
            longitud, latitud, activosfijos, fecharetiro, personaretira, comentario
        } = req.body;

        // Validar que ambas fechas sean correctas
        if ((fecha && !esFechaValida(fecha)) || (fecharetiro && !esFechaValida(fecharetiro))) {
            return res.status(400).json({ mensaje: 'Una o ambas fechas son inválidas. Por favor ingrese fechas correctas.' });
        }

        console.log("Datos recibidos en el servidor:", req.body);

        // Lista de campos y valores
        let campos = [
            "nombrecorresponsal", "imeiacercademac", "codigoseta", "tecnologia", "cedula", "municipio",
            "codigodane", "codigopostal", "lider", "estado", "nombrecompleto", "telefono", "correo",
            "direccion", "tiponegocio", "zona", "categoria", "siminternet", "modalidad",
            "longitud", "latitud", "activosfijos", "personaretira", "comentario"
        ];
        let valores = [
            nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
            codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo,
            direccion, tiponegocio, zona, categoria, siminternet, modalidad,
            longitud, latitud, activosfijos, personaretira, comentario
        ];

        // Si las fechas existen, las agregamos
        if (fecha) {
            campos.push("fecha");
            valores.push(fecha);
        }
        if (fecharetiro) {
            campos.push("fecharetiro");
            valores.push(fecharetiro);
        }

        // Construir consulta SQL dinámica
        let setQuery = campos.map((campo, index) => `${campo} = $${index + 1}`).join(", ");
        let query = `UPDATE corresponsalesretirados SET ${setQuery} WHERE id = $${valores.length + 1} RETURNING *;`;

        valores.push(id);

        const result = await pool.query(query, valores);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Corresponsal retirado no encontrado' });
        }

        res.status(200).json({ message: 'Corresponsal retirado actualizado', corresponsal: result.rows[0] });

    } catch (error) {
        console.error('Error al actualizar corresponsal retirado:', error);
        res.status(500).json({ error: 'Error al actualizar corresponsal retirado', details: error.message });
    }
});

module.exports = router;
