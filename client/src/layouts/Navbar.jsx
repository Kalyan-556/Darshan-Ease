import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaUser, FaSignOutAlt, FaBell, FaOm, FaBars, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const response = await api.get('/notifications');
          if (response.data.success) {
            const unread = response.data.notifications.filter(n => !n.read).length;
            setUnreadNotifications(unread);
          }
        } catch (err) {
          console.warn('Could not fetch notification counts:', err.message);
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000); // Check every 20s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <FaOm className="brand-icon" />
          <span>DarshanEase</span>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/temples" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Browse Temples</Link>
          </li>
          <li className="nav-item">
            <Link to="/donations" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Donations</Link>
          </li>

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link dashboard-badge admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
                </li>
              )}
              {user.role === 'ORGANIZER' && (
                <li className="nav-item">
                  <Link to="/organizer" className="nav-link dashboard-badge organizer" onClick={() => setMobileMenuOpen(false)}>Organizer Portal</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/notifications" className="nav-link icon-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaBell />
                  {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link profile-link" onClick={() => setMobileMenuOpen(false)}>
                  {user.profileImage ? (
                    <img src={`http://localhost:5000${user.profileImage}`} alt="User" className="nav-avatar" />
                  ) : (
                    <FaUser />
                  )}
                  <span className="nav-username">{user.name.split(' ')[0]}</span>
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn-logout">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link-btn signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </li>
            </>
          )}

          {/* Theme Toggle Button */}
          <li className="nav-item">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {isDarkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
