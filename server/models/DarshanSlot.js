const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mockDb = require('../services/mockDbService');

const DarshanSlotSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true, index: true },
  date: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: "08:00 AM - 10:00 AM"
  capacity: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Cancelled', 'Full'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

DarshanSlotSchema.index({ templeId: 1, date: 1 });

const MongooseDarshanSlot = mongoose.model('DarshanSlot', DarshanSlotSchema);

const DarshanSlot = {
  find: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.find('darshanslots', query);
    return await MongooseDarshanSlot.find(query);
  },
  findOne: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findOne('darshanslots', query);
    return await MongooseDarshanSlot.findOne(query);
  },
  findById: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findById('darshanslots', id);
    return await MongooseDarshanSlot.findById(id);
  },
  create: async (data) => {
    if (dbConfig.isMockDB()) return mockDb.create('darshanslots', data);
    return await MongooseDarshanSlot.create(data);
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndUpdate('darshanslots', id, updateData);
    return await MongooseDarshanSlot.findByIdAndUpdate(id, updateData, { new: true, ...options });
  },
  findByIdAndDelete: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndDelete('darshanslots', id);
    return await MongooseDarshanSlot.findByIdAndDelete(id);
  },
  countDocuments: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.countDocuments('darshanslots', query);
    return await MongooseDarshanSlot.countDocuments(query);
  },
  mongooseModel: MongooseDarshanSlot
};

module.exports = DarshanSlot;
