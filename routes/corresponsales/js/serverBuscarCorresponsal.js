const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('../../../database/conexion'); // Importa la conexión

const router = express.Router(); // Inicializa el router

// Middleware
router.use(cors());
router.use(express.json());

// Ruta para buscar corresponsales en la base de datos
router.get('/buscar-corresponsal', async (req, res) => {
    try {
        const filtros = req.query; // Recibir filtros de la URL
        let query = 'SELECT * FROM corresponsales WHERE 1=1';
        let params = [];

        // Lista de campos permitidos para la búsqueda
        const campos = [
            'nombrecorresponsal', 'imeiacercademac', 'codigoseta', 'tecnologia', 'cedula', 'municipio',
            'codigodane', 'codigopostal', 'lider', 'estado', 'nombrecompleto', 'telefono', 'correo',
            'direccion', 'tiponegocio', 'zona', 'categoria', 'siminternet', 'modalidad', 'fecha',
            'longitud', 'latitud', 'activosfijos'
        ];

        // Si el campo fecha existe y NO está vacío, hacer la validación
        if (filtros.fecha && filtros.fecha.trim() !== '') {
            const fecha = filtros.fecha.trim();
            let fechaValida = false;

            // Si es solo el año (aaaa), buscamos todo el año
            if (/^\d{4}$/.test(fecha)) {
                query += ` AND EXTRACT(YEAR FROM fecha) = $${params.length + 1}`;
                fechaValida = true;
                params.push(fecha); // Agregar solo el año
            }
            // Si es el año y mes (aaaa-mm), buscamos todo el mes
            else if (/^\d{4}-\d{2}$/.test(fecha)) {
                query += ` AND EXTRACT(YEAR FROM fecha) = $${params.length + 1} AND EXTRACT(MONTH FROM fecha) = $${params.length + 2}`;
                fechaValida = true;
                params.push(fecha.split('-')[0]); // Año
                params.push(fecha.split('-')[1]); // Mes
            }
            // Si es el año, mes y día (aaaa-mm-dd), buscamos la fecha exacta
            else if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                query += ` AND fecha::date = $${params.length + 1}`;
                fechaValida = true;
                params.push(fecha); // Agregar fecha completa
            }

            // Si la fecha no es válida, retornar un error
            if (!fechaValida) {
                return res.status(400).json({
                    error: "Por favor ingresa una fecha válida en formato 'YYYY', 'YYYY-MM' o 'YYYY-MM-DD'."
                });
            }
        }

        // Agregar otros filtros dinámicos (excepto fecha)
        campos.forEach((campo) => {
            if (campo !== 'fecha' && filtros[campo] && filtros[campo].trim() !== '') {
                params.push(`%${filtros[campo]}%`);
                query += ` AND ${campo} ILIKE $${params.length}`;
            }
        });

        // Ejecutar la consulta con los parámetros
        const result = await pool.query(query, params);
        console.log('Resultados de la consulta:', result.rows);
        res.json(result.rows); // Enviar resultados al frontend
    } catch (error) {
        console.error('Error en la búsqueda de corresponsales:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;