# Aether E‑commerce (Next.js + Express + MongoDB)

## Setup

### Backend
```bash
cd backend
cp .env.example .env
# put your Mongo connection string in MONGO_URI
npm install
npm run dev
```
API runs at `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
# set NEXT_PUBLIC_API_URL to your backend URL when running
NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev
```
Open `http://localhost:3000`.

### Notes
- Database is **empty** by default.
- Create an admin by updating a user's `isAdmin` to `true` in MongoDB if needed.
