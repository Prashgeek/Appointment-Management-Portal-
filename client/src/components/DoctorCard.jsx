// client/src/components/DoctorCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Star({ filled = true }) {
  return (
    <svg
      className={filled ? 'w-4 h-4 star-fill' : 'w-4 h-4 star-empty'}
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.044 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.05 2.927z" />
    </svg>
  );
}

export default function DoctorCard({ doctor }) {
  const initials = doctor.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  // prepare star UI (rounded rating to nearest 0.5 or floor)
  const rating = typeof doctor.rating === 'number' ? doctor.rating : 4.5;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const totalStars = 5;

  return (
    <div className="card-wrap w-full">
      <div className="tilt-wrap">
        <div className="tilt-card glass-card p-4 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex items-center justify-center flex-shrink-0">
            <div className="avatar-circle">{initials}</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{doctor.name}</h3>
                <p className="text-sm text-gray-600 mt-1 truncate">{doctor.specialization}</p>
              </div>

              <div className="text-right">
                <div className="rating-pill">
                  <div className="flex items-center gap-1">
                    {[...Array(totalStars)].map((_, i) => {
                      const starIndex = i + 1;
                      const filled = starIndex <= fullStars || (halfStar && starIndex === fullStars + 1);
                      return <span key={i} aria-hidden="true"><Star filled={filled} /></span>;
                    })}
                  </div>
                  <span className="text-sm ml-2">{rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm font-medium text-gray-900">
              Fee: <span className="text-indigo-600">₹{doctor.fee}</span>
            </p>
          </div>

          <div className="self-stretch flex items-center sm:self-center">
            <Link
              to={`/book/${doctor._id}`}
              className="btn-pill bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
