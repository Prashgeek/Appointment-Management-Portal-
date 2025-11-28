const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentsByEmail
} = require('../controllers/appointmentController');

router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/by-email/:email', getAppointmentsByEmail);

module.exports = router;
