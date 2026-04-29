const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// CHECK ELIGIBILITY
router.get('/eligibility', auth, async (req, res) => {
    try {
        const userResult = await db.query(
            'SELECT credit_score FROM users WHERE id = $1',
            [req.userId]
        );
        
        const creditScore = userResult.rows[0].credit_score;
        
        // Simple AI logic
        let eligible = false;
        let maxAmount = 0;
        let interestRate = 0;
        
        if (creditScore >= 300 && creditScore < 500) {
            eligible = true;
            maxAmount = 50000;
            interestRate = 12;
        } else if (creditScore >= 500 && creditScore < 700) {
            eligible = true;
            maxAmount = 200000;
            interestRate = 10;
        } else if (creditScore >= 700) {
            eligible = true;
            maxAmount = 1000000;
            interestRate = 8;
        }
        
        res.json({ 
            eligible, 
            maxAmount, 
            interestRate,
            yourCreditScore: creditScore
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REQUEST LOAN
router.post('/request', auth, async (req, res) => {
    try {
        const { amount, description } = req.body;
        
        // Get available borrowers (users with balance to lend)
        const lendersResult = await db.query(
            `SELECT u.id, u.name, a.balance 
             FROM users u 
             JOIN accounts a ON u.id = a.user_id 
             WHERE a.balance >= $1 AND u.id != $2 
             ORDER BY a.balance DESC LIMIT 5`,
            [amount, req.userId]
        );
        
        // Create loan request
        const loanResult = await db.query(
            `INSERT INTO loans (borrower_id, amount, status) 
             VALUES ($1, $2, 'pending') 
             RETURNING *`,
            [req.userId, amount]
        );
        
        res.json({ 
            success: true, 
            loan: loanResult.rows[0],
            availableLenders: lendersResult.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LEND MONEY
router.post('/lend', auth, async (req, res) => {
    try {
        const { borrowerId, amount, interestRate } = req.body;
        
        // Check lender balance
        const lenderBalance = await db.query(
            'SELECT balance FROM accounts WHERE user_id = $1',
            [req.userId]
        );
        
        if (lenderBalance.rows[0].balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        
        // Deduct from lender
        await db.query(
            'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
            [amount, req.userId]
        );
        
        // Add to borrower
        await db.query(
            'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
            [amount, borrowerId]
        );
        
        // Create loan record
        const loanResult = await db.query(
            `INSERT INTO loans (lender_id, borrower_id, amount, interest_rate, status) 
             VALUES ($1, $2, $3, $4, 'active') 
             RETURNING *`,
            [req.userId, borrowerId, amount, interestRate]
        );
        
        // Increase lender's credit score
        await db.query(
            'UPDATE users SET credit_score = credit_score + 10 WHERE id = $1',
            [req.userId]
        );
        
        res.json({ success: true, loan: loanResult.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REPAY LOAN
router.post('/repay', auth, async (req, res) => {
    try {
        const { loanId } = req.body;
        
        const loanResult = await db.query(
            'SELECT * FROM loans WHERE id = $1',
            [loanId]
        );
        
        const loan = loanResult.rows[0];
        const totalRepayment = parseFloat(loan.amount) + 
                              (parseFloat(loan.amount) * loan.interest_rate / 100);
        
        // Deduct from borrower
        await db.query(
            'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
            [totalRepayment, req.userId]
        );
        
        // Add to lender
        await db.query(
            'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2',
            [totalRepayment, loan.lender_id]
        );
        
        // Mark loan as repaid
        await db.query(
            'UPDATE loans SET status = $1 WHERE id = $2',
            ['repaid', loanId]
        );
        
        // Increase borrower's credit score
        await db.query(
            'UPDATE users SET credit_score = credit_score + 15 WHERE id = $1',
            [req.userId]
        );
        
        res.json({ success: true, message: 'Loan repaid successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
