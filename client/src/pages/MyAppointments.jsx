import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../api/api';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchAppointments()
      .then((data) => setAppointments(data))
      .catch(() => setErr('Could not load appointments.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">My Appointments</h1>

      {loading && <p>Loading appointments...</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <div className="space-y-3">
          {appointments.length === 0 && <p>No appointments booked yet.</p>}
          {appointments.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-start border border-gray-100 tilt-wrap">
              <div>
                <div className="font-medium text-gray-900">{a.patientName}</div>
                <div className="text-sm text-gray-600">
                  {a.doctor?.name || 'Doctor'} — {a.date} at {a.time}
                </div>
                {a.patientEmail && <div className="text-xs text-gray-500 mt-1">{a.patientEmail}</div>}
              </div>
              <div className="text-xs text-gray-500 mt-1">Booked</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
