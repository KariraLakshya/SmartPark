const express = require('express');
const router = express.Router();
const { check,validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Booking = require('../models/booking');
const Parking = require('../models/parking');

// @route   GET api/bookings
// @desc    Get user bookings
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('parking', 'name address');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/bookings
// @desc    Create a booking
router.post('/', [
    auth,
    check('parkingId', 'Parking ID is required').not().isEmpty(),
    check('vehicleNumber', 'Vehicle number is required').not().isEmpty(),
    check('startTime', 'Start time is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { parkingId, vehicleNumber, startTime, duration } = req.body;
        
        // Check parking availability
        const parking = await Parking.findById(parkingId);
        if (!parking || parking.availableSpots <= 0) {
            return res.status(400).json({ msg: 'No available spots' });
        }

        const start = new Date(startTime);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
        const totalPrice = parking.pricePerHour * duration;

        // Check for overlapping bookings
        const overlapping = await Booking.findOne({
            parking: parkingId,
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        if (overlapping) {
            return res.status(400).json({ msg: 'Time slot not available' });
        }

        // Create booking
        const newBooking = new Booking({
            user: req.user.id,
            parking: parkingId,
            vehicleNumber,
            startTime: start,
            endTime: end,
            totalPrice,
            status: 'upcoming'
        });

        // Update parking availability
        parking.availableSpots -= 1;
        await parking.save();

        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Check user owns the booking
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Only upcoming bookings can be cancelled
        if (booking.status !== 'upcoming') {
            return res.status(400).json({ msg: 'Only upcoming bookings can be cancelled' });
        }

        // Update parking availability
        const parking = await Parking.findById(booking.parking);
        parking.availableSpots += 1;
        await parking.save();

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Booking not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;