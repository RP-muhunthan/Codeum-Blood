# SmartVault Backend

A full-featured P2P lending and savings platform backend built with Node.js, Express, and PostgreSQL.

## Features

- **User Management**: Registration, login, and profile management with JWT authentication
- **Account Management**: Deposit and transfer money between accounts
- **P2P Lending**: Request loans, lend money, and repay loans with interest
- **Savings Pods**: Create and join group savings goals with other users
- **Leaderboards**: Track top savers and lenders in the community
- **Credit Scoring**: Automatic credit score calculations based on lending behavior

## Project Structure

```
smartvault-backend/
├── server.js                 # Main entry point
├── package.json             # Project dependencies
├── .env                     # Environment variables
├── config/
│   └── database.js          # PostgreSQL connection
├── routes/
│   ├── users.js            # User authentication & profile
│   ├── accounts.js         # Account operations
│   ├── loans.js            # P2P lending operations
│   ├── pods.js             # Savings pods management
│   └── leaderboard.js      # Rankings endpoints
├── middleware/
│   └── auth.js             # JWT authentication middleware
└── utils/
    ├── loanEligibility.js  # Loan eligibility calculations
    └── notifications.js    # Alert notifications
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartvault
JWT_SECRET=your_super_secret_key_123
PORT=5000
```

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (requires auth)

### Accounts
- `GET /api/accounts/balance` - Get account balance (requires auth)
- `POST /api/accounts/deposit` - Deposit money (requires auth)
- `POST /api/accounts/transfer` - Transfer to another user (requires auth)

### Loans
- `GET /api/loans/eligibility` - Check loan eligibility (requires auth)
- `POST /api/loans/request` - Request a loan (requires auth)
- `POST /api/loans/lend` - Offer a loan (requires auth)
- `POST /api/loans/repay` - Repay a loan (requires auth)

### Pods
- `POST /api/pods/create` - Create a savings pod (requires auth)
- `POST /api/pods/join` - Join a savings pod (requires auth)
- `GET /api/pods/all` - Get all available pods (requires auth)

### Leaderboard
- `GET /api/leaderboard/top-savers` - Top 10 savers
- `GET /api/leaderboard/top-lenders` - Top 10 lenders

## Database Schema

The backend automatically creates the following tables:
- `users` - User accounts with credit scores
- `accounts` - User financial accounts
- `loans` - P2P loan records
- `pods` - Savings group information
- `pod_members` - Pod membership details
- `transactions` - Transaction history

## Testing

Health check endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"SmartVault Backend Running ✅"}
```

## Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Real-time**: Socket.io
- **Development**: Nodemon

## Requirements

- Node.js 14+
- PostgreSQL 12+
- npm or yarn

## License

ISC

## Author

SmartVault Development Team
