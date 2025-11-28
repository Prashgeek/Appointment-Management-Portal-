import React, { useEffect, useState } from 'react';
import { fetchDoctors } from '../api/api';
import DoctorCard from '../components/DoctorCard';

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchDoctors()
      .then((d) => mounted && setDoctors(d))
      .catch(() => mounted && setErr('Unable to load doctors at the moment.'))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <header className="mb-8 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Find a doctor that fits your needs
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl">
            Browse doctors and pick a convenient slot. Fast and simple — just how it should be.
          </p>

          <div className="mt-6 flex gap-3">
            <a href="#doctors" className="btn-pill bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Browse Doctors
            </a>
          </div>
        </div>

        <div className="floaty">
          <div className="glass-card p-4">
            <div className="flex items-center gap-4">
              <div className="avatar-circle">MD</div>
              <div>
                <div className="text-sm text-gray-500">Featured</div>
                <div className="font-semibold text-gray-900">Dr. Aisha Khan</div>
                <div className="text-xs text-gray-500 mt-1">General Physician · ₹300</div>
              </div>
              <div className="ml-auto">
                <span className="status-pill status-green">Open today</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="doctors">
        <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>

        {loading && <p>Loading doctors...</p>}
        {err && <p className="text-red-600">{err}</p>}

        {!loading && !err && (
          <div className="doctor-list grid gap-4">
            {doctors.length === 0 && <p>No doctors available right now.</p>}
            {doctors.map((d) => (
              <DoctorCard key={d._id} doctor={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
