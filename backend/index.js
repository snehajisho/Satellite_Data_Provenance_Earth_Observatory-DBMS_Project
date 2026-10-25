require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import routes
const satellitesRouter = require('./routes/satellites');
const observationsRouter = require('./routes/observations');
const provenanceRouter = require('./routes/provenance');

// Health check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.json({
            success: true,
            message: 'API and MySQL connection are working'
        });
    } catch (error) {
        console.error('Database health check failed:', error.message);

        res.status(500).json({
            success: false,
            message: 'API is running, but the database connection failed'
        });
    }
});

// Satellite endpoints
app.use('/api/satellites', satellitesRouter);

// Observation endpoints
app.use('/api/observations', observationsRouter);

// Provenance endpoints
app.use('/api/provenance', provenanceRouter);

// Handle unknown endpoints
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Satellite API running at http://localhost:${PORT}`);
});