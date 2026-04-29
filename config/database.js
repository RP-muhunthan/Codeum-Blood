const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'smartvault'
});

// Initialize database tables
pool.query(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        stellar_level VARCHAR(50) DEFAULT 'star',
        credit_score INT DEFAULT 300,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Accounts table
    CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        account_type VARCHAR(50),
        balance DECIMAL(15, 2) DEFAULT 0,
        account_number VARCHAR(20) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Loans table
    CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        lender_id INT REFERENCES users(id),
        borrower_id INT REFERENCES users(id),
        amount DECIMAL(15, 2),
        interest_rate DECIMAL(5, 2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Savings Pods table
    CREATE TABLE IF NOT EXISTS pods (
        id SERIAL PRIMARY KEY,
        creator_id INT REFERENCES users(id),
        pod_name VARCHAR(255),
        goal_amount DECIMAL(15, 2),
        current_amount DECIMAL(15, 2) DEFAULT 0,
        members_count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Pod Members table
    CREATE TABLE IF NOT EXISTS pod_members (
        id SERIAL PRIMARY KEY,
        pod_id INT REFERENCES pods(id),
        user_id INT REFERENCES users(id),
        monthly_goal DECIMAL(15, 2),
        contributed DECIMAL(15, 2) DEFAULT 0,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Transactions table
    CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        from_user INT REFERENCES users(id),
        to_user INT REFERENCES users(id),
        amount DECIMAL(15, 2),
        type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`).catch(err => console.log('Tables already created'));

module.exports = pool;
