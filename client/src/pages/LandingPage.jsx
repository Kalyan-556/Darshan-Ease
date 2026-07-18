import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaGopuram, FaMapMarkerAlt, FaCalendarCheck, FaHeart, FaChevronRight } from 'react-icons/fa';
import api from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await api.get('/temples');
        if (response.data.success) {
          setTemples(response.data.temples.slice(0, 3)); // show top 3
        }
      } catch (err) {
        console.error('Failed to load temples:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/temples?search=${searchQuery}&state=${stateFilter}`);
  };

  const festivals = [
    { name: 'Maha Shivratri', date: 'March 8, 2026', temple: 'Kedarnath Temple', image: 'https://images.unsplash.com/photo-1608958416805-4c07921a415a?auto=format&fit=crop&q=80&w=300' },
    { name: 'Ratha Yatra', date: 'July 17, 2026', temple: 'Somnath Temple', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=300' },
    { name: 'Guru Nanak Jayanti', date: 'November 24, 2026', temple: 'Golden Temple', image: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&q=80&w=300' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Experience the Divine, Effortlessly</h1>
          <p className="hero-subtitle">Book Temple Darshan Slots, Pooja Passes, and Contributed Donations in a Click</p>
          
          <form className="search-bar-container glass-card" onSubmit={handleSearchSubmit}>
            <div className="search-input-group">
              <FaSearch className="input-icon" />
              <input 
                type="text" 
                placeholder="Search by temple name or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-input-group">
              <FaMapMarkerAlt className="input-icon" />
              <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
                <option value="">All States</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Find Temples</button>
          </form>
        </div>
      </header>

      {/* Featured Temples Section */}
      <section className="section featured-temples">
        <div className="container">
          <h2 className="section-title">Popular Shrines</h2>
          <p className="section-subtitle-text">Explore sacred destinations and schedule your secure darshan times</p>
          
          <div className="temple-grid">
            {loading ? (
              <div className="loading-placeholder">Loading featured temples...</div>
            ) : (
              temples.map(temple => (
                <div key={temple._id} className="temple-card glass-card">
                  <div className="temple-card-image">
                    <img 
                      src={temple.image} 
                      alt={temple.name} 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <span className="state-tag">{temple.state}</span>
                  </div>
                  <div className="temple-card-body">
                    <h3>{temple.name}</h3>
                    <p className="temple-loc"><FaMapMarkerAlt /> {temple.location}</p>
                    <p className="temple-desc-short">{temple.description.slice(0, 100)}...</p>
                    <div className="temple-card-footer">
                      <Link to={`/temples/${temple._id}`} className="btn btn-outline">
                        <span>View Details</span>
                        <FaChevronRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="view-all-container">
            <Link to="/temples" className="btn btn-primary">View All Temples</Link>
          </div>
        </div>
      </section>

      {/* Quick Booking Steps */}
      <section className="section how-it-works bg-alt">
        <div className="container">
          <h2 className="section-title">Quick Booking Flow</h2>
          <div className="steps-grid">
            <div className="step-card glass-card">
              <div className="step-icon-wrapper"><FaGopuram /></div>
              <h3>1. Select Shrine</h3>
              <p>Search and choose from sacred temples across the country.</p>
            </div>
            <div className="step-card glass-card">
              <div className="step-icon-wrapper"><FaCalendarCheck /></div>
              <h3>2. Choose Time Slot</h3>
              <p>Pick a date and visual time slot convenient for your family.</p>
            </div>
            <div className="step-card glass-card">
              <div className="step-icon-wrapper"><FaHeart /></div>
              <h3>3. Get E-Ticket</h3>
              <p>Make secure mock checkouts and download QR-enabled print tickets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Festivals Section */}
      <section className="section upcoming-festivals">
        <div className="container">
          <h2 className="section-title">Festivals & Special Events</h2>
          <p className="section-subtitle-text">Plan ahead for holy calendar dates and booking availability spikes</p>
          
          <div className="festivals-grid">
            {festivals.map((fest, idx) => (
              <div key={idx} className="festival-card glass-card">
                <img src={fest.image} alt={fest.name} className="fest-img" />
                <div className="fest-details">
                  <span className="fest-date">{fest.date}</span>
                  <h3>{fest.name}</h3>
                  <p className="fest-temple"><FaGopuram /> {fest.temple}</p>
                  <Link to="/temples" className="fest-link">Book Passes <FaChevronRight /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Pitch Section */}
      <section className="donation-banner text-center">
        <div className="donation-banner-overlay"></div>
        <div className="donation-banner-content container">
          <h2>Support Sacred Works & Devotee Services</h2>
          <p>Your contributions help maintain ancient heritages and fund community kitchens (Langar/Annaprasadam).</p>
          <Link to="/donations" className="btn btn-secondary">Make A Donation</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials bg-alt">
        <div className="container">
          <h2 className="section-title">Devotee Testimonials</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card glass-card">
              <p className="quote">"Booking tickets for Kedarnath was always stressful. With DarshanEase, our family secured morning passes in less than 2 minutes. The QR code verification was flawless!"</p>
              <div className="author-info">
                <h4>Amit Verma</h4>
                <span>Delhi Devotee</span>
              </div>
            </div>
            <div className="testimonial-card glass-card">
              <p className="quote">"An absolute blessing. The interface switches between light and dark modes beautifully. Downloading the ticket print PDF was extremely convenient."</p>
              <div className="author-info">
                <h4>Srinivas Iyer</h4>
                <span>Chennai Pilgrim</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
