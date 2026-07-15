exports.generateTicketHTML = (booking, temple, user, slot, qrCodeData) => {
  const travelersList = booking.persons.map((p, i) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${i + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.age}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.gender}</td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Darshan Ticket - ${booking.bookingId}</title>
    <style>
      body { font-family: 'Poppins', Arial, sans-serif; background-color: #f5f5f5; color: #333; margin: 0; padding: 20px; }
      .ticket-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #2e7d32; overflow: hidden; }
      .ticket-header { background: linear-gradient(135deg, #2e7d32, #1b5e20); color: white; padding: 20px; text-align: center; }
      .ticket-header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
      .ticket-header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
      .ticket-body { padding: 25px; }
      .section-title { font-size: 16px; font-weight: bold; color: #2e7d32; border-bottom: 2px solid #ffd54f; padding-bottom: 5px; margin-top: 20px; margin-bottom: 15px; }
      .grid-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
      .detail-group { display: flex; flex-direction: column; }
      .detail-label { font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 0.5px; }
      .detail-value { font-size: 14px; font-weight: 600; color: #222; }
      .travelers-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
      .travelers-table th { background-color: #f8f9fa; color: #2e7d32; font-weight: bold; text-align: left; padding: 8px; border-bottom: 2px solid #ddd; }
      .qr-section { display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 25px; padding-top: 20px; border-top: 1px dashed #ccc; }
      .qr-image { width: 130px; height: 130px; border: 1px solid #ddd; padding: 5px; background: white; }
      .footer-note { text-align: center; font-size: 11px; color: #888; margin-top: 20px; padding: 0 20px 20px; line-height: 1.5; }
      @media print {
        body { background: white; padding: 0; }
        .ticket-container { border: none; box-shadow: none; max-width: 100%; }
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="ticket-container">
      <div class="ticket-header">
        <h1>DARSHAN EASE TICKET</h1>
        <p>E-Ticket for Temple Entry & Pooja</p>
      </div>
      <div class="ticket-body">
        <div class="grid-details">
          <div class="detail-group">
            <span class="detail-label">Booking ID</span>
            <span class="detail-value" style="color: #1565c0; font-family: monospace; font-size: 16px;">${booking.bookingId}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Status</span>
            <span class="detail-value" style="color: #2e7d32;">${booking.bookingStatus} (${booking.paymentStatus})</span>
          </div>
        </div>

        <div class="section-title">Temple & Slot Details</div>
        <div class="grid-details">
          <div class="detail-group">
            <span class="detail-label">Temple Name</span>
            <span class="detail-value">${temple.name}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Location</span>
            <span class="detail-value">${temple.location}, ${temple.district}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Darshan Date</span>
            <span class="detail-value">${slot.date}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Time Slot</span>
            <span class="detail-value">${slot.time}</span>
          </div>
        </div>

        <div class="section-title">Devotee Information</div>
        <div class="grid-details" style="margin-bottom: 10px;">
          <div class="detail-group">
            <span class="detail-label">Primary Devotee</span>
            <span class="detail-value">${user.name}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Total Amount Paid</span>
            <span class="detail-value" style="color: #e65100;">₹${booking.totalAmount}</span>
          </div>
        </div>

        <table class="travelers-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            ${travelersList}
          </tbody>
        </table>

        <div class="qr-section">
          <img class="qr-image" src="${qrCodeData}" alt="Booking QR Code" />
          <p style="font-size: 12px; font-weight: bold; margin: 10px 0 0 0; color: #444;">Scan for Verification at Entrance</p>
        </div>
      </div>
      <div class="footer-note">
        <strong>Important Instructions:</strong> Please carry a printout of this E-ticket or show it on your mobile device along with a valid ID proof (Aadhaar, PAN, Voter ID, or Passport) at the temple entry counter 30 minutes prior to your scheduled time slot.
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px;" class="no-print">
      <button onclick="window.print()" style="padding: 10px 20px; background-color: #2e7d32; color: white; border: none; border-radius: 5px; font-size: 14px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
        Print / Download Ticket
      </button>
    </div>
  </body>
  </html>
  `;
};
