import React, { useState, useEffect } from 'react';
import Sidebar from '../layouts/Sidebar';
import { FaUsers, FaUserTag, FaTrash, FaSpinner } from 'react-icons/fa';
import api from '../services/api';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error('Failed to load users list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (response.data.success) {
        alert('User role updated successfully.');
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        alert('User deleted successfully.');
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />

      <main className="admin-content-pane">
        <div className="pane-header-flex">
          <h2>Manage User Accounts</h2>
        </div>

        {loading ? (
          <div className="text-center" style={{ marginTop: '5rem' }}>
            <FaSpinner className="spinner-icon loading" />
            <p>Fetching user directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '3rem' }}>
            <p>No user accounts registered.</p>
          </div>
        ) : (
          <div className="admin-table-card glass-card">
            <div className="admin-table-wrapper">
              <table className="admin-dash-table">
                <thead>
                  <tr>
                    <th>Devotee Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Active Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <select 
                          className="role-selector-input" 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="USER">USER (Devotee)</option>
                          <option value="ORGANIZER">ORGANIZER (Trustee)</option>
                          <option value="ADMIN">ADMIN (System)</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteUser(u.id)} className="action-btn delete-btn" title="Delete Account">
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
      </main>
    </div>
  );
};

export default AdminUserManagement;
