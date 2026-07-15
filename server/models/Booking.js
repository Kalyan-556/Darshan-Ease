const mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mockDb = require('../services/mockDbService');

const PassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }
});

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'DarshanSlot', required: true },
  persons: [PassengerSchema], // Array of traveler details
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Paid' },
  ticketQRCode: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseBooking = mongoose.model('Booking', BookingSchema);

const Booking = {
  find: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.find('bookings', query);
    return await MongooseBooking.find(query);
  },
  findOne: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findOne('bookings', query);
    return await MongooseBooking.findOne(query);
  },
  findById: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findById('bookings', id);
    return await MongooseBooking.findById(id);
  },
  create: async (data) => {
    if (dbConfig.isMockDB()) return mockDb.create('bookings', data);
    return await MongooseBooking.create(data);
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndUpdate('bookings', id, updateData);
    return await MongooseBooking.findByIdAndUpdate(id, updateData, { new: true, ...options });
  },
  findByIdAndDelete: async (id) => {
    if (dbConfig.isMockDB()) return mockDb.findByIdAndDelete('bookings', id);
    return await MongooseBooking.findByIdAndDelete(id);
  },
  countDocuments: async (query = {}) => {
    if (dbConfig.isMockDB()) return mockDb.countDocuments('bookings', query);
    return await MongooseBooking.countDocuments(query);
  },
  mongooseModel: MongooseBooking
};

module.exports = Booking;
