const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect, authorize } = require('../middleware/auth');
// Email sending is skipped for guest bookings

const router = express.Router();

// Generate unique booking ID
const generateBookingId = () => {
  return 'BK' + Date.now();
};

// Get all bookings (optionally protected)
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    if (req.user && req.user.role === 'guest') {
      query.guestId = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate('roomId', 'roomNumber roomType pricePerNight');

    res.status(200).json({ message: 'Bookings retrieved', data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create booking (public)
router.post('/', async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

    if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    const totalPrice = room.pricePerNight * nights;

    const booking = new Booking({
      bookingId: generateBookingId(),
      guestId: null, // guest bookings without login
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests,
      status: 'pending'
    });

    await booking.save();
    const populatedBooking = await booking.populate('roomId');

    res.status(201).json({ message: 'Booking created successfully', data: populatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status (Admin/Manager only)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate('guestId roomId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking updated successfully', data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.guestId && booking.guestId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
