Live Demo Link: https://appointment-management-portal-h7ui.vercel.app/
Online Appointment Management Portal (Mini Project)
Overview

This is a small MERN-based web app where users can browse doctors and book appointments.
I built it to demonstrate full-stack skills — API design, database modeling, responsive UI, and clean component structure.

The frontend is made with React + Vite + Tailwind, and the backend runs on Node/Express with MongoDB Atlas.

Features

View a list of doctors (seeded data)

Book an appointment with form validation
→ prevents double-booking for the same doctor, date, and time

See all previously booked appointments

Fully responsive UI (mobile-first)

Clean folder structure for both backend and frontend

Simple, easy-to-understand code suitable for an assignment/interview

Tech Stack

Frontend: React (Vite), Tailwind CSS, React Router

Backend: Node.js, Express, Mongoose

Database: MongoDB Atlas

Other: Joi for validation

Setup Instructions
1. Clone the project
git clone <your-repo-url> online-appointment-portal
cd online-appointment-portal

2. Backend Setup
cd backend
npm install


Create your .env file:

PORT=5000
MONGO_URI=your-mongodb-atlas-uri
CLIENT_URL=http://localhost:5173


Seed sample doctors:
npm run seed


Start backend:
npm run dev


The API will run on:
http://localhost:5000/api

3. Frontend Setup

Open a new terminal:

cd client
npm install



VITE_API_BASE=http://localhost:5000/api


Run the dev server:
npm run dev


Open the app at:
http://localhost:5173


Time Spent:
Approximately 16–19 hours including UI work, backend setup, validation logic, responsiveness, and testing.
