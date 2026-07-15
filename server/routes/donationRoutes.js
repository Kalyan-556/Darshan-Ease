const express = require('express');
const donationController = require('../controllers/donationController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, donationController.createDonation);
router.get('/my-donations', verifyToken, donationController.getUserDonations);

module.exports = router;
