import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaCalendarAlt, FaDonate, FaUserEdit, FaLock, FaTimesCircle, FaPrint, FaCloudUploadAlt } from 'react-icons/fa';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Bookings list state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Donations list state
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileFile, setProfileFile] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Security Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await api.get('/bookings/my-bookings');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchDonations = async () => {
    setDonationsLoading(true);
    try {
      const response = await api.get('/donations/my-donations');
      if (response.data.success) {
        setDonations(response.data.donations);
      }
    } catch (err) {
      console.error('Failed to load user donations:', err);
    } finally {
      setDonationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'donations') {
      fetchDonations();
    }
  }, [activeTab]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this darshan booking? A refund will be initiated.')) return;
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      if (response.data.success) {
        alert('Booking cancelled successfully.');
        fetchBookings(); // refresh list
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileSubmitting(true);

    try {
      let result;
      if (profileFile) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('profileImage', profileFile);
        result = await updateProfile(formData);
      } else {
        result = await updateProfile({ name, phone, address });
      }

      if (result.success) {
        setProfileSuccess('Profile updated successfully.');
        setProfileFile(null);
      } else {
        setProfileError(result.message || 'Profile update failed.');
      }
    } catch (err) {
      setProfileError('Failed to update profile.');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      return setPasswordError('New passwords do not match.');
    }

    setPasswordSubmitting(true);

    try {
      // Direct reuse of API update call or separate change credentials route
      // We can map this directly to profile put schema inside auth middleware
      const response = await api.put('/auth/profile', {
        name: user.name,
        phone: user.phone,
        password: newPassword // checks encrypted matching inside auth controller if passed
      });
      if (response.data.success) {
        setPasswordSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Confirmed') return '#2f855a';
    if (status === 'Cancelled') return '#e53e3e';
    return 'var(--text-muted)';
  };

  return (
    <div className="profile-page container">
      {/* Header Summary */}
      <header className="profile-banner glass-card">
        <div className="profile-user-summary">
          {user?.profileImage ? (
            <img src={`http://localhost:5000${user.profileImage}`} alt={user.name} className="profile-large-avatar" />
          ) : (
            <FaUserCircle className="profile-large-icon" />
          )}
          <div className="user-text-info">
            <h2>{user?.name}</h2>
            <p className="user-email-tag">{user?.email}</p>
            <span className="user-role-badge">{user?.role}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="profile-grid">
        {/* Navigation Tabs list */}
        <aside className="profile-tabs glass-card">
          <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <FaCalendarAlt /> <span>My Bookings</span>
          </button>
          <button className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
            <FaDonate /> <span>My Donations</span>
          </button>
          <button className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
            <FaUserEdit /> <span>Edit Profile</span>
          </button>
          <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <FaLock /> <span>Security Settings</span>
          </button>
        </aside>

        {/* Dynamic Content card */}
        <main className="profile-tab-content glass-card">
          {/* 1. Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="tab-pane">
              <h3>My Darshan Passes</h3>
              {bookingsLoading ? (
                <p>Loading bookings history...</p>
              ) : bookings.length === 0 ? (
                <p className="empty-tab-text">You haven't scheduled any darshan tickets yet.</p>
              ) : (
                <div className="bookings-history-list">
                  {bookings.map(b => (
                    <div key={b._id} className="history-booking-card">
                      <div className="history-header">
                        <h4>{b.templeName}</h4>
                        <span className="hist-status" style={{ color: getStatusColor(b.bookingStatus) }}>
                          {b.bookingStatus}
                        </span>
                      </div>
                      <div className="history-body-details">
                        <p><strong>Booking ID:</strong> <span className="mono-id">{b.bookingId}</span></p>
                        <p><strong>Date / Time:</strong> {b.slotDate} ({b.slotTime})</p>
                        <p><strong>Pilgrims:</strong> {b.persons.length} Person(s)</p>
                        <p><strong>Amount:</strong> ₹{b.totalAmount}</p>
                      </div>
                      <div className="history-footer-actions">
                        <button 
                          onClick={() => window.open(`http://localhost:5000/api/bookings/ticket/${b.bookingId}`, '_blank')}
                          className="btn btn-outline"
                        >
                          <FaPrint /> <span>Print Ticket</span>
                        </button>
                        {b.bookingStatus === 'Confirmed' && (
                          <button 
                            onClick={() => handleCancelBooking(b._id)}
                            className="btn btn-danger"
                          >
                            <FaTimesCircle /> <span>Cancel Entry</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Donations Tab */}
          {activeTab === 'donations' && (
            <div className="tab-pane">
              <h3>My Charitable Contributions</h3>
              {donationsLoading ? (
                <p>Loading donations log...</p>
              ) : donations.length === 0 ? (
                <p className="empty-tab-text">You haven't contributed any donations yet.</p>
              ) : (
                <div className="donations-log-table-wrapper">
                  <table className="donations-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Temple</th>
                        <th>Amount</th>
                        <th>Mode</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map(d => (
                        <tr key={d._id}>
                          <td className="mono-id">{d.transactionId}</td>
                          <td>{d.templeName}</td>
                          <td style={{ color: '#2f855a', fontWeight: 'bold' }}>₹{d.amount}</td>
                          <td>{d.paymentMethod}</td>
                          <td>{new Date(d.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. Edit Profile Tab */}
          {activeTab === 'edit' && (
            <div className="tab-pane">
              <h3>Modify Profile Details</h3>
              {profileError && <div className="alert alert-danger">{profileError}</div>}
              {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Residential Address</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Change Profile Picture</label>
                  <div className="profile-upload-zone">
                    <FaCloudUploadAlt className="upload-cloud-icon" />
                    <input 
                      type="file" 
                      id="profilePic"
                      accept="image/*"
                      onChange={(e) => setProfileFile(e.target.files[0])}
                    />
                    <label htmlFor="profilePic" className="upload-lbl-btn">
                      {profileFile ? profileFile.name : 'Upload New Photo'}
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={profileSubmitting}>
                  {profileSubmitting ? 'Saving Details...' : 'Save Updates'}
                </button>
              </form>
            </div>
          )}

          {/* 4. Security Settings Tab */}
          {activeTab === 'security' && (
            <div className="tab-pane">
              <h3>Change Password Credentials</h3>
              {passwordError && <div className="alert alert-danger">{passwordError}</div>}
              {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Verify new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={passwordSubmitting}>
                  {passwordSubmitting ? 'Updating Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
