const express = require('express');
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({ message: 'Rooms retrieved', data: rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room retrieved', data: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create room (Admin/Manager only)
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { roomNumber, roomType, capacity, pricePerNight, description, amenities } = req.body;

    if (!roomNumber || !roomType || !capacity || !pricePerNight) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const room = new Room({
      roomNumber,
      roomType,
      capacity,
      pricePerNight,
      description,
      amenities: amenities || []
    });

    await room.save();
    res.status(201).json({ message: 'Room created successfully', data: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update room (Admin/Manager only)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room updated successfully', data: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete room (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully', data: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
