import React from 'react';
import '../styles/StellarCard.css';

function StellarCard({ level = 'star', balance }) {
  const cardDetails = {
    star: { color: '#FFD700', emoji: '⭐', name: 'Star Card', rewards: '2%' },
    supernova: { color: '#C0C0C0', emoji: '✨', name: 'Supernova Card', rewards: '7%' },
    constellation: { color: '#9370DB', emoji: '🌟', name: 'Constellation Card', rewards: '12%' },
    galaxy: { color: '#001a4d', emoji: '🌠', name: 'Galaxy Card', rewards: '20%' },
  };

  const card = cardDetails[level] || cardDetails.star;

  return (
    <div className="stellar-card" style={{ borderColor: card.color }}>
      <div className="card-header" style={{ backgroundColor: card.color }}>
        <span className="card-emoji">{card.emoji}</span>
        <h3>{card.name}</h3>
      </div>

      <div className="card-body">
        <p className="card-number">**** **** **** 8765</p>
        <div className="card-details">
          <div>
            <span className="label">Card Holder</span>
            <p>SmartVault User</p>
          </div>
          <div>
            <span className="label">Cashback</span>
            <p>{card.rewards}</p>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <p>Current Balance: ₹{balance?.toFixed(2)}</p>
        <p className="chip">💳</p>
      </div>
    </div>
  );
}

export default StellarCard;
