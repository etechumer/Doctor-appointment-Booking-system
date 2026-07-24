# Healthcare Management System (Doctor Appointment System)

A full-stack Doctor Appointment and Health Management System.

This repository contains a Node.js backend and a Vite + React frontend for booking appointments, managing users (admins, doctors, patients), and an AI health agent service.

## Table of Contents

- Project Overview
- Features
- Tech Stack
- Repository Structure
- Prerequisites
- Setup & Installation
  - Backend
  - Frontend
- Environment Variables
- Database
- Running Locally
- API Routes (overview)
- Services
- Contributing
- License

## Project Overview

This project implements a platform where patients can book appointments with doctors, admins can manage doctors and appointments, and doctors can manage their schedules. It includes an AI-powered health assistant service and email integration.

## Features

- User authentication (patients, doctors, admins)
- Book, view, approve, reject appointments
- Admin dashboard for managing doctors & patients
- Doctor dashboard for appointment management
- Patient dashboard to book and view appointments
- Email notifications via Gmail service
- AI health assistant integration ( Ollama / healthAgent )

## Tech Stack

- Backend: Node.js, Express
- Database: (SQL file provided) — keep your preferred SQL server (Postgres / MySQL / SQLite)
- Frontend: React + Vite

## Repository Structure

Top-level backend files and folders:

- `backend/`
  - `.env` (environment variables)
  - `index.js` (backend entry)
  - `package.json`
  - `queries.sql` (database schema / queries)
  - `controlllers/`
    - `adminController.js`
    - `authController.js`
    - `doctorContorller.js`
    - `landingPageController.js`
    - `patientController.js`
  - `db/`
    - `db.js`
  - `middlewares/`
    - `adminMiddleware.js`
    - `authMiddleware.js`
  - `routes/`
    - `adminRoutes.js`
    - `authRoutes.js`
    - `doctorRoutes.js`
    - `index.js`
    - `landingPageRoutes.js`
    - `patientRoutes.js`
  - `services/`
    - `gmail.js`
    - `healthAgent.js`
    - `ollama.js`

Frontend lives in `frontend/` and contains a Vite + React app (see `frontend/package.json`).

## Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- A SQL database (or adapt `db/db.js` to your DB of choice)

## Setup & Installation

1. Clone the repo and install dependencies for both backend and frontend.

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env` file in `backend/` with the variables your app expects. Typical variables (adapt to code):

```
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
GMAIL_USER=youremail@gmail.com
GMAIL_PASS=app-specific-password
OLLAMA_API_KEY=your_ollama_key_or_url
```

Check `backend/index.js`, `backend/db/db.js`, and `backend/services/*` for exact variable names required.

## Database

A `queries.sql` file is provided at `backend/queries.sql` with schema and example queries. Run it against your SQL server to create tables and seed data.

## Running Locally

Start backend (from `backend/`):

```bash
npm run dev
# or
node index.js
```

Start frontend (from `frontend/`):

```bash
npm run dev
# opens at http://localhost:5173 by default
```

## API Routes (overview)

Routes are organized under `backend/routes/`:

- Authentication: `backend/routes/authRoutes.js`
- Admin: `backend/routes/adminRoutes.js`
- Doctor: `backend/routes/doctorRoutes.js`
- Patient: `backend/routes/patientRoutes.js`
- Landing pages / index: `backend/routes/landingPageRoutes.js` and `backend/routes/index.js`

Inspect each file for endpoint details and required request bodies/headers.

## Services

- `backend/services/gmail.js` — email sending utilities
- `backend/services/ollama.js` — AI model integration
- `backend/services/healthAgent.js` — health assistant logic

## Contributing

- Fork the repo
- Create a feature branch: `git checkout -b feat/your-feature`
- Commit changes and open a PR

## Notes & Next Steps

- Verify database driver/connection in `backend/db/db.js` and adapt `queries.sql` to your chosen SQL flavor.
- Secure secrets: use environment variables and never commit `.env`.
- Add tests and CI configuration for production readiness.

---

If you'd like, I can:

- Expand the API routes section with endpoint examples.
- Add quickstart scripts to `package.json` for combined start.
- Update `frontend/README.md` to reference the new root README.

Created: `README.md` at repository root.
