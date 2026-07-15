import React, { useState, useEffect } from 'react';
import Sidebar from '../layouts/Sidebar';
import { FaTicketAlt, FaQrcode, FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import api from '../services/api';
import './AdminBookingManagement.css';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // QR Verify panel states
  const [scanCode, setScanCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/bookings');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleVerifyQR = async (e) => {
    e.preventDefault();
    setVerifyError('');
    setVerificationResult(null);
    if (!scanCode.trim()) return;

    setVerifying(true);
    try {
      const response = await api.post('/bookings/verify-qr', { bookingId: scanCode });
      if (response.data.success) {
        setVerificationResult(response.data.details);
      }
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Verification failed. Invalid booking ticket.');
    } finally {
      setVerifying(false);
    }
  };

  const handleQuickVerifySelect = (bookingId) => {
    setScanCode(bookingId);
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />

      <main className="admin-content-pane">
        <div className="pane-header-flex">
          <h2>Booking Log & QR Entry Gate</h2>
        </div>

        {/* QR Entry Gate Simulation Widget */}
        <section className="qr-gate-section glass-card">
          <div className="qr-gate-title">
            <FaQrcode />
            <h3>Entrance Verification Gate</h3>
          </div>
          <p className="gate-desc">Type a Booking ID (e.g. DE-YYYYMMDD-XXXX) or choose from the recent bookings below to simulate scanning a ticket QR Code.</p>

          <form onSubmit={handleVerifyQR} className="qr-gate-form">
            <input 
              type="text" 
              className="form-control gate-input" 
              placeholder="Enter Booking ID (e.g. DE-20260715-1836)" 
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={verifying}>
              {verifying ? 'Scanning...' : 'Verify Entry'}
            </button>
          </form>

          {verifyError && (
            <div className="verification-alert error">
              <FaTimesCircle className="alert-icon" />
              <div>
                <h4>Ticket Denied</h4>
                <p>{verifyError}</p>
              </div>
            </div>
          )}

          {verificationResult && (
            <div className="verification-alert success">
              <FaCheckCircle className="alert-icon" />
              <div className="verification-details-grid">
                <h4>Entry Approved!</h4>
                <p><strong>Devotee:</strong> {verificationResult.devotee}</p>
                <p><strong>Temple:</strong> {verificationResult.templeName}</p>
                <p><strong>Time Slot:</strong> {verificationResult.date} ({verificationResult.time})</p>
                <p><strong>Pilgrims count:</strong> {verificationResult.persons} Person(s)</p>
                <p><strong>Status:</strong> {verificationResult.status} ({verificationResult.payment})</p>
              </div>
            </div>
          )}
        </section>

        {/* Bookings List Table */}
        {loading ? (
          <div className="text-center" style={{ marginTop: '5rem' }}>
            <FaSpinner className="spinner-icon loading" />
            <p>Fetching bookings log...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '3rem' }}>
            <p>No bookings have been made in the system yet.</p>
          </div>
        ) : (
          <div className="admin-table-card glass-card">
            <h3>Registered Devotee Passes</h3>
            <div className="admin-table-wrapper">
              <table className="admin-dash-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Devotee Name</th>
                    <th>Temple Name</th>
                    <th>Slot Date / Time</th>
                    <th>Pilgrims</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td className="mono-id">{b.bookingId}</td>
                      <td>{b.userName}</td>
                      <td>{b.templeName}</td>
                      <td>{b.date} ({b.time})</td>
                      <td>{b.persons.length} Person(s)</td>
                      <td>₹{b.totalAmount}</td>
                      <td style={{ fontWeight: 'bold', color: b.bookingStatus === 'Confirmed' ? '#2f855a' : '#e53e3e' }}>
                        {b.bookingStatus}
                      </td>
                      <td>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleQuickVerifySelect(b.bookingId)}
                        >
                          Select for Gate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBookingManagement;
