const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, phone, password, name } = req.body;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const result = await db.query(
            'INSERT INTO users (email, phone, password, name) VALUES ($1, $2, $3, $4) RETURNING id, email, name',
            [email, phone, hashedPassword, name]
        );
        
        // Create account for user
        await db.query(
            'INSERT INTO accounts (user_id, account_type, balance) VALUES ($1, $2, $3)',
            [result.rows[0].id, 'savings', 0]
        );
        
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );
        
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.name, email: user.email, stellar_level: user.stellar_level }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PROFILE
router.get('/profile', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, phone, stellar_level, credit_score FROM users WHERE id = $1',
            [req.userId]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
