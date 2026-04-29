import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.phone, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🌟 SmartVault</h1>
        <p>Join the Financial Revolution</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p>
          Already have account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
