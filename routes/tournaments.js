const express = require('express');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tournaments
// @desc    Get all tournaments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { game, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (game) query.game = game;
    if (status) query.status = status;

    const tournaments = await Tournament.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tournament.countDocuments(query);

    res.json({
      tournaments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tournaments/:id
// @desc    Get tournament by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('participants.userId', 'name email');

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tournaments
// @desc    Create tournament
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      game,
      prizePool,
      description,
      rules,
      registrationLink,
      imageUrl,
      maxParticipants,
      registrationDeadline,
      tournamentDate
    } = req.body;

    const tournament = new Tournament({
      title,
      game,
      prizePool,
      description,
      rules,
      registrationLink,
      imageUrl,
      maxParticipants,
      registrationDeadline,
      tournamentDate,
      createdBy: req.user._id
    });

    await tournament.save();
    await tournament.populate('createdBy', 'name email');

    res.status(201).json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tournaments/:id
// @desc    Update tournament
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('createdBy', 'name email');

    res.json(updatedTournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tournaments/:id
// @desc    Delete tournament
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    await Tournament.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tournaments/:id/register
// @desc    Register for tournament
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if already registered
    const alreadyRegistered = tournament.participants.some(
      participant => participant.userId.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this tournament' });
    }

    // Check if tournament is full
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    // Check if registration deadline has passed
    if (new Date() > tournament.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Add participant
    tournament.participants.push({ userId: req.user._id });
    tournament.currentParticipants += 1;
    await tournament.save();

    // Add tournament to user's registered tournaments
    await User.findByIdAndUpdate(req.user._id, {
      $push: { registeredTournaments: { tournamentId: tournament._id } }
    });

    res.json({ message: 'Successfully registered for tournament' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;