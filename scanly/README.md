# 🏥 Scanly — Portable Digital Health Records System

A full-stack web application for secure, QR-powered portable health records.

## 📦 Tech Stack
- **Frontend**: Next.js 14 + Tailwind CSS + Framer Motion
- **Backend**: Express.js (Node.js)
- **Storage**: Local file system (JSON files + uploads folder)
- **Auth**: JWT + bcrypt
- **QR**: qrcode library

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## 🔑 Demo Login
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@scanly.app | admin123 |

## 📁 Project Structure
```
scanly/
├── backend/
│   ├── data/          ← JSON data storage
│   │   ├── users.json
│   │   └── records.json
│   ├── uploads/       ← Uploaded medical files
│   ├── routes/        ← API routes
│   ├── middleware/    ← Auth & file helpers
│   └── server.js
└── frontend/
    ├── src/
    │   ├── app/       ← Next.js App Router pages
    │   ├── components/← Reusable components
    │   ├── lib/       ← API client & Auth context
    │   └── styles/    ← Global CSS
    └── public/        ← Static assets & PWA manifest
```

## 🔐 Roles
| Role | Capabilities |
|------|-------------|
| **Patient** | Upload records, generate QR code, view history |
| **Doctor** | Search patients by phone, view records via QR |
| **Admin** | Manage all users, verify doctors, view all records |

## 🌙 Features
- ✅ Dark/Light mode toggle
- ✅ PWA (installable on mobile)
- ✅ Splash screen animation
- ✅ Responsive (mobile, tablet, desktop)
- ✅ QR code generation & scanning
- ✅ File upload (PDF/images up to 20MB)
- ✅ Role-based access control
- ✅ JWT authentication
