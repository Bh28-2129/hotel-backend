const express = require('express');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get payments
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    const payments = await Payment.find(query)
      .populate('bookingId');

    res.status(200).json({ message: 'Payments retrieved', data: payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create payment
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = new Payment({
      bookingId,
      amount: booking.totalPrice,
      paymentMethod,
      transactionId: 'TXN' + Date.now(),
      status: 'completed'
    });

    await payment.save();

    // Update booking payment status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    res.status(201).json({ message: 'Payment processed successfully', data: payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
