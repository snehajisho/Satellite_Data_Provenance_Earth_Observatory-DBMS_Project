const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Register a regular user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Username, email, and password are required'
            });
        }

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO USERS (username, email, password_hash, role)
            VALUES (?, ?, ?, 'USER')
        `;

        const [result] = await pool.query(sql, [
            username,
            email,
            passwordHash
        ]);

        res.status(201).json({
            message: 'Registration successful',
            user_id: result.insertId,
            username,
            email,
            role: 'USER'
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Email is already registered'
            });
        }

        console.error('Registration error:', err.message);
        res.status(500).json({
            error: 'Unable to register user'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const [results] = await pool.query(
            `SELECT user_id, username, email, password_hash, role
             FROM USERS
             WHERE email = ? AND is_active = TRUE`,
            [email]
        );

        if (results.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const user = results[0];
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({
                error: 'Authentication is not configured'
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({
            error: 'Unable to log in'
        });
    }
});

module.exports = router;
