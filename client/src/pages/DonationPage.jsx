import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaGift, FaPrayingHands, FaSpinner, FaChevronRight } from 'react-icons/fa';
import api from '../services/api';
import './DonationPage.css';

const DonationPage = () => {
  const { user } = useAuth();

  const [temples, setTemples] = useState([]);
  const [templeId, setTempleId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await api.get('/temples');
        if (response.data.success) {
          setTemples(response.data.temples);
          if (response.data.temples.length > 0) {
            setTempleId(response.data.temples[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load temples:', err);
      }
    };
    fetchTemples();
  }, []);

  const handleQuickAmount = (val) => {
    setAmount(val);
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessReceipt(null);

    if (!user) {
      return setError('Please login to contribute donations.');
    }

    if (parseFloat(amount) <= 0) {
      return setError('Please enter a valid donation amount.');
    }

    setLoading(true);

    // Simulate delay
    setTimeout(async () => {
      try {
        const response = await api.post('/donations', {
          templeId,
          amount: parseFloat(amount),
          paymentMethod: method
        });

        if (response.data.success) {
          setSuccessReceipt(response.data.donation);
          setAmount('');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Donation transaction failed.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="donations-page container">
      <div className="donations-header text-center">
        <FaHeart className="donation-main-icon" />
        <h2>Sacred Contributions</h2>
        <p>Support temple restorations, devotee services, and free daily community meals (Annadanam)</p>
      </div>

      <div className="donations-layout">
        {/* Left Form */}
        <main className="donation-card glass-card">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="donation-processing text-center">
              <FaSpinner className="spinner-icon loading" />
              <h3>Processing Donation...</h3>
              <p>Thank you for your patience and generosity.</p>
            </div>
          ) : successReceipt ? (
            <div className="donation-success text-center">
              <FaPrayingHands className="success-receipt-icon" />
              <h3>Thank You!</h3>
              <p className="success-receipt-msg">Your contribution was successfully recorded. May the deity bless you and your family.</p>
              
              <div className="receipt-box">
                <div className="receipt-row">
                  <span>Transaction ID:</span>
                  <strong>{successReceipt.transactionId}</strong>
                </div>
                <div className="receipt-row">
                  <span>Temple Name:</span>
                  <strong>{temples.find(t => t._id === successReceipt.templeId)?.name}</strong>
                </div>
                <div className="receipt-row">
                  <span>Amount Contributed:</span>
                  <strong className="receipt-amount-hl">₹{successReceipt.amount}</strong>
                </div>
                <div className="receipt-row">
                  <span>Payment Mode:</span>
                  <strong>{successReceipt.paymentMethod}</strong>
                </div>
              </div>

              <button onClick={() => setSuccessReceipt(null)} className="btn btn-primary">
                Make Another Contribution
              </button>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit}>
              <div className="form-group">
                <label className="form-label">Select Temple</label>
                <select className="form-control" value={templeId} onChange={(e) => setTempleId(e.target.value)} required>
                  {temples.map(t => <option key={t._id} value={t._id}>{t.name} ({t.state})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quick Donation Amount (₹)</label>
                <div className="quick-amounts-grid">
                  {[251, 501, 1001, 2100, 5001].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`quick-amount-btn ${parseInt(amount) === val ? 'active' : ''}`}
                      onClick={() => handleQuickAmount(val)}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Custom Donation Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Enter amount in Rupees" 
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Gateway</label>
                <select className="form-control" value={method} onChange={(e) => setMethod(e.target.value)} required>
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Wallet">Digital Wallet</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block donate-btn">
                <FaGift />
                <span>Contribute ₹{amount || '0'}</span>
              </button>
            </form>
          )}
        </main>

        {/* Right Info pitch */}
        <aside className="donation-pitch-sidebar glass-card">
          <h3>Why Donate?</h3>
          <ul className="pitch-bullets">
            <li>
              <strong>Preserve Heritage:</strong> Helps fund civil restorations of 1000+ year old ancient temple walls.
            </li>
            <li>
              <strong>Annadanam Meals:</strong> Sponsors free daily lunch tables serving healthy meals to pilgrims.
            </li>
            <li>
              <strong>Pooja Offerings:</strong> Sponsors floral garlands, incense, oils, and prasad for the main deities.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DonationPage;
