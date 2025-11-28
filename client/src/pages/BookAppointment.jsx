// client/src/pages/BookAppointment.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDoctors, fetchAppointmentsForDate, createAppointment } from '../api/api';
import AppointmentForm from '../components/AppointmentForm';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:30', '14:30', '15:30', '16:30', '17:30'
];

function StarSmall({ filled = true }) {
  return (
    <svg className={filled ? 'w-4 h-4 star-fill' : 'w-4 h-4 star-empty'} viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.044 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.05 2.927z" />
    </svg>
  );
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const nav = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotLoad, setSlotLoad] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null); // holds confirmed appointment details

  useEffect(() => {
    let mounted = true;
    fetchDoctors()
      .then((list) => {
        if (!mounted) return;
        setDoctor(list.find((d) => d._id === doctorId) || null);
      })
      .catch(() => setError('Failed to load doctor info.'))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      setSlotLoad(null);
      return;
    }

    fetchAppointmentsForDate(doctorId, selectedDate)
      .then((list) => {
        const times = list.map((a) => a.time);
        setBookedSlots(times);
        const count = times.length;
        if (count <= 2) setSlotLoad('green');
        else if (count <= 5) setSlotLoad('yellow');
        else setSlotLoad('red');
      })
      .catch(() => {
        setBookedSlots([]);
        setSlotLoad(null);
      });
  }, [selectedDate, doctorId]);

  const handleSubmit = async (payload) => {
    try {
      setError('');
      const created = await createAppointment({ ...payload, doctor: doctorId });
      // created is the appointment object returned by backend (may not have populated doctor)
      // attach doctor info for modal (we already have doctor in state)
      const appointmentForModal = {
        _id: created._id,
        patientName: created.patientName,
        patientEmail: created.patientEmail,
        date: created.date,
        time: created.time,
        doctor: doctor
      };
      setConfirmed(appointmentForModal);
      setMessage('Appointment confirmed.');
      // refresh booked slots so UI updates immediately
      setBookedSlots((prev) => [...prev, created.time]);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not book appointment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  // compute small rating UI
  const rating = typeof doctor.rating === 'number' ? doctor.rating : 4.5;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const totalStars = 5;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{doctor.name}</h2>
          <div className="ml-3 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(totalStars)].map((_, i) => {
                const starIndex = i + 1;
                const filled = starIndex <= fullStars || (halfStar && starIndex === fullStars + 1);
                return <span key={i}><StarSmall filled={filled} /></span>;
              })}
            </div>
            <div className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">{doctor.specialization} · <span className="text-indigo-600">₹{doctor.fee}</span></p>
      </div>

      {/* slot load */}
      {selectedDate && slotLoad && (
        <div className="mb-4">
          <div className={`p-3 rounded-lg font-medium ${slotLoad === 'green' ? 'status-green' : slotLoad === 'yellow' ? 'status-yellow' : 'status-red'}`}>
            {slotLoad === 'green' && 'Good availability on this date'}
            {slotLoad === 'yellow' && 'Slots filling up — book soon'}
            {slotLoad === 'red' && 'Busy day — few slots left'}
          </div>
        </div>
      )}

      {message && <div className="mb-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        <AppointmentForm onSubmit={handleSubmit} onDateSelect={(d) => setSelectedDate(d)} />

        <div className="bg-white p-4 rounded-xl glass-card">
          <h3 className="font-semibold mb-3">Available time slots</h3>
          {!selectedDate && <p className="text-sm text-gray-500">Pick a date to see availability</p>}

          {selectedDate && (
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((t) => {
                const isBooked = bookedSlots.includes(t);
                return (
                  <div
                    key={t}
                    className={`timeslot ${isBooked ? 'timeslot-busy' : 'timeslot-free'}`}
                    aria-disabled={isBooked}
                  >
                    {t} {isBooked ? '• Booked' : ''}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmed && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg avatar-circle flex items-center justify-center text-lg font-bold">
                {doctor.name.split(' ').slice(0,2).map(n=>n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">Appointment confirmed</div>
                <div className="font-semibold text-lg text-gray-900 mt-1">{doctor.name}</div>
                <div className="text-sm text-gray-600 mt-1">{doctor.specialization}</div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500">Patient</div>
                    <div className="font-medium text-gray-900">{confirmed.patientName}</div>
                    {confirmed.patientEmail && <div className="text-xs text-gray-500">{confirmed.patientEmail}</div>}
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-xs text-gray-500">When</div>
                    <div className="font-medium text-gray-900">{confirmed.date} at {confirmed.time}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-white border"
                onClick={() => {
                  setConfirmed(null); // close modal
                }}
              >
                Close
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                onClick={() => {
                  setConfirmed(null);
                  nav('/appointments');
                }}
              >
                View my appointments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
