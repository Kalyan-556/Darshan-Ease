import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaPrint, FaHistory, FaHome } from 'react-icons/fa';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const handlePrintTicket = () => {
    // Open the raw ticket HTML endpoint in a new window for clean print layouts
    window.open(`http://localhost:5000/api/bookings/ticket/${booking.bookingId}`, '_blank');
  };

  return (
    <div className="booking-success-page container">
      <div className="success-card glass-card text-center">
        <div className="success-icon-wrapper">
          <FaCheckCircle className="check-success-icon" />
        </div>

        <h2>Booking Confirmed!</h2>
        <p className="success-pitch">Your holy darshan passes have been successfully generated and confirmed.</p>

        <div className="success-details-box">
          <div className="s-row">
            <span>Booking ID:</span>
            <strong className="booking-id-hl">{booking.bookingId}</strong>
          </div>
          <div className="s-row">
            <span>Amount Paid:</span>
            <strong>₹{booking.totalAmount}</strong>
          </div>
          <div className="s-row">
            <span>Pilgrim Count:</span>
            <strong>{booking.persons.length} Devotee(s)</strong>
          </div>
          <div className="s-row">
            <span>Payment Status:</span>
            <strong style={{ color: '#2f855a' }}>SUCCESS (Paid)</strong>
          </div>
        </div>

        <div className="success-actions-grid">
          <button onClick={handlePrintTicket} className="btn btn-primary">
            <FaPrint />
            <span>Print E-Ticket</span>
          </button>
          
          <Link to="/profile" className="btn btn-outline">
            <FaHistory />
            <span>Booking History</span>
          </Link>
        </div>

        <div className="success-home-back">
          <Link to="/">
            <FaHome /> <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
