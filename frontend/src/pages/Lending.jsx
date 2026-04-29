import React, { useState, useEffect } from 'react';
import { checkLoanEligibility, lendMoney, getAllPods } from '../services/api';
import '../styles/Lending.css';

function Lending() {
  const [eligibility, setEligibility] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    checkEligibility();
    fetchBorrowers();
  }, []);

  const checkEligibility = async () => {
    try {
      const response = await checkLoanEligibility();
      setEligibility(response.data);
    } catch (err) {
      console.error('Failed to check eligibility', err);
    }
  };

  const fetchBorrowers = async () => {
    try {
      const response = await getAllPods();
      setBorrowers(response.data);
    } catch (err) {
      console.error('Failed to fetch borrowers', err);
    }
  };

  const handleLend = async (borrowerId) => {
    try {
      await lendMoney(borrowerId, parseFloat(loanAmount), 10);
      alert('Loan given successfully!');
      setLoanAmount('');
      checkEligibility();
    } catch (err) {
      alert('Lending failed');
    }
  };

  return (
    <div className="lending-page">
      <h1>💰 P2P Lending Marketplace</h1>

      {eligibility && (
        <div className="eligibility-card">
          <h2>Your Loan Status</h2>
          <p>Credit Score: <strong>{eligibility.yourCreditScore}</strong></p>
          <p>Eligible: <strong>{eligibility.eligible ? '✅ Yes' : '❌ No'}</strong></p>
          <p>Max Amount: <strong>₹{eligibility.maxAmount?.toLocaleString()}</strong></p>
          <p>Interest Rate: <strong>{eligibility.interestRate}%</strong></p>
        </div>
      )}

      <div className="lend-section">
        <h2>Lend Your Money</h2>
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <p className="info">Earn interest by lending to verified borrowers</p>
      </div>

      <div className="borrowers-section">
        <h2>Available Borrowers</h2>
        <div className="borrowers-grid">
          {borrowers.length > 0 ? (
            borrowers.map((borrower) => (
              <div key={borrower.id} className="borrower-card">
                <h3>{borrower.pod_name}</h3>
                <p>Goal: ₹{borrower.goal_amount}</p>
                <p>Members: {borrower.members_count}</p>
                <button onClick={() => handleLend(borrower.creator_id)}>Lend Now</button>
              </div>
            ))
          ) : (
            <p>No borrowers available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lending;
