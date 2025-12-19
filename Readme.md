# Hospital Appointment Management System

A full-stack web application that enables patients to book hospital appointments and allows doctors to manage their daily consultation queue efficiently.

This project focuses on real-world queue handling, role-based access, and clear appointment lifecycle management.

## Features

### Patient
- Register & Login
- Book appointment with a doctor
- View appointment status and queue position
- Cancel appointment before consultation

### Doctor
- Login
- View today’s patient queue

## Appointment Lifecycle

```
BOOKED → IN_PROGRESS → COMPLETED
           ↓
         ABSENT
```

| Status | Updated By | Description |
| :--- | :--- | :--- |
| **BOOKED** | Patient | Appointment booked |
| **IN_PROGRESS** | Doctor | Consultation started |
| **COMPLETED** | Doctor | Consultation finished |
| **ABSENT** | Doctor | Patient didn’t show |
| **CANCELLED** | Patient | Appointment cancelled |

## Queue Management Logic
- Each doctor has a daily queue
- Queue is ordered using `queueNumber`
- When an appointment is completed or marked absent:
  - Next patient automatically moves forward

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Project Structure

```
hospital-appointment-system/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       ├── services/
│       ├── app.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── context/
        ├── routes/
        ├── App.jsx
        └── main.jsx
```

## Authentication & Authorization
- **JWT-based authentication**
- **Role-based access:**
  - Patient
  - Doctor
- Protected routes on frontend and backend

## API Overview

### Patient APIs
- `POST /api/appointments` – Book appointment
- `GET /api/appointments/my` – View my appointments
- `DELETE /api/appointments/:id` – Cancel appointment

### Doctor APIs
- `GET /api/doctor/appointments/today` – View today’s queue
