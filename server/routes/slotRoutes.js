const express = require('express');
const slotController = require('../controllers/slotController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/temple/:templeId', slotController.getSlotsByTemple);

// Protected routes (Organizers and Admins)
router.post('/', verifyToken, authorizeRoles('ORGANIZER', 'ADMIN'), slotController.createSlot);
router.put('/:id', verifyToken, authorizeRoles('ORGANIZER', 'ADMIN'), slotController.updateSlot);
router.delete('/:id', verifyToken, authorizeRoles('ORGANIZER', 'ADMIN'), slotController.deleteSlot);

module.exports = router;
