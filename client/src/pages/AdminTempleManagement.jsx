import React, { useState, useEffect } from 'react';
import Sidebar from '../layouts/Sidebar';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import './AdminTempleManagement.css';

const AdminTempleManagement = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState('');
  const [openingTime, setOpeningTime] = useState('06:00 AM');
  const [closingTime, setClosingTime] = useState('09:00 PM');
  const [specialDarshan, setSpecialDarshan] = useState('');
  const [facilities, setFacilities] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const response = await api.get('/temples');
      if (response.data.success) {
        setTemples(response.data.temples);
      }
    } catch (err) {
      console.error('Failed to load temples:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setLocation('');
    setDistrict('');
    setState('');
    setDescription('');
    setHistory('');
    setOpeningTime('06:00 AM');
    setClosingTime('09:00 PM');
    setSpecialDarshan('');
    setFacilities('');
    setLatitude('');
    setLongitude('');
    setImageFile(null);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingId(t._id);
    setName(t.name);
    setLocation(t.location);
    setDistrict(t.district);
    setState(t.state);
    setDescription(t.description);
    setHistory(t.history || '');
    setOpeningTime(t.openingTime);
    setClosingTime(t.closingTime);
    setSpecialDarshan(t.specialDarshan?.join(', ') || '');
    setFacilities(t.facilities?.join(', ') || '');
    setLatitude(t.latitude || '');
    setLongitude(t.longitude || '');
    setImageFile(null);
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this temple? This will remove all associated slots.')) return;
    try {
      const response = await api.delete(`/temples/${id}`);
      if (response.data.success) {
        alert('Temple deleted successfully.');
        fetchTemples();
      }
    } catch (err) {
      alert('Failed to delete temple.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Prepare arrays
    const sdArr = specialDarshan.split(',').map(s => s.trim()).filter(s => s);
    const facArr = facilities.split(',').map(f => f.trim()).filter(f => f);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('district', district);
    formData.append('state', state);
    formData.append('description', description);
    formData.append('history', history);
    formData.append('openingTime', openingTime);
    formData.append('closingTime', closingTime);
    
    sdArr.forEach(s => formData.append('specialDarshan', s));
    facArr.forEach(f => formData.append('facilities', f));
    
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let response;
      if (editingId) {
        response = await api.put(`/temples/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/temples', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        setModalOpen(false);
        fetchTemples();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save temple.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />

      <main className="admin-content-pane">
        <div className="pane-header-flex">
          <h2>Temple Listings Directory</h2>
          <button onClick={openCreateModal} className="btn btn-primary">
            <FaPlus />
            <span>Add New Temple</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center" style={{ marginTop: '5rem' }}>
            <FaSpinner className="spinner-icon loading" />
            <p>Loading temple directories...</p>
          </div>
        ) : temples.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '3rem' }}>
            <p>No temple records found. Click add new temple to populate data.</p>
          </div>
        ) : (
          <div className="admin-table-card glass-card">
            <div className="admin-table-wrapper">
              <table className="admin-dash-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Temple Name</th>
                    <th>Location</th>
                    <th>Timings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {temples.map(t => (
                    <tr key={t._id}>
                      <td>
                        <img src={`http://localhost:5000${t.image}`} alt={t.name} className="admin-table-img" />
                      </td>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.location}, {t.state}</td>
                      <td>{t.openingTime} - {t.closingTime}</td>
                      <td>
                        <div className="action-buttons-flex">
                          <button onClick={() => openEditModal(t)} className="action-btn edit-btn" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(t._id)} className="action-btn delete-btn" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
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
            <div className="modal-content temple-modal-content">
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <FaTimes />
              </button>
              
              <h3>{editingId ? 'Edit Temple Details' : 'Register New Temple'}</h3>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleFormSubmit} className="temple-modal-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">Temple Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / Marg</label>
                    <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">District</label>
                    <input type="text" className="form-control" value={district} onChange={(e) => setDistrict(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Temple Banner Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!editingId} />
                </div>

                <div className="form-group">
                  <label className="form-label">Description Summary</label>
                  <textarea className="form-control" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Historical Significance</label>
                  <textarea className="form-control" rows="2" value={history} onChange={(e) => setHistory(e.target.value)}></textarea>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">Opening Hours</label>
                    <input type="text" className="form-control" placeholder="e.g. 06:00 AM" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Closing Hours</label>
                    <input type="text" className="form-control" placeholder="e.g. 09:00 PM" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">Special Darshans (comma separated)</label>
                    <input type="text" className="form-control" placeholder="VIP Pooja, Aarti Pass" value={specialDarshan} onChange={(e) => setSpecialDarshan(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Facilities (comma separated)</label>
                    <input type="text" className="form-control" placeholder="Medical, Helipad, Lockers" value={facilities} onChange={(e) => setFacilities(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Saving Temple Record...' : 'Save Temple'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTempleManagement;
