const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../database/conexion'); // Importa la conexión

const router = express.Router();


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

// Ruta para actualizar un corresponsal
router.put('/editar-corresponsal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let {
            nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
            codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo,
            direccion, tiponegocio, zona, categoria, siminternet, modalidad, fecha,
            longitud, latitud, activosfijos
        } = req.body;

        // Validar que la fecha sea correcta
        if (fecha && !esFechaValida(fecha)) {
            return res.status(400).json({ mensaje: 'Fecha inválida. Por favor ingrese una fecha correcta.' });
        }

        console.log("Datos recibidos en el servidor:", req.body);

        // Lista de campos y valores
        let campos = [
            "nombrecorresponsal", "imeiacercademac", "codigoseta", "tecnologia", "cedula", "municipio",
            "codigodane", "codigopostal", "lider", "estado", "nombrecompleto", "telefono", "correo",
            "direccion", "tiponegocio", "zona", "categoria", "siminternet", "modalidad",
            "longitud", "latitud", "activosfijos"
        ];
        let valores = [
            nombrecorresponsal, imeiacercademac, codigoseta, tecnologia, cedula, municipio,
            codigodane, codigopostal, lider, estado, nombrecompleto, telefono, correo,
            direccion, tiponegocio, zona, categoria, siminternet, modalidad,
            longitud, latitud, activosfijos
        ];

        // Si la fecha existe, la agregamos
        if (fecha) {
            campos.push("fecha");
            valores.push(fecha);
        }

        // Construir consulta SQL dinámica
        let setQuery = campos.map((campo, index) => `${campo} = $${index + 1}`).join(", ");
        let query = `UPDATE corresponsales SET ${setQuery} WHERE id = $${valores.length + 1} RETURNING *;`;

        valores.push(id);

        const result = await pool.query(query, valores);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Corresponsal no encontrado' });
        }

        res.status(200).json({ message: 'Corresponsal actualizado', corresponsal: result.rows[0] });

    } catch (error) {
        console.error('Error al actualizar corresponsal:', error);
        res.status(500).json({ error: 'Error al actualizar corresponsal', details: error.message });
    }
});

module.exports = router;