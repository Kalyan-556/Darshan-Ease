import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaOm } from 'react-icons/fa';
import './Auth.css';

const Signup = () => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default is pilgrim/devotee
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const result = await signup(name, email, phone, password, role);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <FaOm className="auth-logo" />
          <h2>Create Account</h2>
          <p>Register to schedule your temple darshan tickets</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="auth-input-wrapper">
              <FaUser className="auth-field-icon" />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="auth-input-wrapper">
              <FaEnvelope className="auth-field-icon" />
              <input 
                type="email" 
                className="form-control" 
                placeholder="devotee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="auth-input-wrapper">
              <FaPhone className="auth-field-icon" />
              <input 
                type="tel" 
                className="form-control" 
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Register As</label>
            <div className="role-select-group">
              <label className={`role-radio-label ${role === 'USER' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="USER" checked={role === 'USER'} onChange={() => setRole('USER')} />
                <span>Devotee</span>
              </label>
              <label className={`role-radio-label ${role === 'ORGANIZER' ? 'selected' : ''}`}>
                <input type="radio" name="role" value="ORGANIZER" checked={role === 'ORGANIZER'} onChange={() => setRole('ORGANIZER')} />
                <span>Organizer</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-field-icon" />
              <input 
                type="password" 
                className="form-control" 
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-field-icon" />
              <input 
                type="password" 
                className="form-control" 
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
