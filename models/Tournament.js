const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  game: {
    type: String,
    required: true,
    enum: ['BGMI', 'Free Fire', 'CODM', 'Clash Of Clans', 'Clash Royale', 'Brawl Stars', 'Pokemon Unite']
  },
  prizePool: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rules: {
    type: String,
    required: true
  },
  registrationLink: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  maxParticipants: {
    type: Number,
    default: 100
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  tournamentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
tournamentSchema.index({ game: 1, status: 1 });
tournamentSchema.index({ tournamentDate: 1 });

module.exports = mongoose.model('Tournament', tournamentSchema);