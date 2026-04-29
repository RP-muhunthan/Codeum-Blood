import React from 'react';
import '../styles/App.css';

function TransactionItem({ transaction }) {
  return (
    <div className="transaction-item">
      <span>{transaction.type}</span>
      <strong>₹{transaction.amount}</strong>
      <small>{transaction.created_at}</small>
    </div>
  );
}

export default TransactionItem;
