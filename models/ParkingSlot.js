const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true
  },
  slotType: {
    type: String,
    enum: ['standard', 'disabled', 'electric'],
    default: 'standard'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  floor: {
    type: Number,
    required: true
  },
  ratePerHour: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema);