import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaExclamationTriangle, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import './SlotSelection.css';

const SlotSelection = () => {
  const { templeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryDate = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tRes = await api.get(`/temples/${templeId}`);
        if (tRes.data.success) {
          setTemple(tRes.data.temple);
        }

        const sRes = await api.get(`/slots/temple/${templeId}?date=${queryDate}`);
        if (sRes.data.success) {
          setSlots(sRes.data.slots);
        }
      } catch (err) {
        console.error('Failed to load slots details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [templeId, queryDate]);

  const handleNext = () => {
    if (!selectedSlotId) return;
    navigate(`/temples/${templeId}/book?slotId=${selectedSlotId}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '3rem' }}>
        <SkeletonLoader type="list" count={1} />
      </div>
    );
  }

  return (
    <div className="slot-selection-page container">
      <Link to={`/temples/${templeId}`} className="back-link">
        <FaArrowLeft /> Back to Temple Details
      </Link>

      <div className="selection-header">
        <h2>Select Darshan Time Slot</h2>
        <p className="temple-subtitle">For {temple?.name} on <strong>{queryDate}</strong></p>
      </div>

      <div className="slots-layout">
        {slots.length === 0 ? (
          <div className="no-slots glass-card text-center">
            <FaExclamationTriangle className="warn-icon" />
            <h3>No Slots Scheduled</h3>
            <p>There are no active darshan sessions scheduled for this date. Please try choosing a different date.</p>
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map(slot => {
              const isSelected = selectedSlotId === slot._id;
              const isFull = slot.availableSeats <= 0 || slot.status === 'Full';
              const isCancelled = slot.status === 'Cancelled';
              
              let slotClass = "slot-tile glass-card";
              if (isSelected) slotClass += " selected";
              if (isFull) slotClass += " full";
              if (isCancelled) slotClass += " cancelled";

              return (
                <div 
                  key={slot._id} 
                  className={slotClass}
                  onClick={() => {
                    if (!isFull && !isCancelled) {
                      setSelectedSlotId(slot._id);
                    }
                  }}
                >
                  <div className="slot-time">
                    <FaClock />
                    <span>{slot.time}</span>
                  </div>
                  <div className="slot-price">₹{slot.price} <span className="price-label">per person</span></div>
                  
                  <div className="slot-status">
                    {isCancelled ? (
                      <span className="status-badge cancelled">Cancelled</span>
                    ) : isFull ? (
                      <span className="status-badge full">House Full</span>
                    ) : (
                      <span className="status-badge active">{slot.availableSeats} seats left</span>
                    )}
                  </div>
                  
                  {isSelected && <FaCheckCircle className="check-icon" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Next step prompt */}
        {slots.length > 0 && (
          <div className="selection-summary-card glass-card">
            <h3>Selected Summary</h3>
            {selectedSlotId ? (
              <>
                <div className="summary-row">
                  <span>Selected Slot:</span>
                  <strong>{slots.find(s => s._id === selectedSlotId)?.time}</strong>
                </div>
                <div className="summary-row">
                  <span>Entry Fee:</span>
                  <strong>₹{slots.find(s => s._id === selectedSlotId)?.price} / person</strong>
                </div>
                <button onClick={handleNext} className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>
                  <span>Proceed to Devotee Info</span>
                  <FaCheckCircle />
                </button>
              </>
            ) : (
              <p className="select-prompt-text">Please click and select an active time slot tile from the grid to proceed with your booking.</p>
            )}

            <div className="widget-security-note">
              <FaUserShield />
              <span>Government approved ID proof required during entry verification.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotSelection;
