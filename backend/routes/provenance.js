const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('./authMiddleware');

// GET processing history for a data product
// Login is required to view provenance.
router.get('/:id', requireAuth, async (req, res) => {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId < 1) {
        return res.status(400).json({
            success: false,
            message: 'Data product ID must be a positive integer'
        });
    }

    try {
        const [rows] = await pool.query(`
            SELECT
                pa.activity_id,
                pa.processing_type,
                pa.software_name,
                pa.parameters,
                pa.started_at,
                pa.completed_at,
                pa.status,
                ip.product_id AS input_product_id,
                ip.product_name AS input_product_name,
                op.product_id AS output_product_id,
                op.product_name AS output_product_name
            FROM PROCESSING_ACTIVITY pa
            JOIN DATA_PRODUCT ip
                ON pa.input_product_id = ip.product_id
            JOIN DATA_PRODUCT op
                ON pa.output_product_id = op.product_id
            WHERE pa.input_product_id = ?
               OR pa.output_product_id = ?
            ORDER BY pa.started_at
        `, [productId, productId]);

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching provenance:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch processing provenance'
        });
    }
});

module.exports = router;
