import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getBalance, depositMoney, transferMoney } from '../services/api';
import StellarCard from '../components/StellarCard';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [transferData, setTransferData] = useState({ toUserId: '', amount: '' });

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await getBalance();
      setBalance(response.data.balance);
    } catch (err) {
      console.error('Failed to fetch balance', err);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) return;
    try {
      await depositMoney(parseFloat(depositAmount));
      await fetchBalance();
      setDepositAmount('');
      alert('Deposit successful!');
    } catch (err) {
      alert('Deposit failed');
    }
  };

  const handleTransfer = async () => {
    try {
      await transferMoney(
        parseInt(transferData.toUserId, 10),
        parseFloat(transferData.amount),
        'P2P Transfer'
      );
      await fetchBalance();
      setTransferData({ toUserId: '', amount: '' });
      alert('Transfer successful!');
    } catch (err) {
      alert('Transfer failed');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}! 🌟</h1>
        <p>Your Stellar Level: <strong>{user?.stellar_level?.toUpperCase()}</strong></p>
      </div>

      <div className="dashboard-grid">
        <div className="card-section">
          <h2>Your Stellar Card</h2>
          <StellarCard level={user?.stellar_level} balance={balance} />
        </div>

        <div className="balance-section">
          <h2>Account Balance</h2>
          <div className="balance-display">
            <h1>₹{balance.toFixed(2)}</h1>
            <p>Available Balance</p>
          </div>
        </div>

        <div className="actions-section">
          <h2>Quick Actions</h2>

          <div className="action-card">
            <h3>💰 Deposit Money</h3>
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={handleDeposit}>Deposit</button>
          </div>

          <div className="action-card">
            <h3>➡️ Transfer Money</h3>
            <input
              type="number"
              placeholder="User ID"
              value={transferData.toUserId}
              onChange={(e) => setTransferData({ ...transferData, toUserId: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferData.amount}
              onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
            />
            <button onClick={handleTransfer}>Transfer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
