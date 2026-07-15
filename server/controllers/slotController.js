const DarshanSlot = require('../models/DarshanSlot');
const Temple = require('../models/Temple');

exports.getSlotsByTemple = async (req, res, next) => {
  try {
    const { templeId } = req.params;
    const { date } = req.query; // Format: YYYY-MM-DD
    
    let filter = { templeId };
    if (date) {
      filter.date = date;
    }

    const slots = await DarshanSlot.find(filter);
    res.json({
      success: true,
      count: slots.length,
      slots
    });
  } catch (err) {
    next(err);
  }
};

exports.createSlot = async (req, res, next) => {
  try {
    const { templeId, date, time, capacity, price } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found.' });
    }

    const newSlot = await DarshanSlot.create({
      templeId,
      date,
      time,
      capacity: parseInt(capacity),
      availableSeats: parseInt(capacity),
      price: parseFloat(price) || 0,
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Darshan slot created successfully.',
      slot: newSlot
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSlot = async (req, res, next) => {
  try {
    const { date, time, capacity, availableSeats, price, status } = req.body;
    const updateData = {};

    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (availableSeats !== undefined) updateData.availableSeats = parseInt(availableSeats);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (status) updateData.status = status;

    const updated = await DarshanSlot.findByIdAndUpdate(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Slot not found.' });
    }

    res.json({
      success: true,
      message: 'Slot updated successfully.',
      slot: { ...updated, ...updateData }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSlot = async (req, res, next) => {
  try {
    const deleted = await DarshanSlot.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Slot not found.' });
    }
    res.json({ success: true, message: 'Slot deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
