# TaskFlow Backend

Node.js + Express + MongoDB backend for the Employee Task Management application.

## Setup

1. Open a terminal in the `server` directory.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env`.
4. Set your MongoDB connection string and a strong JWT secret.
5. Start MongoDB.
6. Run:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

A demo user is automatically created on first startup if it does not exist:

- Email: `admin@taskflow.local`
- Password: `Admin@123`

Change these values in `.env` for your own environment.

## Main endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `GET /api/tasks/stats`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

All task endpoints require:

```text
Authorization: Bearer <JWT>
```
