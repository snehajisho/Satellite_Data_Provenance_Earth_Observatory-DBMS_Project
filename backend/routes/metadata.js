const express = require('express');
const router = express.Router();
const connectMongo = require('../mongo');

// GET /api/metadata
// Return all observation metadata
router.get('/', async (req, res) => {
    try {
        const db = await connectMongo();

        const documents = await db
            .collection('observation_metadata')
            .find({})
            .project({ _id: 0 })
            .toArray();

        res.json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        console.error('Error fetching MongoDB metadata:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch observation metadata'
        });
    }
});


// GET /api/metadata/:id
// Return metadata for one observation
router.get('/:id', async (req, res) => {
    const observationId = Number(req.params.id);

    if (!Number.isInteger(observationId) || observationId < 1) {
        return res.status(400).json({
            success: false,
            message: 'Observation ID must be a positive integer'
        });
    }

    try {
        const db = await connectMongo();

        const document = await db
            .collection('observation_metadata')
            .findOne(
                { observation_id: observationId },
                { projection: { _id: 0 } }
            );

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Observation metadata not found'
            });
        }

        res.json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error('Error fetching MongoDB metadata:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch observation metadata'
        });
    }
});


// GET /api/metadata/search?location=Berlin
// Search observation metadata by geographic area
router.get('/search/location', async (req, res) => {
    const location = req.query.location?.trim();

    if (!location) {
        return res.status(400).json({
            success: false,
            message: 'Location is required'
        });
    }

    try {
        const db = await connectMongo();

        const documents = await db
            .collection('observation_metadata')
            .find({
                'location.area_name': {
                    $regex: location,
                    $options: 'i'
                }
            })
            .project({ _id: 0 })
            .toArray();

        res.json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        console.error('Error searching MongoDB metadata:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to search observation metadata'
        });
    }
});


// GET /api/metadata/satellite/:id
// Return MongoDB metadata for a specific satellite
router.get('/satellite/:id', async (req, res) => {
    const satelliteId = Number(req.params.id);

    if (!Number.isInteger(satelliteId) || satelliteId < 1) {
        return res.status(400).json({
            success: false,
            message: 'Satellite ID must be a positive integer'
        });
    }

    try {
        const db = await connectMongo();

        const documents = await db
            .collection('observation_metadata')
            .find({
                'satellite.satellite_id': satelliteId
            })
            .project({ _id: 0 })
            .toArray();

        res.json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        console.error('Error fetching satellite metadata:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch satellite metadata'
        });
    }
});


module.exports = router;