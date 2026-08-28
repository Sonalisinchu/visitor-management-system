# Visitor Management System (MERN)

Full-stack MVP skeleton matching the PRD (Visitor_Management_System_PRD.md).

## Structure
- `backend/` — Node.js + Express + MongoDB (Mongoose) API, JWT auth, Socket.io wired up
- `frontend/` — React (Vite) + Tailwind, role-based dashboards (Admin / Security / Host)

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in your MongoDB Atlas URI, JWT secret, email creds
npm install
npm run dev             # runs on http://localhost:5000
```

Create your first admin (one-time, before disabling the bootstrap route):
```bash
curl -X POST http://localhost:5000/api/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@vms.com","password":"admin123"}'
```
Then use `/api/auth/register` (as admin) to create `security` and `host` users.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev             # runs on http://localhost:5173
```

## What's implemented (skeleton)
- JWT auth (login, protected routes, role middleware)
- Visitor model + pre-register / walk-in check-in / approve / reject / checkout endpoints
- Audit log on every visitor action
- QR code generation on pre-registration + email notification (Nodemailer)
- Socket.io server wired up (room-per-user) — emit calls are stubbed with TODOs in
  `visitorController.js` where you should broadcast "visitor:pending" / "visitor:approved"
- Login page + Admin/Security/Host dashboards with working check-in, approve/reject, checkout

## What you still need to build (per PRD, not yet wired)
- Socket.io client-side listening (real-time updates without refresh)
- Photo capture (webcam) on check-in form
- QR code scanning on the security check-in page (`html5-qrcode`)
- Badge printing view (printable visitor pass)
- Reports/export endpoints (`/api/reports/summary`, CSV/PDF export)
- Admin user management UI (`/api/users` CRUD)
- Auto-checkout cron job for max visit duration
- Deployment configs (Vercel/Netlify for frontend, Render/Railway for backend, Atlas for DB)

See the PRD for full feature scope, data models, and API contract.
