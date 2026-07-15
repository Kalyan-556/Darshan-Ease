const express = require('express');
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes under /api/admin to ADMIN role only
router.use(verifyToken);
router.use(authorizeRoles('ADMIN'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.get('/bookings', adminController.getAllBookings);
router.get('/donations', adminController.getAllDonations);
router.get('/bookings/export', adminController.exportBookingsCSV);

module.exports = router;
