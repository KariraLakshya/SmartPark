require('dotenv').config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');
const bookingRoutes = require('./routes/booking');
const userRoutes = require('./routes/users');



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkingdb';
// Database connection
mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));