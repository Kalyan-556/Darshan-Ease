const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mockDb = require('../services/mockDbService');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const MongooseNotification = mongoose.model('Notification', NotificationSchema);

const Notification = {
  find: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.find('notifications', query);
    return await MongooseNotification.find(query);
  },
  findOne: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findOne('notifications', query);
    return await MongooseNotification.findOne(query);
  },
  findById: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findById('notifications', id);
    return await MongooseNotification.findById(id);
  },
  create: async (data) => {
    if (dbConfig.isMockDB()) return mockDb.create('notifications', data);
    return await MongooseNotification.create(data);
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndUpdate('notifications', id, updateData);
    return await MongooseNotification.findByIdAndUpdate(id, updateData, { new: true, ...options });
  },
  findByIdAndDelete: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndDelete('notifications', id);
    return await MongooseNotification.findByIdAndDelete(id);
  },
  countDocuments: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.countDocuments('notifications', query);
    return await MongooseNotification.countDocuments(query);
  },
  mongooseModel: MongooseNotification
};

module.exports = Notification;
