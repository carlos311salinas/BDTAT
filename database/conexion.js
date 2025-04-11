const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SoporteTAT',
    password: 'Manizale$24.',
    port: 5432,
});

module.exports = pool;