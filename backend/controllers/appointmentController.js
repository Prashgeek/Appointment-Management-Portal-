const Appointment = require('../models/Appointment');
const Joi = require('joi');

const appointmentSchema = Joi.object({
  patientName: Joi.string().min(2).max(50).required(),
  patientEmail: Joi.string().email().optional().allow(''),
  doctor: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required()
});

exports.createAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Prevent double booking for same doctor, date and time
    const exists = await Appointment.findOne({
      doctor: value.doctor,
      date: value.date,
      time: value.time
    });

    if (exists) {
      return res.status(400).json({ error: 'Slot already booked for this doctor.' });
    }

    const appointment = await Appointment.create(value);
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAppointmentsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const appointments = await Appointment.find({ patientEmail: email }).populate('doctor');
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
