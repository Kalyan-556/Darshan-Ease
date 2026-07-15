const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mockDb = require('../services/mockDbService');

const DonationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'], required: true },
  transactionId: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const MongooseDonation = mongoose.model('Donation', DonationSchema);

const Donation = {
  find: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.find('donations', query);
    return await MongooseDonation.find(query);
  },
  findOne: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findOne('donations', query);
    return await MongooseDonation.findOne(query);
  },
  findById: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findById('donations', id);
    return await MongooseDonation.findById(id);
  },
  create: async (data) => {
    if (dbConfig.isMockDB()) return mockDb.create('donations', data);
    return await MongooseDonation.create(data);
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndUpdate('donations', id, updateData);
    return await MongooseDonation.findByIdAndUpdate(id, updateData, { new: true, ...options });
  },
  findByIdAndDelete: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndDelete('donations', id);
    return await MongooseDonation.findByIdAndDelete(id);
  },
  countDocuments: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.countDocuments('donations', query);
    return await MongooseDonation.countDocuments(query);
  },
  mongooseModel: MongooseDonation
};

module.exports = Donation;
