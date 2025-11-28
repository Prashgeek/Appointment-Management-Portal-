import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  timeout: 8000,
});

export const fetchDoctors = () => API.get('/doctors').then((r) => r.data);
export const createAppointment = (payload) => API.post('/appointments', payload).then((r) => r.data);
export const fetchAppointments = () => API.get('/appointments').then((r) => r.data);

// helper to fetch appointment list and filter client-side by doctor/date/time
export const fetchAppointmentsForDate = (doctorId, date) =>
  API.get('/appointments').then((r) =>
    r.data.filter((a) => {
      const did = a.doctor && a.doctor._id ? a.doctor._id : (a.doctor || '');
      return String(did) === String(doctorId) && a.date === date;
    })
  );

export default API;
