const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../../database/conexion'); // Importa la conexión

const router = express.Router(); // Inicializa el router

// Middleware
router.use(cors());
router.use(express.json());

// Ruta para buscar corresponsales en la base de datos
router.get('/buscar-corresponsal-retirado', async (req, res) => {
    try {
        const filtros = req.query; // Recibir filtros de la URL
        let query = 'SELECT * FROM corresponsalesretirados WHERE 1=1';
        let params = [];

        // Lista de campos permitidos para la búsqueda
        const campos = [
            'nombrecorresponsal', 'imeiacercademac', 'codigoseta', 'tecnologia', 'cedula', 'municipio',
            'codigodane', 'codigopostal', 'lider', 'estado', 'nombrecompleto', 'telefono', 'correo',
            'direccion', 'tiponegocio', 'zona', 'categoria', 'siminternet', 'modalidad', 'fecha',
            'longitud', 'latitud', 'activosfijos', 'fecharetiro', 'personaretira', 'comentario'
        ];

        // Función para agregar filtros de fecha o fecharetiro
        const agregarFiltroFecha = (campo, valor) => {
            let fechaValida = false;

            if (/^\d{4}$/.test(valor)) {
                query += ` AND EXTRACT(YEAR FROM ${campo}) = $${params.length + 1}`;
                fechaValida = true;
                params.push(valor);
            } else if (/^\d{4}-\d{2}$/.test(valor)) {
                query += ` AND EXTRACT(YEAR FROM ${campo}) = $${params.length + 1} AND EXTRACT(MONTH FROM ${campo}) = $${params.length + 2}`;
                fechaValida = true;
                params.push(valor.split('-')[0]); // Año
                params.push(valor.split('-')[1]); // Mes
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
                query += ` AND ${campo}::date = $${params.length + 1}`;
                fechaValida = true;
                params.push(valor);
            }

            return fechaValida;
        };

        // Validar y agregar filtros para 'fecha'
        if (filtros.fecha && filtros.fecha.trim() !== '') {
            const fecha = filtros.fecha.trim();
            if (!agregarFiltroFecha('fecha', fecha)) {
                return res.status(400).json({
                    error: "Formato de fecha inválido. Usa 'YYYY', 'YYYY-MM' o 'YYYY-MM-DD'."
                });
            }
        }

        // Validar y agregar filtros para 'fecharetiro'
        if (filtros.fecharetiro && filtros.fecharetiro.trim() !== '') {
            const fecharetiro = filtros.fecharetiro.trim();
            if (!agregarFiltroFecha('fecharetiro', fecharetiro)) {
                return res.status(400).json({
                    error: "Formato de fecharetiro inválido. Usa 'YYYY', 'YYYY-MM' o 'YYYY-MM-DD'."
                });
            }
        }

        // Agregar otros filtros dinámicos (excepto fechas)
        campos.forEach((campo) => {
            if (!['fecha', 'fecharetiro'].includes(campo) && filtros[campo] && filtros[campo].trim() !== '') {
                params.push(`%${filtros[campo]}%`);
                query += ` AND ${campo} ILIKE $${params.length}`;
            }
        });

        // Ejecutar la consulta con los parámetros
        const result = await pool.query(query, params);
        console.log('Resultados de la consulta:', result.rows);
        res.json(result.rows); // Enviar resultados al frontend
    } catch (error) {
        console.error('Error en la búsqueda de corresponsales retirados:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;