import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container text-center" style={{ padding: '6rem 1.5rem' }}>
      <FaExclamationTriangle style={{ fontSize: '4.5rem', color: 'var(--secondary-dark)', marginBottom: '1.5rem' }} />
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>404 - Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>The spiritual path you requested does not exist or has been relocated.</p>
      <Link to="/" className="btn btn-primary">
        <FaHome />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
