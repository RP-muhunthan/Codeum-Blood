const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/pods', require('./routes/pods'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'SmartVault Backend Running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 SmartVault Backend on http://localhost:${PORT}`);
});

module.exports = app;
