const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('./authMiddleware');

// GET all observations
// Both USER and ADMIN can view observations, but must be logged in.
router.get('/', requireAuth, async (req, res) => {
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
// Both USER and ADMIN can view an observation.
router.get('/:id', requireAuth, async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: 'Observation ID must be a positive integer'
        });
    }

    try {
        const [rows] = await pool.execute(`
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
        `, [id]);

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

// POST create an observation
// Nobody, including ADMIN, is allowed to create observation records.
router.post('/', requireAuth, (req, res) => {
    res.status(403).json({
        success: false,
        message: 'Creating observation records is not permitted'
    });
});

// PUT update an observation
// Only ADMIN can edit existing observations.
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: 'Observation ID must be a positive integer'
        });
    }

    const {
        sensor_id,
        ground_station_id,
        geo_location_id,
        observation_start,
        observation_end,
        orbit_number,
        cloud_cover_percent,
        observation_status
    } = req.body;

    const sensorId = Number(sensor_id);
    const groundStationId = Number(ground_station_id);
    const locationId = Number(geo_location_id);
    const orbitNumber = Number(orbit_number);
    const cloudCover = Number(cloud_cover_percent);

    if (
        !Number.isInteger(sensorId) || sensorId < 1 ||
        !Number.isInteger(groundStationId) || groundStationId < 1 ||
        !Number.isInteger(locationId) || locationId < 1 ||
        !observation_start ||
        orbit_number === undefined || orbit_number === null ||
        cloud_cover_percent === undefined || cloud_cover_percent === null ||
        !observation_status
    ) {
        return res.status(400).json({
            success: false,
            message: 'Provide all required observation fields'
        });
    }

    if (!Number.isFinite(orbitNumber) || !Number.isFinite(cloudCover)) {
        return res.status(400).json({
            success: false,
            message: 'Orbit number and cloud cover must be numeric'
        });
    }

    try {
        const [result] = await pool.execute(`
            UPDATE OBSERVATION
            SET sensor_id = ?,
                ground_station_id = ?,
                geo_location_id = ?,
                observation_start = ?,
                observation_end = ?,
                orbit_number = ?,
                cloud_cover_percent = ?,
                observation_status = ?
            WHERE observation_id = ?
        `, [
            sensorId,
            groundStationId,
            locationId,
            observation_start,
            observation_end || null,
            orbitNumber,
            cloudCover,
            observation_status,
            id
        ]);

        if (result.affectedRows === 0) {
            const [rows] = await pool.execute(
                'SELECT observation_id FROM OBSERVATION WHERE observation_id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Observation not found'
                });
            }
        }

        res.json({
            success: true,
            message: 'Observation updated successfully',
            observation_id: id
        });
    } catch (error) {
        console.error('Error updating observation:', error.message);

        const status =
            error.sqlState === '45000' ? 400 :
            error.code === 'ER_NO_REFERENCED_ROW_2' ? 400 : 500;

        res.status(status).json({
            success: false,
            message: error.sqlMessage || 'Failed to update observation'
        });
    }
});

// DELETE an observation
// Only ADMIN can delete observations.
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: 'Observation ID must be a positive integer'
        });
    }

    try {
        const [result] = await pool.execute(
            'DELETE FROM OBSERVATION WHERE observation_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Observation not found'
            });
        }

        res.json({
            success: true,
            message: 'Observation deleted successfully',
            observation_id: id
        });
    } catch (error) {
        console.error('Error deleting observation:', error.message);

        const isForeignKeyError =
            error.code === 'ER_ROW_IS_REFERENCED_2' ||
            error.code === 'ER_ROW_IS_REFERENCED';

        res.status(isForeignKeyError ? 409 : 500).json({
            success: false,
            message: isForeignKeyError
                ? 'Cannot delete this observation because related records exist'
                : 'Failed to delete observation'
        });
    }
});

module.exports = router;
