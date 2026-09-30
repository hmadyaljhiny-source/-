const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM stations');
    res.json(result.rows);
});

router.post('/', async (req, res) => {
    const {
        name,
        status,
    } = req.body;

    const result = await pool.query(
        'INSERT INTO stations (name, location, status, fuel_type, fuel_quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, location, status, fuel_type, fuel_quantity]
    );

    res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const {
         name,
        status,
    } = req.body;

    const result = await pool.query(
        'UPDATE stations SET name = $1, location = $2, status = $3, fuel_type = $4, fuel_quantity = $5 WHERE id = $6 RETURNING *',
        [name, location, status, fuel_type, fuel_quantity, id]
    );

    res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await pool.query(
        'DELETE FROM stations WHERE id = $1',
        [id]
    );

    res.json({ message: 'تم الحذف' });
});

module.exports = router;