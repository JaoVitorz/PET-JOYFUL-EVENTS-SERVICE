const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [100, 'Título não pode exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: [2000, 'Descrição não pode exceder 2000 caracteres']
  },
  eventType: {
    type: String,
    enum: ['adoption_fair', 'vaccination_campaign', 'awareness', 'workshop', 'other'],
    required: true,
    default: 'adoption_fair'
  },
  startDate: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },
  endDate: {
    type: Date,
    required: [true, 'Data de término é obrigatória']
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  organizer: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    min: 1,
    default: null
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  participants: [{
    userId: String,
    registeredAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  imageUrl: String,
  tags: [String]
}, {
  timestamps: true
});

eventSchema.index({ startDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ status: 1 });

eventSchema.methods.hasAvailableSlots = function() {
  if (!this.maxParticipants) return true;
  return this.currentParticipants < this.maxParticipants;
};

module.exports = mongoose.model('Event', eventSchema);