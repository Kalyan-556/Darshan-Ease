import React, { useState, useEffect } from 'react';
import Sidebar from '../layouts/Sidebar';
import { FaPlus, FaTrash, FaSpinner, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import api from '../services/api';
import './AdminSlotManagement.css';

const AdminSlotManagement = () => {
  const [temples, setTemples] = useState([]);
  const [selectedTempleId, setSelectedTempleId] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states for new slot
  const [date, setDate] = useState('');
  const [time, setTime] = useState('06:00 AM - 08:00 AM');
  const [capacity, setCapacity] = useState('50');
  const [price, setPrice] = useState('150');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch all temples to choose from
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await api.get('/temples');
        if (response.data.success) {
          setTemples(response.data.temples);
          if (response.data.temples.length > 0) {
            setSelectedTempleId(response.data.temples[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch temples list:', err);
      } finally {
        setLoadingTemples(false);
      }
    };
    fetchTemples();
  }, []);

  // Fetch slots whenever selected temple changes
  const fetchSlots = async () => {
    if (!selectedTempleId) return;
    setLoadingSlots(true);
    try {
      const response = await api.get(`/slots/temple/${selectedTempleId}`);
      if (response.data.success) {
        // Sort slots by date and time
        const sorted = [...response.data.slots].sort((a,b) => new Date(a.date) - new Date(b.date));
        setSlots(sorted);
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line
  }, [selectedTempleId]);

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) return;
    try {
      const response = await api.delete(`/slots/${id}`);
      if (response.data.success) {
        alert('Slot deleted successfully.');
        fetchSlots();
      }
    } catch (err) {
      alert('Failed to delete slot.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/slots', {
        templeId: selectedTempleId,
        date,
        time,
        capacity: parseInt(capacity),
        price: parseFloat(price)
      });

      if (response.data.success) {
        setModalOpen(false);
        fetchSlots();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule slot.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />

      <main className="admin-content-pane">
        <div className="pane-header-flex">
          <h2>Darshan Slots Scheduling</h2>
          <button 
            onClick={() => {
              setDate(new Date().toISOString().slice(0, 10));
              setError('');
              setModalOpen(true);
            }} 
            className="btn btn-primary"
            disabled={!selectedTempleId}
          >
            <FaPlus />
            <span>Schedule New Slot</span>
          </button>
        </div>

        {/* Temple Selector widget */}
        <div className="temple-selector-widget glass-card">
          <label className="form-label">Select Temple to Schedule Slots For:</label>
          {loadingTemples ? (
            <p>Loading temple options...</p>
          ) : (
            <select 
              className="form-control" 
              value={selectedTempleId}
              onChange={(e) => setSelectedTempleId(e.target.value)}
            >
              {temples.map(t => <option key={t._id} value={t._id}>{t.name} ({t.state})</option>)}
            </select>
          )}
        </div>

        {/* Slots Table */}
        {loadingSlots ? (
          <div className="text-center" style={{ marginTop: '5rem' }}>
            <FaSpinner className="spinner-icon loading" />
            <p>Fetching scheduled slots...</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '3rem' }}>
            <p>No slots scheduled for this temple. Click Schedule New Slot to add schedules.</p>
          </div>
        ) : (
          <div className="admin-table-card glass-card">
            <div className="admin-table-wrapper">
              <table className="admin-dash-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Available Seats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map(s => (
                    <tr key={s._id}>
                      <td><strong>{s.date}</strong></td>
                      <td>{s.time}</td>
                      <td>₹{s.price}</td>
                      <td>{s.capacity}</td>
                      <td>{s.availableSeats}</td>
                      <td>
                        <span className={`slot-state-tag ${s.status.toLowerCase()}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteSlot(s._id)} className="action-btn delete-btn" title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Overlay Form */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <FaTimes />
              </button>
              
              <h3>Schedule New Darshan Slot</h3>
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Date</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Interval</label>
                  <select className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required>
                    <option value="06:00 AM - 08:00 AM">06:00 AM - 08:00 AM (Morning Seva)</option>
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning Darshan)</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM (Noon Darshan)</option>
                    <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM (Evening Darshan)</option>
                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM (Evening Aarti)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Seat Capacity</label>
                  <input type="number" className="form-control" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Price per Ticket (₹)</label>
                  <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Save Time Slot'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSlotManagement;
