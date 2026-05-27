# Dressing Room

Full-stack virtual try-on and wardrobe management application.

This repository is a monorepo with:
- `frontend/`: React + Vite + Tailwind client app
- `backend/`: Express + MongoDB API with JWT auth, file uploads, reports, and chat proxy

---

## Features

- Username/password authentication with JWT
- Role-based access (`admin`, `user`)
- Admin-managed global clothes catalog (CRUD)
- User favorites
- Virtual try-on with MediaPipe Tasks Vision pose tracking
- AI fashion assistant via backend Gemini proxy
- PDF report generation on backend
- Local disk storage for uploaded cloth images

---

## Tech Stack

### Frontend
- React 19
- Vite 8
- Redux Toolkit + redux-persist
- React Router 7
- Tailwind CSS 4
- Font Awesome
- `@mediapipe/tasks-vision`

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- File uploads (`multer`)
- PDF generation (`pdfkit`)
- Gemini API SDK (`@google/generative-ai`)

---

## Repository Structure

```text
dressing-room/
├─ backend/
│  ├─ index.js
│  ├─ scripts/seedAdmin.js
│  └─ src/
│     ├─ config/
│     ├─ middleware/
│     ├─ models/
│     ├─ routes/
│     └─ utils/
├─ frontend/
│  ├─ src/
│  ├─ vite.config.ts
│  └─ package.json
├─ run-services.sh
└─ setup-services.sh
```

---

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+
- MongoDB (Atlas or local instance)
- Bash shell for helper scripts (`Git Bash`, WSL, or Linux/macOS shell)

---

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as reference:

```env
MONGO_URI=
JWT_SECRET=
PORT=3002
ADMIN_USERNAME=admin
ADMIN_PASSWORD=
GEMINI_API_KEY=
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

Use `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3002
```

---

## Setup

### 1) Install dependencies

```bash
./setup-services.sh
```

Or install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure env files

- Create `backend/.env`
- Create `frontend/.env`

### 3) (Optional) Seed admin user

```bash
cd backend
npm run seed:admin
```

### 4) Run both services

```bash
./run-services.sh
```

Useful options:

```bash
./run-services.sh --seed-admin
./run-services.sh --log-level debug
./run-services.sh --log-level info
```

---

## Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3002`
- Health check: `http://localhost:3002/health`

---

## NPM Scripts

### Frontend
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

### Backend
- `npm run dev`
- `npm run start`
- `npm run seed:admin`

---

## API Overview

Base URL: `/api`

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /clothes`
- `POST /clothes` (admin)
- `PATCH /clothes/:id` (admin)
- `DELETE /clothes/:id` (admin)
- `GET /favorites`
- `POST /favorites/:clothId`
- `DELETE /favorites/:clothId`
- `POST /chat`
- `GET /reports/cloths` (admin PDF)
- `GET /reports/tryouts` (PDF)
- `POST /reports/recommendations` (PDF)

Uploaded images are served from `/uploads/...`.

---

## Build and Quality

From `frontend/`:

```bash
npm run lint
npm run build
```

---

## Troubleshooting

- **Mongo connection fails**: verify `MONGO_URI`, network access, and credentials.
- **CORS errors**: confirm `CLIENT_ORIGIN` matches your frontend URL.
- **Chat unavailable**: ensure `GEMINI_API_KEY` is set in backend env.
- **Uploads fail**: check image type/size and write permissions for `backend/uploads/`.
- **Script issues on Windows PowerShell**: run `run-services.sh` and `setup-services.sh` in Git Bash or WSL.

---

## Additional Docs

- Backend details: `backend/README.md`
- Frontend details: `frontend/README.md`

