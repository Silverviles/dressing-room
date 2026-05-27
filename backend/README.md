# Backend (Express + MongoDB)

Backend API for Dressing Room.

---

## Responsibilities

- Authentication and authorization
- Clothes catalog CRUD
- Favorites management
- Chat proxy to Gemini API
- PDF report generation
- Local disk image upload/storage

---

## Stack

- Express
- Mongoose (MongoDB)
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `multer`
- `pdfkit`
- `@google/generative-ai`

---

## Folder Structure

```text
backend/
├─ index.js
├─ scripts/
│  └─ seedAdmin.js
└─ src/
   ├─ config/
   │  └─ db.js
   ├─ middleware/
   │  ├─ auth.js
   │  ├─ requireRole.js
   │  └─ upload.js
   ├─ models/
   │  ├─ User.js
   │  ├─ Cloth.js
   │  └─ Favorite.js
   ├─ routes/
   │  ├─ auth.routes.js
   │  ├─ cloth.routes.js
   │  ├─ favorite.routes.js
   │  ├─ chat.routes.js
   │  └─ report.routes.js
   └─ utils/
      ├─ files.js
      ├─ hash.js
      └─ token.js
```

---

## Environment Variables

Create `backend/.env` using `backend/.env.example`:

```env
MONGO_URI=
JWT_SECRET=
PORT=3002
ADMIN_USERNAME=admin
ADMIN_PASSWORD=
GEMINI_API_KEY=
CLIENT_ORIGIN=http://localhost:5173
```

---

## Run

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

Production:

```bash
npm run start
```

Seed admin user:

```bash
npm run seed:admin
```

---

## API Routes

### Health
- `GET /health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Clothes
- `GET /api/clothes` (authenticated)
- `POST /api/clothes` (admin, multipart form with `image`)
- `PATCH /api/clothes/:id` (admin, optional image replacement)
- `DELETE /api/clothes/:id` (admin)

### Favorites
- `GET /api/favorites` (authenticated)
- `POST /api/favorites/:clothId` (authenticated)
- `DELETE /api/favorites/:clothId` (authenticated)

### Chat
- `POST /api/chat` (authenticated)

### Reports (PDF)
- `GET /api/reports/cloths` (admin)
- `GET /api/reports/tryouts`
- `POST /api/reports/recommendations`

---

## Notes

- Uploaded files are stored in `backend/uploads/cloths/`.
- Static file serving is enabled at `/uploads`.
- CORS is restricted to configured frontend origins.
- Multer middleware validates image uploads (JPEG/PNG/WebP).

---

## Error Handling

- Multer errors return `400`.
- Unsupported file type errors return `400`.
- Unexpected errors return `500` with a generic message.

