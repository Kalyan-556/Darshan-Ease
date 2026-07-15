const Feedback = require('../models/Feedback');
const User = require('../models/User');

exports.addFeedback = async (req, res, next) => {
  try {
    const { templeId, rating, review } = req.body;

    const newFeedback = await Feedback.create({
      userId: req.user.id,
      templeId,
      rating: parseInt(rating),
      review
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback: newFeedback
    });
  } catch (err) {
    next(err);
  }
};

exports.getTempleFeedback = async (req, res, next) => {
  try {
    const { templeId } = req.params;
    const feedbacks = await Feedback.find({ templeId });

    // Enrich feedback records with user names
    const enriched = [];
    for (let f of feedbacks) {
      const user = await User.findById(f.userId);
      enriched.push({
        ...f,
        userName: user ? user.name : 'Devotee',
        userImage: user ? user.profileImage : ''
      });
    }

    res.json({
      success: true,
      count: enriched.length,
      feedbacks: enriched
    });
  } catch (err) {
    next(err);
  }
};
