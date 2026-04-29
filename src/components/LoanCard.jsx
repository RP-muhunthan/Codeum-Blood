import React from 'react';
import '../styles/App.css';

function LoanCard({ loan }) {
  return (
    <div className="loan-card">
      <h3>Loan #{loan.id}</h3>
      <p>Amount: ₹{loan.amount}</p>
      <p>Status: {loan.status}</p>
    </div>
  );
}

export default LoanCard;
