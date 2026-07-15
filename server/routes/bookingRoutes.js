const express = require('express');
const bookingController = require('../controllers/bookingController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, bookingController.bookSlot);
router.get('/my-bookings', verifyToken, bookingController.getUserBookings);
router.get('/:id', verifyToken, bookingController.getBookingDetails);
router.put('/:id/cancel', verifyToken, bookingController.cancelBooking);
router.get('/ticket/:bookingId', bookingController.downloadTicket);

// Ticket verification by organizers/admins at temple entrances
router.post('/verify-qr', verifyToken, authorizeRoles('ORGANIZER', 'ADMIN'), bookingController.verifyTicketQR);

module.exports = router;
