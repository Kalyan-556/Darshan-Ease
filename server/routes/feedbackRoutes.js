const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, feedbackController.addFeedback);
router.get('/temple/:templeId', feedbackController.getTempleFeedback);

module.exports = router;
