const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all observations with satellite, sensor and location details
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                o.*,
                s.satellite_name,
                se.sensor_name,
                g.area_name,
                g.country AS location_country
            FROM OBSERVATION o
            JOIN SENSOR se ON o.sensor_id = se.sensor_id
            JOIN SATELLITE s ON se.satellite_id = s.satellite_id
            JOIN GEO_LOCATION g ON o.geo_location_id = g.geo_location_id
            ORDER BY o.observation_id
        `);

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching observations:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch observations'
        });
    }
});

// GET one observation by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                o.*,
                s.satellite_name,
                se.sensor_name,
                g.area_name,
                g.country AS location_country
            FROM OBSERVATION o
            JOIN SENSOR se ON o.sensor_id = se.sensor_id
            JOIN SATELLITE s ON se.satellite_id = s.satellite_id
            JOIN GEO_LOCATION g ON o.geo_location_id = g.geo_location_id
            WHERE o.observation_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Observation not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching observation:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch observation'
        });
    }
});

module.exports = router;