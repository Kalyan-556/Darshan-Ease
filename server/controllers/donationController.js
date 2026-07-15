const Donation = require('../models/Donation');
const Temple = require('../models/Temple');
const Notification = require('../models/Notification');

exports.createDonation = async (req, res, next) => {
  try {
    const { templeId, amount, paymentMethod } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found.' });
    }

    const transactionId = 'TXN-' + Math.random().toString(36).substring(2,10).toUpperCase() + Date.now().toString().slice(-4);

    const newDonation = await Donation.create({
      userId: req.user.id,
      templeId,
      amount: parseFloat(amount),
      paymentMethod,
      transactionId
    });

    // Notify user
    await Notification.create({
      userId: req.user.id,
      title: 'Donation Contributed!',
      message: `Thank you! Your donation of ₹${amount} to ${temple.name} was successfully received. Transaction ID: ${transactionId}`
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your generous contribution!',
      donation: newDonation
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ userId: req.user.id });
    
    // Enrich donation records with temple details manually for hybrid mock db support
    const enriched = [];
    for (let don of donations) {
      const temple = await Temple.findById(don.templeId);
      enriched.push({
        ...don,
        templeName: temple ? temple.name : 'Temple'
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
