const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    
    // Sort in reverse order (newest first)
    const sorted = [...notifications].sort((a,b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      count: sorted.length,
      notifications: sorted
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
};
