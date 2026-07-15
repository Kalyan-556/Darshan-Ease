import React from 'react';
import { Link } from 'react-router-dom';
import { FaOm, FaHeart, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-brand-section">
            <Link to="/" className="footer-logo">
              <FaOm className="footer-logo-icon" />
              <span>DarshanEase</span>
            </Link>
            <p className="footer-desc">
              Your gateway to seamless travel and spiritual journeys. Plan in advance, book slots with ease, and focus on your inner peace.
            </p>
          </div>

          <div className="footer-links-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/temples">Browse Temples</Link></li>
              <li><Link to="/donations">Make Donations</Link></li>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/login">Login Portal</Link></li>
            </ul>
          </div>

          <div className="footer-contact-section">
            <h3>Contact Us</h3>
            <ul className="contact-list">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>Devotee Center, Main Marg, New Delhi</span>
              </li>
              <li>
                <FaPhoneAlt className="contact-icon" />
                <span>+91 11 2233 4455</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>support@darshanease.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DarshanEase. All Rights Reserved.</p>
        <p className="dev-credit">
          Made with <FaHeart className="heart-icon" /> for a blissful pilgrim experience.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
