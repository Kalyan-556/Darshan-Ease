const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mockDb = require('../services/mockDbService');

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongooseFeedback = mongoose.model('Feedback', FeedbackSchema);

const Feedback = {
  find: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.find('feedbacks', query);
    return await MongooseFeedback.find(query);
  },
  findOne: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findOne('feedbacks', query);
    return await MongooseFeedback.findOne(query);
  },
  findById: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findById('feedbacks', id);
    return await MongooseFeedback.findById(id);
  },
  create: async (data) => {
    if (dbConfig.isMockDB()) return mockDb.create('feedbacks', data);
    return await MongooseFeedback.create(data);
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndUpdate('feedbacks', id, updateData);
    return await MongooseFeedback.findByIdAndUpdate(id, updateData, { new: true, ...options });
  },
  findByIdAndDelete: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndDelete('feedbacks', id);
    return await MongooseFeedback.findByIdAndDelete(id);
  },
  countDocuments: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.countDocuments('feedbacks', query);
    return await MongooseFeedback.countDocuments(query);
  },
  mongooseModel: MongooseFeedback
};

module.exports = Feedback;
