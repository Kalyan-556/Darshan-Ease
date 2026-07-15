const Temple = require('../models/Temple');

exports.getTemples = async (req, res, next) => {
  try {
    const { state, district, search, specialDarshan } = req.query;
    let filter = {};

    // Standard filter construction
    if (state) filter.state = state;
    if (district) filter.district = district;
    
    let temples = await Temple.find(filter);

    // Apply regex search and custom array filter logic post-fetch for hybrid mock db capability
    if (search) {
      const regex = new RegExp(search, 'i');
      temples = temples.filter(t => regex.test(t.name) || regex.test(t.location) || regex.test(t.description));
    }

    if (specialDarshan) {
      temples = temples.filter(t => t.specialDarshan && t.specialDarshan.includes(specialDarshan));
    }

    res.json({
      success: true,
      count: temples.length,
      temples
    });
  } catch (err) {
    next(err);
  }
};

exports.getTempleById = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found.' });
    }
    res.json({ success: true, temple });
  } catch (err) {
    next(err);
  }
};

exports.createTemple = async (req, res, next) => {
  try {
    const { name, location, district, state, description, history, openingTime, closingTime, specialDarshan, facilities, latitude, longitude } = req.body;

    let image = '';
    let gallery = [];

    // Parse files if uploaded
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        image = `/uploads/temples/${req.files.image[0].filename}`;
      }
      if (req.files.gallery) {
        gallery = req.files.gallery.map(file => `/uploads/temples/${file.filename}`);
      }
    } else if (req.file) {
      image = `/uploads/temples/${req.file.filename}`;
    }

    // Default image if empty
    if (!image) {
      image = 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&q=80&w=600';
    }

    const newTemple = await Temple.create({
      name,
      location,
      district,
      state,
      description,
      history: history || '',
      image,
      gallery,
      openingTime,
      closingTime,
      specialDarshan: Array.isArray(specialDarshan) ? specialDarshan : (specialDarshan ? [specialDarshan] : []),
      facilities: Array.isArray(facilities) ? facilities : (facilities ? [facilities] : []),
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0
    });

    res.status(201).json({
      success: true,
      message: 'Temple created successfully.',
      temple: newTemple
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTemple = async (req, res, next) => {
  try {
    const { name, location, district, state, description, history, openingTime, closingTime, specialDarshan, facilities, latitude, longitude } = req.body;
    
    let updateFields = {
      name, location, district, state, description, history, openingTime, closingTime,
      specialDarshan: Array.isArray(specialDarshan) ? specialDarshan : (specialDarshan ? [specialDarshan] : []),
      facilities: Array.isArray(facilities) ? facilities : (facilities ? [facilities] : []),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    const existing = await Temple.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Temple not found.' });
    }

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        updateFields.image = `/uploads/temples/${req.files.image[0].filename}`;
      }
      if (req.files.gallery) {
        updateFields.gallery = req.files.gallery.map(file => `/uploads/temples/${file.filename}`);
      }
    }

    const updatedTemple = await Temple.findByIdAndUpdate(req.params.id, updateFields);

    res.json({
      success: true,
      message: 'Temple updated successfully.',
      temple: { ...existing, ...updateFields, _id: req.params.id }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTemple = async (req, res, next) => {
  try {
    const deleted = await Temple.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Temple not found.' });
    }
    res.json({ success: true, message: 'Temple deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
