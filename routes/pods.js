const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// CREATE POD
router.post('/create', auth, async (req, res) => {
    try {
        const { podName, goalAmount } = req.body;
        
        const result = await db.query(
            `INSERT INTO pods (creator_id, pod_name, goal_amount, members_count) 
             VALUES ($1, $2, $3, 1) 
             RETURNING *`,
            [req.userId, podName, goalAmount]
        );
        
        const podId = result.rows[0].id;
        
        // Add creator as member
        await db.query(
            'INSERT INTO pod_members (pod_id, user_id, monthly_goal) VALUES ($1, $2, $3)',
            [podId, req.userId, goalAmount / 12]
        );
        
        res.json({ success: true, pod: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// JOIN POD
router.post('/join', auth, async (req, res) => {
    try {
        const { podId, monthlyGoal } = req.body;
        
        await db.query(
            'INSERT INTO pod_members (pod_id, user_id, monthly_goal) VALUES ($1, $2, $3)',
            [podId, req.userId, monthlyGoal]
        );
        
        await db.query(
            'UPDATE pods SET members_count = members_count + 1 WHERE id = $1',
            [podId]
        );
        
        res.json({ success: true, message: 'Joined pod successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL PODS
router.get('/all', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM pods ORDER BY created_at DESC LIMIT 10'
        );
        
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
