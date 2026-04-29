import React from 'react';
import '../styles/App.css';

function PodCard({ pod }) {
  return (
    <div className="pod-card">
      <h3>{pod.pod_name}</h3>
      <p>Goal: ₹{pod.goal_amount}</p>
      <p>Members: {pod.members_count}</p>
    </div>
  );
}

export default PodCard;
