const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');
const User = require('../models/User');
const Notification = require('../models/Notification');
const qrService = require('../services/qrService');
const pdfService = require('../services/pdfService');

exports.bookSlot = async (req, res, next) => {
  try {
    const { templeId, slotId, persons, paymentMethod } = req.body;

    const slot = await DarshanSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Darshan slot not found.' });
    }

    if (slot.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'This slot is currently inactive.' });
    }

    const count = Array.isArray(persons) ? persons.length : 0;
    if (count <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide details for at least one traveler.' });
    }

    if (slot.availableSeats < count) {
      return res.status(400).json({ success: false, message: `Only ${slot.availableSeats} seats left for this slot.` });
    }

    // Prevent duplicate bookings for the same slot by the same user
    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      slotId,
      bookingStatus: 'Confirmed'
    });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You have already reserved a ticket for this specific time slot. Check your dashboard bookings.'
      });
    }

    const totalAmount = slot.price * count;

    // Generate unique Booking ID
    const today = new Date().toISOString().slice(0,10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `DE-${today}-${rand}`;

    // Create QR Code
    const qrCodeData = qrService.generateQRCode(bookingId);

    // Create Booking
    const newBooking = await Booking.create({
      bookingId,
      userId: req.user.id,
      templeId,
      slotId,
      persons,
      totalAmount,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      ticketQRCode: qrCodeData
    });

    // Decrease Slot Seats
    const newAvailable = slot.availableSeats - count;
    await DarshanSlot.findByIdAndUpdate(slotId, {
      availableSeats: newAvailable,
      status: newAvailable === 0 ? 'Full' : slot.status
    });

    // Create user notification
    const temple = await Temple.findById(templeId);
    const templeName = temple ? temple.name : 'Temple';
    await Notification.create({
      userId: req.user.id,
      title: 'Booking Confirmed!',
      message: `Your booking ${bookingId} for ${templeName} on ${slot.date} (${slot.time}) is confirmed.`
    });

    res.status(201).json({
      success: true,
      message: 'Booking completed successfully.',
      booking: newBooking
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    
    // Enrich bookings with temple details manually for hybrid adapter fallback
    const enrichedBookings = [];
    for (let booking of bookings) {
      const temple = await Temple.findById(booking.templeId);
      const slot = await DarshanSlot.findById(booking.slotId);
      enrichedBookings.push({
        ...booking,
        templeName: temple ? temple.name : 'Unknown Temple',
        templeImage: temple ? temple.image : '',
        templeLocation: temple ? `${temple.location}, ${temple.district}` : '',
        slotDate: slot ? slot.date : 'N/A',
        slotTime: slot ? slot.time : 'N/A'
      });
    }

    res.json({
      success: true,
      count: enrichedBookings.length,
      bookings: enrichedBookings
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Auth check
    if (req.user.role !== 'ADMIN' && String(booking.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const temple = await Temple.findById(booking.templeId);
    const slot = await DarshanSlot.findById(booking.slotId);

    res.json({
      success: true,
      booking,
      temple,
      slot
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    // Retrieve slot to refund seats
    const slot = await DarshanSlot.findById(booking.slotId);
    if (slot) {
      const seatsToRestore = booking.persons.length;
      await DarshanSlot.findByIdAndUpdate(booking.slotId, {
        availableSeats: slot.availableSeats + seatsToRestore,
        status: 'Active' // make active again since we added seats
      });
    }

    // Update status
    await Booking.findByIdAndUpdate(req.params.id, {
      bookingStatus: 'Cancelled',
      paymentStatus: 'Refunded'
    });

    const temple = await Temple.findById(booking.templeId);
    const templeName = temple ? temple.name : 'Temple';

    // Notification
    await Notification.create({
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingId} for ${templeName} has been cancelled and refund initiated.`
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully.'
    });
  } catch (err) {
    next(err);
  }
};

exports.downloadTicket = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      return res.status(404).send('<h1>Booking not found</h1>');
    }

    const temple = await Temple.findById(booking.templeId);
    const slot = await DarshanSlot.findById(booking.slotId);
    const user = await User.findById(booking.userId);

    const ticketHTML = pdfService.generateTicketHTML(
      booking,
      temple || { name: 'Temple' },
      user || { name: 'Devotee' },
      slot || { date: 'N/A', time: 'N/A' },
      booking.ticketQRCode
    );

    res.setHeader('Content-Type', 'text/html');
    res.send(ticketHTML);
  } catch (err) {
    next(err);
  }
};

exports.verifyTicketQR = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Ticket not found. Invalid code.' });
    }

    const temple = await Temple.findById(booking.templeId);
    const slot = await DarshanSlot.findById(booking.slotId);
    const user = await User.findById(booking.userId);

    res.json({
      success: true,
      message: 'Ticket verified successfully.',
      details: {
        bookingId: booking.bookingId,
        devotee: user ? user.name : 'Unknown User',
        templeName: temple ? temple.name : 'Unknown Temple',
        date: slot ? slot.date : 'N/A',
        time: slot ? slot.time : 'N/A',
        persons: booking.persons.length,
        status: booking.bookingStatus,
        payment: booking.paymentStatus
      }
    });
  } catch (err) {
    next(err);
  }
};
