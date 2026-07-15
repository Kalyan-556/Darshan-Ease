import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaClock, FaBookOpen, FaAward, FaGopuram, FaRegStar, FaStar, FaChevronRight, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import Rating from '../components/Rating';
import SkeletonLoader from '../components/SkeletonLoader';
import './TempleDetails.css';

const TempleDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [temple, setTemple] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback form state
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Booking form state
  const [bookingDate, setBookingDate] = useState('');

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const tRes = await api.get(`/temples/${id}`);
        if (tRes.data.success) {
          setTemple(tRes.data.temple);
        }
        
        const fRes = await api.get(`/feedback/temple/${id}`);
        if (fRes.data.success) {
          setFeedbacks(fRes.data.feedbacks);
        }
      } catch (err) {
        console.error('Error fetching temple details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    setBookingDate(getTomorrowDate());
  }, [id]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/temples/${id}/slots?date=${bookingDate}`);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      const response = await api.post('/feedback', {
        templeId: id,
        rating,
        review
      });

      if (response.data.success) {
        setSubmitSuccess('Feedback submitted successfully!');
        setReview('');
        setRating(5);
        // Refresh feedback list
        const fRes = await api.get(`/feedback/temple/${id}`);
        if (fRes.data.success) {
          setFeedbacks(fRes.data.feedbacks);
        }
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '3rem' }}>
        <SkeletonLoader type="card" count={1} />
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="container text-center" style={{ marginTop: '5rem' }}>
        <h3>Temple Not Found</h3>
        <Link to="/temples" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Temples</Link>
      </div>
    );
  }

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="temple-details-page">
      {/* Banner */}
      <div className="temple-hero" style={{ backgroundImage: `url(${temple.image})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <span className="hero-state">{temple.state}</span>
          <h2>{temple.name}</h2>
          <p className="hero-loc"><FaMapMarkerAlt /> {temple.location}, {temple.district}</p>
        </div>
      </div>

      <div className="temple-container container">
        {/* Main Details column */}
        <main className="temple-main-info">
          {/* About */}
          <section className="detail-section glass-card">
            <h3 className="section-subtitle"><FaGopuram /> About the Shrine</h3>
            <p className="about-text">{temple.description}</p>
          </section>

          {/* History */}
          {temple.history && (
            <section className="detail-section glass-card">
              <h3 className="section-subtitle"><FaBookOpen /> Historical Significance</h3>
              <p className="history-text">{temple.history}</p>
            </section>
          )}

          {/* Gallery */}
          {temple.gallery && temple.gallery.length > 0 && (
            <section className="detail-section glass-card">
              <h3 className="section-subtitle">Visual Gallery</h3>
              <div className="gallery-grid">
                {temple.gallery.map((img, index) => (
                  <a key={index} href={img} target="_blank" rel="noreferrer" className="gallery-item">
                    <img src={img} alt={`Gallery ${index + 1}`} />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Reviews & Ratings */}
          <section className="detail-section glass-card reviews-section">
            <h3 className="section-subtitle">Pilgrim Reviews</h3>
            <div className="rating-summary">
              <div className="rating-number">{averageRating}</div>
              <div className="rating-stars-detail">
                <Rating value={parseFloat(averageRating)} />
                <span className="total-reviews">{feedbacks.length} ratings</span>
              </div>
            </div>

            {/* Submit review */}
            {user ? (
              <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                <h4>Share Your Experience</h4>
                {submitError && <div className="alert alert-danger">{submitError}</div>}
                {submitSuccess && <div className="alert alert-success">{submitSuccess}</div>}
                
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="star-rating-selector">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num} 
                        type="button" 
                        className={`star-btn ${rating >= num ? 'active' : ''}`}
                        onClick={() => setRating(num)}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Message</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Write about the cleanliness, queue lengths, and main darshan experience..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <p className="review-login-pitch">Please <Link to="/login">login</Link> to share your review.</p>
            )}

            {/* List feedbacks */}
            <div className="feedbacks-list">
              {feedbacks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews posted yet.</p>
              ) : (
                feedbacks.map(f => (
                  <div key={f._id} className="feedback-item">
                    <div className="feedback-item-header">
                      <strong>{f.userName}</strong>
                      <Rating value={f.rating} />
                    </div>
                    <p className="feedback-msg">{f.review}</p>
                    <span className="feedback-date">{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* Sidebar Info & Booking form */}
        <aside className="temple-sidebar">
          {/* Booking Card */}
          <div className="booking-widget glass-card">
            <h3>Schedule Darshan</h3>
            <p className="widget-pitch">Select a date and click check slots to secure your entry pass.</p>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Darshan Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  min={new Date().toISOString().slice(0, 10)}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                <span>Check Available Slots</span>
                <FaChevronRight />
              </button>
            </form>
          </div>

          {/* Quick Stats Card */}
          <div className="info-widget glass-card">
            <h3>Quick Details</h3>
            <ul className="stats-list">
              <li>
                <span className="stats-label"><FaClock /> Opening Hours:</span>
                <span className="stats-val">{temple.openingTime} - {temple.closingTime}</span>
              </li>
              {temple.specialDarshan && temple.specialDarshan.length > 0 && (
                <li>
                  <span className="stats-label"><FaAward /> Special Darshans:</span>
                  <div className="chips-container">
                    {temple.specialDarshan.map(sd => <span key={sd} className="chip">{sd}</span>)}
                  </div>
                </li>
              )}
              {temple.facilities && temple.facilities.length > 0 && (
                <li>
                  <span className="stats-label"><FaPlus /> Facilities Available:</span>
                  <div className="chips-container">
                    {temple.facilities.map(fac => <span key={fac} className="chip facility">{fac}</span>)}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TempleDetails;
