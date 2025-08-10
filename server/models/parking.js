const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    totalSpots: { type: Number, required: true },
    availableSpots: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    facilities: [String],
    images: [String],
    lat: Number,
    lng: Number,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

parkingSchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Parking || mongoose.model('Parking', parkingSchema);
//this checks
//If the model was already registered (mongoose.models.Parking)
//If not, it registers it