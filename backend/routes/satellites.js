const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('./authMiddleware');

// GET all satellites
// Both USER and ADMIN can view satellites after logging in.
router.get('/', requireAuth, async (req, res) => {
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

// GET one satellite by ID
// Both USER and ADMIN can view a satellite after logging in.
router.get('/:id', requireAuth, async (req, res) => {
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

// POST create a satellite
// Creating records is prohibited for both USER and ADMIN.
router.post('/', requireAuth, (req, res) => {
    res.status(403).json({
        success: false,
        message: 'Creating satellite records is not permitted'
    });
});

// PUT update an existing satellite
// Only ADMIN can edit satellite records.
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const satelliteId = Number(req.params.id);

    if (!Number.isInteger(satelliteId) || satelliteId < 1) {
        return res.status(400).json({
            success: false,
            message: 'Satellite ID must be a positive integer'
        });
    }

    const {
        satellite_name,
        launch_date,
        orbit_type,
        orbit_altitude_km,
        status
    } = req.body;

    if (
        typeof satellite_name !== 'string' || !satellite_name.trim() ||
        !launch_date ||
        typeof orbit_type !== 'string' || !orbit_type.trim() ||
        orbit_altitude_km === undefined ||
        orbit_altitude_km === null ||
        !Number.isFinite(Number(orbit_altitude_km)) ||
        typeof status !== 'string' || !status.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: 'Provide satellite_name, launch_date, orbit_type, numeric orbit_altitude_km and status'
        });
    }

    try {
        const [result] = await pool.execute(
            `UPDATE SATELLITE
             SET satellite_name = ?,
                 launch_date = ?,
                 orbit_type = ?,
                 orbit_altitude_km = ?,
                 status = ?
             WHERE satellite_id = ?`,
            [
                satellite_name.trim(),
                launch_date,
                orbit_type.trim(),
                Number(orbit_altitude_km),
                status.trim(),
                satelliteId
            ]
        );

        if (result.affectedRows === 0) {
            const [rows] = await pool.execute(
                'SELECT satellite_id FROM SATELLITE WHERE satellite_id = ?',
                [satelliteId]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Satellite not found'
                });
            }
        }

        res.json({
            success: true,
            message: 'Satellite updated successfully',
            satellite_id: satelliteId
        });
    } catch (error) {
        console.error('Error updating satellite:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to update satellite'
        });
    }
});

// DELETE a satellite
// Only ADMIN can delete satellite records.
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const satelliteId = Number(req.params.id);

    if (!Number.isInteger(satelliteId) || satelliteId < 1) {
        return res.status(400).json({
            success: false,
            message: 'Satellite ID must be a positive integer'
        });
    }

    try {
        const [result] = await pool.execute(
            'DELETE FROM SATELLITE WHERE satellite_id = ?',
            [satelliteId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Satellite not found'
            });
        }

        res.json({
            success: true,
            message: 'Satellite deleted successfully',
            satellite_id: satelliteId
        });
    } catch (error) {
        console.error('Error deleting satellite:', error.message);

        const isForeignKeyError =
            error.code === 'ER_ROW_IS_REFERENCED_2' ||
            error.code === 'ER_ROW_IS_REFERENCED';

        res.status(isForeignKeyError ? 409 : 500).json({
            success: false,
            message: isForeignKeyError
                ? 'Cannot delete this satellite because related records exist'
                : 'Failed to delete satellite'
        });
    }
});

module.exports = router;
