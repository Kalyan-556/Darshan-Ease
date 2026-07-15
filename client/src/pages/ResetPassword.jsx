import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FaLock, FaKey, FaEnvelope, FaOm } from 'react-icons/fa';
import './Auth.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        resetCode,
        newPassword
      });

      if (response.data.success) {
        setSuccess('Password changed successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Check if code is valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <FaOm className="auth-logo" />
          <h2>Reset Password</h2>
          <p>Submit the 6-digit code sent to your email along with your new password</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Reset Code</label>
            <div className="auth-input-wrapper">
              <FaKey className="auth-field-icon" />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter 6-digit code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="auth-input-wrapper">
              <FaLock className="auth-field-icon" />
              <input 
                type="password" 
                className="form-control" 
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
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
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Remembered password? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
