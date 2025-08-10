const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const Parking = require('../models/parking');

// @route   GET api/parking
// @desc    Get all parking locations
router.get('/', async (req, res) => {
    try {
        const { location, radius = 5000 } = req.query;
        
        let query = {};
        if (location) {
            const [lng, lat] = location.split(',').map(parseFloat);
            query.location = {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: radius
                }
            };
        }

        const parkings = await Parking.find(query);
        res.json(parkings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/parking/:id
// @desc    Get parking by ID
router.get('/:id', async (req, res) => {
    try {
        const parking = await Parking.findById(req.params.id);
        if (!parking) {
            return res.status(404).json({ msg: 'Parking not found' });
        }
        res.json(parking);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Parking not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   POST api/parking
// @desc    Create a parking location (Admin only)
router.post('/', [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('totalSpots', 'Total spots is required').isNumeric(),
    check('pricePerHour', 'Price per hour is required').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, address, location, totalSpots, pricePerHour, facilities } = req.body;
        
        const newParking = new Parking({
            name,
            address,
            location: {
                type: 'Point',
                coordinates: location.coordinates || [0, 0]
            },
            totalSpots,
            availableSpots: totalSpots,
            pricePerHour,
            facilities,
            owner: req.user.id
        });

        const parking = await newParking.save();
        res.json(parking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;