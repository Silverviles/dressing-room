# Frontend (React + Vite)

Client app for Dressing Room.

---

## Responsibilities

- User auth flows (login/register)
- Dress room virtual try-on UI
- Clothes browsing and favorites
- Admin clothes management UI
- Chat assistant UI
- Report download triggers

---

## Stack

- React 19
- Vite 8
- TypeScript
- React Router 7
- Redux Toolkit + redux-persist
- Tailwind CSS 4
- Font Awesome
- MediaPipe Tasks Vision

---

## Environment

Create `frontend/.env` (see `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:3002
```

If omitted, frontend can still use Vite dev proxy for `/api` and `/uploads`.

---

## Install and Run

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

---

## Key Files

- `src/main.tsx` - app bootstrapping
- `src/App.tsx` - route definitions and guards
- `src/api/client.ts` - API client and auth header plumbing
- `src/utils/redux/store.js` - Redux and persistence config
- `src/pages/tabs/DressRoom.tsx` - try-on + assistant UI
- `src/services/pose/poseLandmarker.ts` - MediaPipe pose service
- `vite.config.ts` - proxy and manual chunk splitting

---

## Routing Highlights

- Public:
  - `/`
  - `/login`
  - `/register`
- Authenticated:
  - `/dress`
  - `/favorites`
  - `/skin-color`
  - `/presets`
- Admin:
  - `/cloth`

---

## Build/Bundle Notes

- Vendor chunking is configured in `vite.config.ts` to keep entry bundle small.
- Tailwind is used directly (Material Tailwind has been removed).

---

## Troubleshooting

- **API not reachable**: verify backend is running on `http://localhost:3002`.
- **Auth state issues**: clear local storage and refresh.
- **Camera issues**: check browser camera permissions and secure context settings.
- **Chunk/build issues**: remove `dist/` and rebuild with `npm run build`.

