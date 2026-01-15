require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));

// Seed sample rooms
app.get('/api/seed-rooms', async (req, res) => {
  try {
    const Room = require('./models/Room');
    
    // Clear existing rooms
    await Room.deleteMany({});
    
    // Create sample rooms - 10 for each type
    const sampleRooms = [];
    
    // 10 Single rooms
    for (let i = 1; i <= 10; i++) {
      sampleRooms.push({
        roomNumber: `10${i}`,
        roomType: 'single',
        capacity: 1,
        pricePerNight: 50 + (i * 2),
        description: `Single room ${i} with en-suite bathroom and modern amenities`,
        images: ['assets/single-room-1.jpg']
      });
    }
    
    // 10 Double rooms
    for (let i = 1; i <= 10; i++) {
      sampleRooms.push({
        roomNumber: `20${i}`,
        roomType: 'double',
        capacity: 2,
        pricePerNight: 85 + (i * 2),
        description: `Double room ${i} perfect for couples with king-size bed`,
        images: ['assets/double-room-1.jpg']
      });
    }
    
    // 10 Suite rooms
    for (let i = 1; i <= 10; i++) {
      sampleRooms.push({
        roomNumber: `30${i}`,
        roomType: 'suite',
        capacity: 3,
        pricePerNight: 130 + (i * 3),
        description: `Luxury suite ${i} with living area and premium amenities`,
        images: ['assets/suite-room-1.jpg']
      });
    }
    
    // 10 Deluxe rooms
    for (let i = 1; i <= 10; i++) {
      sampleRooms.push({
        roomNumber: `40${i}`,
        roomType: 'deluxe',
        capacity: 4,
        pricePerNight: 180 + (i * 3),
        description: `Deluxe family room ${i} with multiple beds and full amenities`,
        images: ['assets/deluxe-room-1.jpg']
      });
    }
    
    await Room.insertMany(sampleRooms);
    res.json({ message: 'Sample rooms created successfully!', count: sampleRooms.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Error creating sample rooms', error: error.message });
  }
});

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'Hotel Management API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
