const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mockDb = require('../services/mockDbService');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ORGANIZER', 'ADMIN'], default: 'USER' },
  profileImage: { type: String, default: '' },
  address: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now, index: true }
});

const MongooseUser = mongoose.model('User', UserSchema);

const User = {
  find: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.find('users', query);
    return await MongooseUser.find(query);
  },
  findOne: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findOne('users', query);
    return await MongooseUser.findOne(query);
  },
  findById: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findById('users', id);
    return await MongooseUser.findById(id);
  },
  create: async (data) => {
    if (dbConfig.isMockDB()) return mockDb.create('users', data);
    return await MongooseUser.create(data);
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndUpdate('users', id, updateData);
    return await MongooseUser.findByIdAndUpdate(id, updateData, { new: true, ...options });
  },
  findByIdAndDelete: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndDelete('users', id);
    return await MongooseUser.findByIdAndDelete(id);
  },
  countDocuments: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.countDocuments('users', query);
    return await MongooseUser.countDocuments(query);
  },
  mongooseModel: MongooseUser
};

module.exports = User;
