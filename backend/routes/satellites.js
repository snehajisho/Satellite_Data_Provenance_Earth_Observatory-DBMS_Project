const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/satellites - List all satellites
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                satellite_id,
                satellite_name,
                launch_date,
                orbit_type,
                orbit_altitude_km,
                status
            FROM SATELLITE
            ORDER BY satellite_id
        `);

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching satellites:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch satellites'
        });
    }
});

// GET /api/satellites/:id - Get one satellite by ID
router.get('/:id', async (req, res) => {
    const satelliteId = Number(req.params.id);

    if (!Number.isInteger(satelliteId) || satelliteId < 1) {
        return res.status(400).json({
            success: false,
            message: 'Satellite ID must be a positive integer'
        });
    }

    try {
        const [rows] = await pool.execute(
            `SELECT satellite_id, satellite_name, launch_date,
                    orbit_type, orbit_altitude_km, status
             FROM SATELLITE
             WHERE satellite_id = ?`,
            [satelliteId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Satellite not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching satellite:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch satellite'
        });
    }
});

module.exports = router;
