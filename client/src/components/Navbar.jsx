import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const linkClass = (path) =>
    `text-sm md:text-base px-3  py-1 rounded-full transition ${
      location.pathname === path ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-50'
    }`;

  return (
    <nav className="backdrop-blur-md sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-md flex items-center justify-center text-white text-lg font-bold">
            CC
          </div>
          <div>
            <div className="font-semibold text-indigo-700 text-lg">ClinicConnect</div>
            <div className="text-xs text-gray-500 -mt-0.5">Book appointments easily</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/" className={linkClass('/')}>Doctors</Link>
          <Link to="/appointments" className={linkClass('/appointments')}>My Appointments</Link>
        </div>
      </div>
    </nav>
  );
}
