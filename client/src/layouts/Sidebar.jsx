import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChartBar, FaGopuram, FaCalendarAlt, FaTicketAlt, FaUsers, FaDonate, FaChevronRight } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'ADMIN';
  const isOrganizer = user && user.role === 'ORGANIZER';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Dashboard</span>
        <span className="sidebar-role">{user ? user.role : 'USER'}</span>
      </div>

      <nav className="sidebar-nav">
        {/* Common Dashboard Overview */}
        <NavLink to={isAdmin ? "/admin" : isOrganizer ? "/organizer" : "/dashboard"} end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaChartBar className="sidebar-icon" />
          <span>Overview</span>
          <FaChevronRight className="arrow-icon" />
        </NavLink>

        {/* Admin and Organizer Temple controls */}
        {isAdmin && (
          <NavLink to="/admin/temples" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FaGopuram className="sidebar-icon" />
            <span>Manage Temples</span>
            <FaChevronRight className="arrow-icon" />
          </NavLink>
        )}

        {/* Slots Control */}
        {(isAdmin || isOrganizer) && (
          <NavLink to={isAdmin ? "/admin/slots" : "/organizer/slots"} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FaCalendarAlt className="sidebar-icon" />
            <span>Manage Slots</span>
            <FaChevronRight className="arrow-icon" />
          </NavLink>
        )}

        {/* Bookings log */}
        {isAdmin && (
          <NavLink to="/admin/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FaTicketAlt className="sidebar-icon" />
            <span>View Bookings</span>
            <FaChevronRight className="arrow-icon" />
          </NavLink>
        )}

        {/* User Management */}
        {isAdmin && (
          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FaUsers className="sidebar-icon" />
            <span>Manage Users</span>
            <FaChevronRight className="arrow-icon" />
          </NavLink>
        )}

        {/* Donations Log */}
        {isAdmin && (
          <NavLink to="/admin/donations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FaDonate className="sidebar-icon" />
            <span>Donations Log</span>
            <FaChevronRight className="arrow-icon" />
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
