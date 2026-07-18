import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaClock, FaChevronRight, FaFilter } from 'react-icons/fa';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import './TempleListing.css';

const TempleListing = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(queryParams.get('search') || '');
  const [state, setState] = useState(queryParams.get('state') || '');
  const [specialDarshan, setSpecialDarshan] = useState('');

  const statesList = ['Uttarakhand', 'Andhra Pradesh', 'Punjab', 'Gujarat'];

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const url = `/temples?search=${search}&state=${state}&specialDarshan=${specialDarshan}`;
      const response = await api.get(url);
      if (response.data.success) {
        setTemples(response.data.temples);
      }
    } catch (err) {
      console.error('Error fetching temples list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
    // eslint-disable-next-line
  }, [state, specialDarshan]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTemples();
  };

  return (
    <div className="temples-listing-page">
      <div className="listing-hero">
        <h2>Explore Sacred Shrines</h2>
        <p>Book darshan passes, pooja services, and special entries ahead of time</p>
      </div>

      <div className="listing-container container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar glass-card">
          <div className="sidebar-header-title">
            <FaFilter />
            <h3>Search Filters</h3>
          </div>

          <form onSubmit={handleSearchSubmit} className="filters-form">
            <div className="form-group">
              <label className="form-label">Keyword Search</label>
              <div className="search-box">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Temple name, history..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="search-btn"><FaSearch /></button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">State / Region</label>
              <select className="form-control" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">All States</option>
                {statesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Special Darshan Type</label>
              <select className="form-control" value={specialDarshan} onChange={(e) => setSpecialDarshan(e.target.value)}>
                <option value="">Any Darshan Type</option>
                <option value="VIP Rudrabhishek Puja">VIP Rudrabhishek Puja</option>
                <option value="Special Entry Darshan (₹300)">Special Entry Darshan (₹300)</option>
                <option value="Kalyanotsavam (₹1000)">Kalyanotsavam (₹1000)</option>
                <option value="Palki Sahib Ceremony Pass">Palki Sahib Ceremony Pass</option>
                <option value="Somnath Light & Sound Show">Somnath Light & Sound Show</option>
              </select>
            </div>

            <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={() => {
              setSearch('');
              setState('');
              setSpecialDarshan('');
            }}>Reset Filters</button>
          </form>
        </aside>

        {/* Listings Content */}
        <main className="listings-content">
          <div className="results-header">
            <p className="results-count">Showing {temples.length} sacred destinations</p>
          </div>

          <div className="temple-list-grid">
            {loading ? (
              <SkeletonLoader type="card" count={3} />
            ) : temples.length === 0 ? (
              <div className="no-results glass-card text-center">
                <h3>No Shrines Found</h3>
                <p>Try resetting filters or adjusting search keywords.</p>
              </div>
            ) : (
              temples.map(temple => (
                <div key={temple._id} className="temple-item-card glass-card">
                  <div className="temple-item-image">
                    <img 
                      src={temple.image} 
                      alt={temple.name} 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <span className="temple-state-badge">{temple.state}</span>
                  </div>
                  <div className="temple-item-details">
                    <h3>{temple.name}</h3>
                    <p className="temple-item-loc"><FaMapMarkerAlt /> {temple.location}, {temple.district}</p>
                    <p className="temple-item-desc">{temple.description.slice(0, 160)}...</p>
                    
                    <div className="temple-item-meta">
                      <div className="meta-info">
                        <FaClock />
                        <span>Hours: {temple.openingTime} - {temple.closingTime}</span>
                      </div>
                      <Link to={`/temples/${temple._id}`} className="btn btn-primary">
                        <span>Book Darshan</span>
                        <FaChevronRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TempleListing;
