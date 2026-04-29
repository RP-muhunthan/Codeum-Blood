import React, { useState, useEffect } from 'react';
import { getLeaderboard, getTopLenders } from '../services/api';
import '../styles/Leaderboard.css';

function Leaderboard() {
  const [savers, setSavers] = useState([]);
  const [lenders, setLenders] = useState([]);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      const saversRes = await getLeaderboard();
      const lendersRes = await getTopLenders();
      setSavers(saversRes.data);
      setLenders(lendersRes.data);
    } catch (err) {
      console.error('Failed to fetch leaderboards', err);
    }
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="leaderboard-page">
      <h1>🏆 SmartVault Leaderboard</h1>

      <div className="leaderboard-grid">
        <div className="leaderboard-section">
          <h2>💰 Top Savers</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Balance</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {savers.map((user, index) => (
                <tr key={user.id} className={index < 3 ? 'top-rank' : ''}>
                  <td>{getMedalEmoji(index)}</td>
                  <td>{user.name}</td>
                  <td>₹{user.balance?.toLocaleString()}</td>
                  <td>{user.stellar_level?.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="leaderboard-section">
          <h2>🎯 Top Lenders</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Loans</th>
                <th>Total Lent</th>
              </tr>
            </thead>
            <tbody>
              {lenders.map((user, index) => (
                <tr key={user.id} className={index < 3 ? 'top-rank' : ''}>
                  <td>{getMedalEmoji(index)}</td>
                  <td>{user.name}</td>
                  <td>{user.loans_given || 0}</td>
                  <td>₹{(user.total_lent || 0)?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
