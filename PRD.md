# Product Requirements Document (PRD)
## Visitor Management System (VMS)

**Version:** 1.0
**Author:** Sonali
**Stack:** MERN (MongoDB, Express.js, React, Node.js)

---

## 1. Overview

### 1.1 Problem Statement
Organizations (offices, colleges, apartment complexes, factories) still rely on paper registers or ad-hoc WhatsApp/phone approvals to manage visitors. This creates security gaps, no audit trail, slow host notification, and poor visitor experience.

### 1.2 Goal
Build a full-stack Visitor Management System that digitizes the entire visitor lifecycle — pre-registration, check-in, host approval, badge issuance, and check-out — with role-based dashboards for Admin, Security/Front Desk, and Host (Employee).

### 1.3 Target Users
| Role | Description |
|---|---|
| **Admin** | Manages users, departments, reports, system settings |
| **Security/Receptionist** | Registers walk-in visitors, checks IDs, prints badges, manages check-in/out |
| **Host/Employee** | Pre-approves visitors, gets notified on arrival, approves/rejects entry |
| **Visitor** | Pre-registers via public link/QR, receives status updates |

---

## 2. Core Features (MVP Scope)

### 2.1 Authentication & Roles
- JWT-based auth with role-based access control (Admin / Security / Host)
- Login, forgot password, protected routes
- Admin can create Security and Host accounts

### 2.2 Visitor Pre-Registration
- Host can pre-invite a visitor (name, phone, email, purpose, date/time, company)
- Visitor gets a QR code / link via email for fast check-in
- Optional: Visitor self-registers via a public form pending host approval

### 2.3 Walk-in Check-In (Security Desk)
- Search existing visitor by phone number (returning visitor auto-fill)
- Capture: name, phone, photo (webcam capture), ID proof type + number, company, purpose, host to meet
- Auto-send notification (email/SMS/in-app) to host for approval
- Generate visitor badge (printable) with QR code + photo

### 2.4 Host Approval Flow
- Host dashboard shows pending visitor requests in real time
- Approve / Reject with one click
- Push/email notification to security desk + visitor on decision

### 2.5 Check-Out
- Security marks checkout time (manual or QR scan at exit)
- Auto-checkout after configurable max duration (e.g., 12 hrs) via cron job

### 2.6 Dashboards & Reports
- **Admin dashboard:** total visitors today/week/month, active visitors on premises, department-wise visitor stats, peak hour charts
- **Security dashboard:** live "currently in building" list, pending approvals
- **Host dashboard:** my visitors (upcoming, past, pending)
- Export visitor logs to CSV/PDF for a date range

### 2.7 Notifications
- Email notifications (Nodemailer) for: pre-registration confirmation, host approval request, approval/rejection, checkout reminder
- In-app real-time updates via Socket.io (visitor status changes without refresh)

### 2.8 Audit Log
- Every check-in/out, approval/rejection, and admin action logged with timestamp + actor

---

## 3. Nice-to-Have (Post-MVP / Stretch Goals)
- SMS notifications via Twilio
- Face recognition-based check-in
- Blacklist/watchlist flagging (auto-alert security)
- Multi-branch/multi-location support
- Visitor feedback form after checkout
- Mobile app (React Native) for hosts to approve on the go
- Badge printing integration with physical printers (via browser print API is enough for MVP)

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Axios, Socket.io-client |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Real-time | Socket.io |
| Email | Nodemailer (Gmail SMTP / SendGrid) |
| File/Photo storage | Cloudinary or local `multer` storage for MVP |
| QR Code | `qrcode` (generate) + `html5-qrcode` (scan on frontend) |
| PDF export | `pdfkit` or `jspdf` |
| Deployment | Frontend → Vercel/Netlify; Backend → Render/Railway; DB → MongoDB Atlas |

---

## 5. Data Models (MongoDB Schemas)

### 5.1 User
```
{
  name, email, password (hashed), phone,
  role: enum['admin','security','host'],
  department, createdAt
}
```

### 5.2 Visitor
```
{
  name, phone, email, photoUrl,
  idProofType, idProofNumber,
  company, purposeOfVisit,
  hostId (ref User),
  status: enum['pending','approved','rejected','checked_in','checked_out'],
  checkInTime, checkOutTime,
  qrCode,
  preRegistered: Boolean,
  scheduledTime,
  createdBy (ref User - security who registered),
  createdAt
}
```

### 5.3 AuditLog
```
{
  action, performedBy (ref User), targetVisitor (ref Visitor),
  metadata, timestamp
}
```

### 5.4 Notification (optional, for in-app feed)
```
{
  userId (ref User), message, type, isRead, createdAt
}
```

---

## 6. API Endpoints (REST)

### Auth
- `POST /api/auth/register` (admin only, creates security/host)
- `POST /api/auth/login`
- `GET /api/auth/me`

### Visitors
- `POST /api/visitors/preregister` — host pre-invites a visitor
- `POST /api/visitors/checkin` — security walk-in check-in
- `GET /api/visitors` — list with filters (status, date, host, search)
- `GET /api/visitors/:id`
- `PATCH /api/visitors/:id/approve`
- `PATCH /api/visitors/:id/reject`
- `PATCH /api/visitors/:id/checkout`
- `GET /api/visitors/active` — currently in building

### Reports
- `GET /api/reports/summary?range=today|week|month`
- `GET /api/reports/export?from=&to=&format=csv|pdf`

### Users (Admin)
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

---

## 7. User Flows

**Walk-in visitor flow:**
Visitor arrives → Security searches/creates record → captures photo + ID → selects host → submits → Host gets real-time notification → Host approves/rejects → Security informed instantly → badge printed → visitor enters → checkout on exit.

**Pre-registered visitor flow:**
Host fills pre-invite form → visitor receives email with QR → visitor arrives, security scans QR → auto-filled details shown → security confirms check-in → host notified → visitor enters.

---

## 8. Non-Functional Requirements
- Response time < 500ms for check-in APIs
- Role-based route protection on both frontend and backend
- Mobile-responsive frontend (security desk may use tablet)
- Basic rate-limiting on public pre-registration endpoint (avoid spam)
- Passwords hashed with bcrypt; JWT expiry + refresh token strategy

---

## 9. Suggested Build Timeline (Solo, ~3–4 weeks)

| Week | Milestone |
|---|---|
| 1 | Backend setup: models, auth, visitor CRUD APIs, MongoDB Atlas connected |
| 2 | Frontend: auth pages, security check-in flow, host dashboard, Socket.io wiring |
| 3 | QR code gen/scan, email notifications, badge printing, reports/export |
| 4 | Polish UI, audit logs, deploy (Vercel + Render + Atlas), write README/demo video |

---

## 10. Folder Structure (Proposed)

```
visitor-management-system/
├── backend/
│   ├── models/ (User.js, Visitor.js, AuditLog.js)
│   ├── controllers/
│   ├── routes/
│   ├── middleware/ (auth.js, roleCheck.js)
│   ├── utils/ (sendEmail.js, generateQR.js)
│   ├── config/ (db.js)
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/ (Login, AdminDashboard, SecurityDesk, HostDashboard, CheckIn, Reports)
    │   ├── components/
    │   ├── context/ (AuthContext)
    │   ├── services/ (api.js — axios instance)
    │   └── App.jsx
    └── vite.config.js
```

---

## 11. Success Metrics (for resume/demo purposes)
- End-to-end working flow: pre-register → check-in → approve → badge → checkout
- Real-time host notification latency < 2s
- Deployed live demo link + GitHub repo with clean README
- Good story for interviews: "built RBAC, real-time notifications, and QR-based check-in from scratch"
