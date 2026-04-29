const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET BALANCE
router.get('/balance', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT balance FROM accounts WHERE user_id = $1',
            [req.userId]
        );
        
        res.json({ balance: result.rows[0]?.balance || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DEPOSIT
router.post('/deposit', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        
        await db.query(
            'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
            [amount, req.userId]
        );
        
        await db.query(
            'INSERT INTO transactions (from_user, to_user, amount, type) VALUES ($1, $2, $3, $4)',
            [null, req.userId, amount, 'deposit']
        );
        
        const result = await db.query(
            'SELECT balance FROM accounts WHERE user_id = $1',
            [req.userId]
        );
        
        res.json({ success: true, newBalance: result.rows[0].balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TRANSFER
router.post('/transfer', auth, async (req, res) => {
    try {
        const { toUserId, amount, description } = req.body;
        
        // Check balance
        const senderBalance = await db.query(
            'SELECT balance FROM accounts WHERE user_id = $1',
            [req.userId]
        );
        
        if (senderBalance.rows[0].balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        
        // Deduct from sender
        await db.query(
            'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
            [amount, req.userId]
        );
        
        // Add to receiver
        await db.query(
            'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
            [amount, toUserId]
        );
        
        // Record transaction
        await db.query(
            'INSERT INTO transactions (from_user, to_user, amount, type) VALUES ($1, $2, $3, $4)',
            [req.userId, toUserId, amount, 'transfer']
        );
        
        res.json({ success: true, message: 'Transfer successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
