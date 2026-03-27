# Task Assignment System

A full-stack **task assignment and progress tracking** application for teams. Admins assign work, set milestones, and monitor progress; members update checkpoints, comment on tasks, and manage their profiles. Built with a clean React dashboard UI and a REST API backed by PostgreSQL.

---

## Tech stack

| Layer      | Technology |
| ---------- | ---------- |
| Frontend   | React 18, Vite, React Router, Tailwind CSS, Axios, Recharts, Lucide icons |
| Backend    | Node.js, Express, Sequelize ORM |
| Database   | PostgreSQL |
| Auth       | JWT (JSON Web Token), bcrypt password hashing |
| Uploads    | Multer (profile images → `backend/uploads`) |

---

## Features

- **Authentication** — Register (public), login, change password.
- **Roles** — `admin` and `user`; register defaults to **user**; admins can be seeded or created via **Add User** (admin panel).
- **Posts** — Job titles/departments; optional on users; managed by admin; used on register and admin user creation.
- **Tasks** — Create, list, filter, update, delete (admin); assign to users; due dates, priority, status; milestone keywords with **progress %** from completions.
- **Task details** — Timeline, milestone pie/list, comments, activity feed; admin edit and reassign.
- **Notifications** — Stored in DB (assign, update, comment, reassign, overdue); bell dropdown + full notifications page.
- **Profiles** — Per-user profile (name, contact, address, image upload) synced where applicable with auth user fields.
- **Search** — Navbar search (tasks, assignee hints) with debounced API filtering on list pages.
- **Overcomputed status** — Tasks past due and not completed surface as **overdue** (with admin notifications where implemented).

---

## Repository layout

```
Task Assignment System/
├── backend/                 # Express API
│   ├── config/              # DB / Sequelize config
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/             # Ensure this folder exists for uploads
│   ├── app.js
│   ├── server.js
│   ├── seed_admin.js        # Optional: default posts + admin user
│   └── package.json
├── frontend/                # Vite + React SPA
│   ├── public/
│   ├── src/
│   │   ├── api/             # Axios API modules
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (recommended)
- **PostgreSQL** 14+ (or compatible)
- **npm** (or pnpm/yarn if you adapt commands)

---

## PostgreSQL setup

1. Create a database, for example:

   ```sql
   CREATE DATABASE taskdb;
   ```

2. Note your **host**, **port** (default `5432`), **username**, and **password**.

The API uses **Sequelize `sync({ alter: true })`** on startup to align models with the database. For production, prefer **migrations** instead of `alter: true`.

---

## Backend setup

1. Open a terminal in `backend/`:

   ```bash
   cd backend
   npm install
   ```

2. Create **`backend/.env`** (minimal example — adjust values):

   ```env
   PORT=5000
   DB_NAME=taskdb
   DB_USER=postgres
   DB_PASS=your_postgres_password
   DB_HOST=localhost
   JWT_SECRET=use_a_long_random_string_in_production
   JWT_EXPIRES_IN=7d
   ```

3. Ensure **`backend/uploads`** exists (Multer stores profile images here).

4. Start the server:

   ```bash
   npm run dev
   ```

   API base URL (default): **`http://localhost:5000`**  
   REST routes are mounted under **`/api`** (e.g. `http://localhost:5000/api/auth/login`).

### Optional: seed default posts and admin

After the database exists and `.env` is correct, you can run:

```bash
cd backend
set DB_PASS=your_postgres_password
node seed_admin.js
```

On Windows PowerShell you may use `$env:DB_PASS="..."` before `node seed_admin.js`.  
The script creates sample **Posts** and an admin user (see `seed_admin.js` for email/password — **change these in production**).

---

## Frontend setup

1. In `frontend/`:

   ```bash
   cd frontend
   npm install
   ```

2. Create **`frontend/.env`**:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. For **profile images**, the app references uploaded files from the backend URL. If your API runs elsewhere, align the image base URL in the profile UI with your deployment.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open the URL Vite prints (typically **`http://localhost:5173`**).

5. Production build:

   ```bash
   npm run build
   npm run preview
   ```

---

## Main API endpoints (summary)

| Area            | Method & path (prefix `/api`) |
| --------------- | ----------------------------- |
| Auth            | `POST /auth/register`, `POST /auth/login`, `PUT /auth/change-password` |
| Tasks           | `GET /tasks`, `GET /tasks/my`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `PUT /tasks/:id/progress`, `DELETE /tasks/:id` |
| Users (admin)   | `GET /users`, `GET /users/:id`, `POST /users/create` |
| Comments        | (see `commentRoutes.js`) |
| Notifications   | (see `notificationRoutes.js`) |
| Posts           | `GET /posts`, `POST /posts`, `DELETE /posts/:id` (admin for write) |
| Profile         | `GET /profile/me`, `PUT /profile/me` (multipart for image) |

Protected routes expect header: **`Authorization: Bearer <token>`**.

---

## App routes (frontend)

- **`/`** — Login  
- **`/register`** — Self-service registration  
- **`/admin`** — Admin dashboard  
- **`/admin/assign`** — Assign task  
- **`/admin/tasks`**, **`/admin/tasks/:id`** — All tasks / task detail  
- **`/admin/users`**, **`/admin/users/:id`** — Users / user detail  
- **`/admin/add-user`** — Admin create user  
- **`/admin/posts`** — Manage posts  
- **`/user`** — User dashboard  
- **`/user/tasks`**, **`/user/tasks/:id`** — My tasks / task detail  
- **`/profile`** — Profile  
- **`/notifications`** — Notifications list  

---

## Troubleshooting

- **`EADDRINUSE`** — Another process is using port 5000; stop it or change `PORT` in `.env`.
- **DB auth errors** — Confirm `DB_*` in `backend/.env` matches PostgreSQL.
- **CORS / API errors** — Ensure `VITE_API_BASE_URL` points to the running API (`/api` included).
- **`ERR_CONNECTION_REFUSED`** — Start the backend before using the app; confirm firewall/local URL.

---

## Security notes (production)

- Use strong **`JWT_SECRET`** and HTTPS.
- Replace default seeded admin credentials.
- Turn off Sequelize **`sync({ alter: true })`**; use migrations and controlled schema changes.
- Validate and rate-limit auth routes; set secure cookie/CORS policies if you change the hosting model.

---

## License

Use and modify this project according to your organization’s policy. If you fork it, keep dependency licenses in mind (see each package’s `LICENSE`).
