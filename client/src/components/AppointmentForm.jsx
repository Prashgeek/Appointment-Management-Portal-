// client/src/components/AppointmentForm.jsx
import React, { useState } from 'react';

export default function AppointmentForm({ initial = {}, onSubmit, onDateSelect }) {
  const [form, setForm] = useState({
    patientName: initial.patientName || '',
    patientEmail: initial.patientEmail || '',
    date: initial.date || '',
    time: initial.time || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (key === 'date' && onDateSelect) onDateSelect(value);
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setError('');
    if (!form.patientName || form.patientName.trim().length < 2) return setError('Please enter a valid patient name.');
    if (!form.date) return setError('Please select a date.');
    if (!form.time) return setError('Please select a time.');

    try {
      setSubmitting(true);
      await onSubmit(form);
      // do not clear immediately — let caller handle UI (modal)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Patient name</label>
        <input
          type="text"
          value={form.patientName}
          onChange={(e) => handleChange('patientName', e.target.value)}
          className="mt-1 w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
        <input
          type="email"
          value={form.patientEmail}
          onChange={(e) => handleChange('patientEmail', e.target.value)}
          className="mt-1 w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="name@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium btn-pill"
        >
          {submitting ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </div>
    </form>
  );
}
