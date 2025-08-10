const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Parking = require('./models/parking'); 

const seedData = [
  {
    name: "City Center Mall",
    address: "123 Main St, Downtown",
    totalSpots: 50,
    availableSpots: 24,
    pricePerHour: 5,
    facilities: ["CCTV", "EV Charging"],
    images: ["mall.jpg"],
    lat: 28.6139,
    lng: 77.2090,
    location: {
      type: "Point",
      coordinates: [77.2090, 28.6139] 
    }
  },
  {
    name: "General Hospital",
    address: "456 Health Ave, Medical District",
    totalSpots: 30,
    availableSpots: 8,
    pricePerHour: 3,
    facilities: ["Security", "Lift Access"],
    images: ["hospital.jpg"],
    lat: 19.0760,
    lng: 72.8777,
    location: {
      type: "Point",
      coordinates: [72.8777, 19.0760]
    }
  },
  {
    name: "Metro Theater",
    address: "789 Arts Blvd, Cultural Center",
    totalSpots: 40,
    availableSpots: 15,
    pricePerHour: 7,
    facilities: ["Guard", "Restroom"],
    images: ["theater.jpg"],
    lat: 13.0827,
    lng: 80.2707,
    location: {
      type: "Point",
      coordinates: [80.2707, 13.0827]
    }
  },
  {
    name: "Central Station",
    address: "321 Transit Rd, Transport Hub",
    totalSpots: 100,
    availableSpots: 42,
    pricePerHour: 10,
    facilities: ["Bike Parking", "Sheltered"],
    images: ["station.jpg"],
    lat: 22.5726,
    lng: 88.3639,
    location: {
      type: "Point",
      coordinates: [88.3639, 22.5726]
    }
  }
];


async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkingdb');
    await Parking.deleteMany({});
    await Parking.insertMany(seedData);
    console.log(' Parking locations seeded successfully!');
  } catch (err) {
    console.error(' Error seeding DB:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
