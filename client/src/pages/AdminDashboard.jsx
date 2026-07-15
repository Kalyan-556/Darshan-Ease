import React, { useState, useEffect } from 'react';
import Sidebar from '../layouts/Sidebar';
import { FaUsers, FaGopuram, FaTicketAlt, FaDonate, FaFileCsv, FaCoins, FaSpinner } from 'react-icons/fa';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        if (response.data.success) {
          setStats(response.data.stats);
          setRecentBookings(response.data.recentBookings);
          setRecentUsers(response.data.recentUsers);
          setCharts(response.data.charts);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCSV = () => {
    window.open('http://localhost:5000/api/admin/bookings/export', '_blank');
  };

  if (loading) {
    return (
      <div className="admin-layout-wrapper">
        <Sidebar />
        <div className="admin-content-pane text-center" style={{ marginTop: '5rem' }}>
          <FaSpinner className="spinner-icon loading" />
          <p>Gathering system analytics metrics...</p>
        </div>
      </div>
    );
  }

  const cardData = [
    { title: 'Total Devotees', val: stats?.users, icon: <FaUsers />, color: 'blue' },
    { title: 'Registered Shrines', val: stats?.temples, icon: <FaGopuram />, color: 'green' },
    { title: 'Darshan Entries', val: stats?.bookingsCount, icon: <FaTicketAlt />, color: 'orange' },
    { title: 'Donations Received', val: `₹${stats?.totalDonations}`, icon: <FaDonate />, color: 'yellow' },
    { title: 'Total Revenue', val: `₹${stats?.totalRevenue}`, icon: <FaCoins />, color: 'gold' }
  ];

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      
      <main className="admin-content-pane">
        <div className="pane-header-flex">
          <h2>Administrative Overview</h2>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <FaFileCsv />
            <span>Export Bookings CSV</span>
          </button>
        </div>

        {/* Analytics Cards Grid */}
        <section className="stats-cards-grid">
          {cardData.map((c, i) => (
            <div key={i} className={`stat-card glass-card border-${c.color}`}>
              <div className="stat-card-icon">{c.icon}</div>
              <div className="stat-card-text">
                <span className="stat-title">{c.title}</span>
                <strong className="stat-val">{c.val}</strong>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Row */}
        <section className="admin-charts-section glass-card">
          <h3>Monthly Bookings Progress</h3>
          <div className="custom-bar-chart-container">
            {charts?.monthlyBookings.map((b, idx) => {
              // Scale heights
              const heightPercentage = Math.min(b.count * 1.5, 90);
              return (
                <div key={idx} className="chart-bar-group">
                  <div className="chart-bar-tooltip">{b.count} Bookings</div>
                  <div className="chart-bar-wrapper">
                    <div 
                      className="chart-bar-fill" 
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                  </div>
                  <span className="chart-bar-label">{b.month}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tables Grid split */}
        <div className="admin-tables-split">
          {/* Recent Bookings table */}
          <div className="admin-table-card glass-card">
            <h3>Recent Bookings</h3>
            <div className="admin-table-wrapper">
              <table className="admin-dash-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Devotee</th>
                    <th>Temple</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b._id}>
                      <td className="mono-id">{b.bookingId}</td>
                      <td>{b.userName}</td>
                      <td>{b.templeName}</td>
                      <td>₹{b.amount}</td>
                      <td style={{ fontWeight: 'bold', color: b.status === 'Confirmed' ? '#2f855a' : '#e53e3e' }}>
                        {b.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users table */}
          <div className="admin-table-card glass-card">
            <h3>Recent Signups</h3>
            <div className="admin-table-wrapper">
              <table className="admin-dash-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`dash-role-badge ${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
