const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET LEADERBOARD
router.get('/top-savers', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT u.id, u.name, a.balance, u.stellar_level
             FROM users u
             JOIN accounts a ON u.id = a.user_id
             ORDER BY a.balance DESC
             LIMIT 10`
        );
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET TOP LENDERS
router.get('/top-lenders', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT u.id, u.name, COUNT(l.id) as loans_given, SUM(l.amount) as total_lent
             FROM users u
             LEFT JOIN loans l ON u.id = l.lender_id AND l.status = 'active'
             GROUP BY u.id
             ORDER BY total_lent DESC
             LIMIT 10`
        );
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
