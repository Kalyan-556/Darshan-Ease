import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaTrash, FaClipboardList, FaArrowLeft, FaCheck } from 'react-icons/fa';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import './BookingPage.css';

const BookingPage = () => {
  const { templeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const slotId = searchParams.get('slotId');

  const [temple, setTemple] = useState(null);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Passenger list state
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'Male' }
  ]);

  useEffect(() => {
    if (!slotId) {
      navigate(`/temples/${templeId}`);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const tRes = await api.get(`/temples/${templeId}`);
        if (tRes.data.success) {
          setTemple(tRes.data.temple);
        }

        // Fetch slots and find matching slot
        const sRes = await api.get(`/slots/temple/${templeId}`);
        if (sRes.data.success) {
          const matched = sRes.data.slots.find(s => s._id === slotId);
          if (matched) {
            setSlot(matched);
          } else {
            navigate(`/temples/${templeId}`);
          }
        }
      } catch (err) {
        console.error('Error fetching details for checkout page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [templeId, slotId, navigate]);

  const handleAddPassenger = () => {
    if (passengers.length >= 6) return; // limit to 6 passengers
    setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length === 1) return; // keep at least one
    const list = [...passengers];
    list.splice(index, 1);
    setPassengers(list);
  };

  const handleInputChange = (index, field, value) => {
    const list = [...passengers];
    list[index][field] = value;
    setPassengers(list);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passengers
    for (let p of passengers) {
      if (!p.name.trim() || !p.age) return;
    }

    // Pass details to payment page
    navigate(`/temples/${templeId}/payment`, {
      state: {
        slotId,
        passengers: passengers.map(p => ({ ...p, age: parseInt(p.age) }))
      }
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '3rem' }}>
        <SkeletonLoader type="table" count={1} />
      </div>
    );
  }

  const subtotal = slot ? slot.price * passengers.length : 0;
  const convenienceFee = 25; // fixed processing fee
  const total = subtotal + convenienceFee;

  return (
    <div className="booking-page container">
      <button onClick={() => navigate(-1)} className="back-link-btn">
        <FaArrowLeft /> Back to Slots
      </button>

      <div className="booking-layout">
        {/* Left Form Column */}
        <main className="booking-form-container">
          <div className="booking-form-header">
            <FaClipboardList className="header-icon" />
            <h2>Enter Devotee Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            {passengers.map((passenger, index) => (
              <div key={index} className="passenger-form-card glass-card">
                <div className="card-header-flex">
                  <h4>Devotee #{index + 1}</h4>
                  {passengers.length > 1 && (
                    <button 
                      type="button" 
                      className="btn-remove"
                      onClick={() => handleRemovePassenger(index)}
                    >
                      <FaTrash /> Remove
                    </button>
                  )}
                </div>

                <div className="passenger-inputs-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Name as in Aadhar card"
                      value={passenger.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Age"
                      min="1"
                      max="120"
                      value={passenger.age}
                      onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select 
                      className="form-control" 
                      value={passenger.gender}
                      onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < 6 && (
              <button 
                type="button" 
                className="btn btn-outline btn-add-devotee"
                onClick={handleAddPassenger}
              >
                <FaUserPlus />
                <span>Add Another Devotee (Max 6)</span>
              </button>
            )}

            <button type="submit" className="btn btn-primary proceed-btn">
              <span>Proceed to Payment</span>
              <FaCheck />
            </button>
          </form>
        </main>

        {/* Right Summary Column */}
        <aside className="booking-summary-sidebar">
          <div className="summary-widget glass-card">
            <h3>Darshan Summary</h3>
            <div className="widget-details-list">
              <div className="summary-info-item">
                <span className="info-lbl">Temple</span>
                <span className="info-val">{temple?.name}</span>
              </div>
              <div className="summary-info-item">
                <span className="info-lbl">Date</span>
                <span className="info-val">{slot?.date}</span>
              </div>
              <div className="summary-info-item">
                <span className="info-lbl">Time Slot</span>
                <span className="info-val">{slot?.time}</span>
              </div>
            </div>

            <h3 style={{ marginTop: '25px' }}>Price Breakdown</h3>
            <div className="pricing-details-list">
              <div className="pricing-row">
                <span>Pass Fee (₹{slot?.price} &times; {passengers.length})</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="pricing-row">
                <span>Convenience Charge</span>
                <span>₹{convenienceFee}</span>
              </div>
              <div className="pricing-row grand-total">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPage;
