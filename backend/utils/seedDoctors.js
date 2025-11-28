// backend/utils/seedDoctors.js — simple seed script to add a doctors
require('dotenv').config();
const connectDB = require('../config/db');
const Doctor = require('../models/Doctor');

const doctors = [
  { name: 'Dr. Aisha Khan', specialization: 'General Physician', fee: 300, rating: 4.7 },
  { name: 'Dr. Rahul Sharma', specialization: 'Cardiologist', fee: 800, rating: 4.6 },
  { name: 'Dr. Sanya Patel', specialization: 'Dermatologist', fee: 500, rating: 4.5 },
  { name: 'Dr. Vivek Gupta', specialization: 'Orthopedics', fee: 600, rating: 4.4 }
];

(async function seed() {
  try {
    await connectDB(process.env.MONGO_URI);
    await Doctor.deleteMany({});
    await Doctor.insertMany(doctors);
    console.log('Doctors seeded with ratings');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
