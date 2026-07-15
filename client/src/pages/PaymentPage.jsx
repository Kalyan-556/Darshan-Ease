import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaWallet, FaLock, FaSpinner } from 'react-icons/fa';
import api from '../services/api';
import './PaymentPage.css';

const PaymentPage = () => {
  const { templeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutState = location.state; // contains slotId, passengers list
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [temple, setTemple] = useState(null);
  const [slot, setSlot] = useState(null);

  // Form input details for credit card
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    if (!checkoutState || !checkoutState.slotId || !checkoutState.passengers) {
      navigate(`/temples/${templeId}`);
      return;
    }

    const fetchDetails = async () => {
      try {
        const tRes = await api.get(`/temples/${templeId}`);
        if (tRes.data.success) {
          setTemple(tRes.data.temple);
        }

        const sRes = await api.get(`/slots/temple/${templeId}`);
        if (sRes.data.success) {
          const matched = sRes.data.slots.find(s => s._id === checkoutState.slotId);
          if (matched) {
            setSlot(matched);
          }
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
      }
    };

    fetchDetails();
  }, [templeId, checkoutState, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate 2s processing delay
    setTimeout(async () => {
      try {
        const response = await api.post('/bookings', {
          templeId,
          slotId: checkoutState.slotId,
          persons: checkoutState.passengers,
          paymentMethod: method
        });

        if (response.data.success) {
          // Navigate to success page
          navigate(`/temples/${templeId}/success`, {
            state: { booking: response.data.booking }
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Transaction failed. Please check parameters.');
        setLoading(false);
      }
    }, 2000);
  };

  const ticketPrice = slot ? slot.price : 0;
  const count = checkoutState ? checkoutState.passengers.length : 1;
  const subtotal = ticketPrice * count;
  const convenienceFee = 25;
  const totalAmount = subtotal + convenienceFee;

  return (
    <div className="payment-page container">
      <div className="payment-layout">
        {/* Left Form: Choice of payment */}
        <main className="payment-form-card glass-card">
          <div className="payment-header">
            <h2>Select Payment Method</h2>
            <p>Secure simulated gateway for darshan reservations</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="payment-processing text-center">
              <FaSpinner className="spinner-icon loading" />
              <h3>Processing Transaction...</h3>
              <p>Please do not refresh this page or close the browser window.</p>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              {/* Payment Methods Grid */}
              <div className="payment-methods-grid">
                <div 
                  className={`method-tile ${method === 'UPI' ? 'active' : ''}`}
                  onClick={() => setMethod('UPI')}
                >
                  <FaMobileAlt />
                  <span>UPI / QR</span>
                </div>
                <div 
                  className={`method-tile ${method === 'Card' ? 'active' : ''}`}
                  onClick={() => setMethod('Card')}
                >
                  <FaCreditCard />
                  <span>Debit/Credit Card</span>
                </div>
                <div 
                  className={`method-tile ${method === 'NetBanking' ? 'active' : ''}`}
                  onClick={() => setMethod('NetBanking')}
                >
                  <FaUniversity />
                  <span>Net Banking</span>
                </div>
                <div 
                  className={`method-tile ${method === 'Wallet' ? 'active' : ''}`}
                  onClick={() => setMethod('Wallet')}
                >
                  <FaWallet />
                  <span>Wallet</span>
                </div>
              </div>

              {/* Dynamic Sub-form fields */}
              <div className="method-fields-container">
                {method === 'UPI' && (
                  <div className="upi-details">
                    <p className="field-helper-text">You can pay using any UPI app (GPay, PhonePe, Paytm, BHIM) by entering your UPI ID below.</p>
                    <div className="form-group">
                      <label className="form-label">UPI ID / VPA</label>
                      <input type="text" className="form-control" placeholder="username@upi" required />
                    </div>
                  </div>
                )}

                {method === 'Card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="4532 9843 2831 9283"
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="card-minor-fields">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'NetBanking' && (
                  <div className="nb-details">
                    <div className="form-group">
                      <label className="form-label">Select Your Bank</label>
                      <select className="form-control" required>
                        <option value="">Choose Bank...</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="Axis">Axis Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {method === 'Wallet' && (
                  <div className="wallet-details">
                    <p className="field-helper-text">Checkout using popular digital wallets.</p>
                    <div className="form-group">
                      <label className="form-label">Select Wallet</label>
                      <select className="form-control" required>
                        <option value="">Select Wallet...</option>
                        <option value="Paytm">Paytm Wallet</option>
                        <option value="PhonePe">PhonePe Wallet</option>
                        <option value="AmazonPay">Amazon Pay</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-block payment-btn">
                <FaLock />
                <span>Pay ₹{totalAmount}</span>
              </button>

              <div className="security-badges text-center">
                <span>128-bit SSL Encrypted Transaction</span>
              </div>
            </form>
          )}
        </main>

        {/* Right Info: Totals summary */}
        <aside className="payment-summary-sidebar">
          <div className="summary-widget glass-card">
            <h3>Checkout Details</h3>
            <div className="widget-details-list">
              <div className="summary-info-item">
                <span className="info-lbl">Shrine</span>
                <span className="info-val">{temple?.name}</span>
              </div>
              <div className="summary-info-item">
                <span className="info-lbl">Timing Slot</span>
                <span className="info-val">{slot?.date} ({slot?.time})</span>
              </div>
              <div className="summary-info-item">
                <span className="info-lbl">Devotees Count</span>
                <span className="info-val">{count} Pilgrim(s)</span>
              </div>
            </div>

            <h3 style={{ marginTop: '25px' }}>Price Summary</h3>
            <div className="pricing-details-list">
              <div className="pricing-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="pricing-row">
                <span>Convenience Charge</span>
                <span>₹{convenienceFee}</span>
              </div>
              <div className="pricing-row grand-total">
                <span>Total Amount Due</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;
