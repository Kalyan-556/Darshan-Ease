const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mockDb = require('../services/mockDbService');

const TempleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  description: { type: String, required: true },
  history: { type: String, default: '' },
  image: { type: String, required: true },
  gallery: { type: [String], default: [] },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  specialDarshan: { type: [String], default: [] },
  facilities: { type: [String], default: [] },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongooseTemple = mongoose.model('Temple', TempleSchema);

const Temple = {
  find: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.find('temples', query);
    return await MongooseTemple.find(query);
  },
  findOne: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findOne('temples', query);
    return await MongooseTemple.findOne(query);
  },
  findById: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findById('temples', id);
    return await MongooseTemple.findById(id);
  },
  create: async (data) => {
    if (dbConfig.isMockDB()) return mockDb.create('temples', data);
    return await MongooseTemple.create(data);
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndUpdate('temples', id, updateData);
    return await MongooseTemple.findByIdAndUpdate(id, updateData, { new: true, ...options });
  },
  findByIdAndDelete: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndDelete('temples', id);
    return await MongooseTemple.findByIdAndDelete(id);
  },
  countDocuments: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.countDocuments('temples', query);
    return await MongooseTemple.countDocuments(query);
  },
  mongooseModel: MongooseTemple
};

module.exports = Temple;
