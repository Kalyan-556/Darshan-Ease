const User = require('../models/User');
const Booking = require('../models/Booking');
const Temple = require('../models/Temple');
const Donation = require('../models/Donation');
const DarshanSlot = require('../models/DarshanSlot');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({ role: 'USER' });
    const organizerCount = await User.countDocuments({ role: 'ORGANIZER' });
    const templeCount = await Temple.countDocuments({});
    const slotCount = await DarshanSlot.countDocuments({});
    
    // Calculate total donations and bookings
    const donations = await Donation.find({});
    const totalDonationAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    const bookings = await Booking.find({});
    const totalBookingAmount = bookings.filter(b => b.bookingStatus === 'Confirmed').reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const totalRevenue = totalBookingAmount + totalDonationAmount;

    // Compile Recent bookings
    const sortedBookings = [...bookings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentBookings = [];
    for (let b of sortedBookings) {
      const u = await User.findById(b.userId);
      const t = await Temple.findById(b.templeId);
      const s = await DarshanSlot.findById(b.slotId);
      recentBookings.push({
        _id: b._id,
        bookingId: b.bookingId,
        userName: u ? u.name : 'Unknown User',
        templeName: t ? t.name : 'Unknown Temple',
        date: s ? s.date : 'N/A',
        time: s ? s.time : 'N/A',
        amount: b.totalAmount,
        status: b.bookingStatus
      });
    }

    // Compile Recent users
    const allUsers = await User.find({});
    const recentUsers = [...allUsers].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));

    // Mock Chart Data
    const monthlyBookings = [
      { month: 'Jan', count: 12 },
      { month: 'Feb', count: 19 },
      { month: 'Mar', count: 32 },
      { month: 'Apr', count: 48 },
      { month: 'May', count: 65 },
      { month: 'Jun', count: 80 }
    ];

    const templeRevenue = [];
    const templesList = await Temple.find({});
    for (let t of templesList.slice(0, 4)) {
      const tBookings = bookings.filter(b => String(b.templeId) === String(t._id) && b.bookingStatus === 'Confirmed');
      const amount = tBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      templeRevenue.push({
        name: t.name,
        value: amount || 500 // fallback mock value for layout
      });
    }

    res.json({
      success: true,
      stats: {
        users: userCount,
        organizers: organizerCount,
        temples: templeCount,
        slots: slotCount,
        bookingsCount: bookings.length,
        donationsCount: donations.length,
        totalDonations: totalDonationAmount,
        totalBookingsRevenue: totalBookingAmount,
        totalRevenue
      },
      charts: {
        monthlyBookings,
        templeRevenue
      },
      recentBookings,
      recentUsers
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        address: u.address,
        createdAt: u.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ORGANIZER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, { role });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: `User role updated to ${role} successfully.` });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({});
    const enriched = [];
    for (let b of bookings) {
      const u = await User.findById(b.userId);
      const t = await Temple.findById(b.templeId);
      const s = await DarshanSlot.findById(b.slotId);
      enriched.push({
        ...b,
        userName: u ? u.name : 'Unknown User',
        templeName: t ? t.name : 'Unknown Temple',
        date: s ? s.date : 'N/A',
        time: s ? s.time : 'N/A'
      });
    }
    res.json({
      success: true,
      count: enriched.length,
      bookings: enriched
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({});
    const enriched = [];
    for (let d of donations) {
      const u = await User.findById(d.userId);
      const t = await Temple.findById(d.templeId);
      enriched.push({
        ...d,
        userName: u ? u.name : 'Unknown User',
        templeName: t ? t.name : 'Unknown Temple'
      });
    }
    res.json({
      success: true,
      count: enriched.length,
      donations: enriched
    });
  } catch (err) {
    next(err);
  }
};

exports.exportBookingsCSV = async (req, res, next) => {
  try {
    const bookings = await Booking.find({});
    let csv = 'Booking ID,Devotee Name,Temple Name,Date,Time,Total Price,Booking Status,Payment Status\n';
    
    for (let b of bookings) {
      const u = await User.findById(b.userId);
      const t = await Temple.findById(b.templeId);
      const s = await DarshanSlot.findById(b.slotId);
      
      const uName = u ? u.name.replace(/,/g, '') : 'N/A';
      const tName = t ? t.name.replace(/,/g, '') : 'N/A';
      const date = s ? s.date : 'N/A';
      const time = s ? s.time : 'N/A';

      csv += `${b.bookingId},${uName},${tName},${date},${time},₹${b.totalAmount},${b.bookingStatus},${b.paymentStatus}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=darshanease_bookings.csv');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
