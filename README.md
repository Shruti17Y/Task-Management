# Task Management System (MERN Stack)

This repository contains a full-stack Task Management System designed with Node.js/Express, MongoDB, and React.js. It features JWT authentication, CRUD operations on tasks, pagination, sorting, search, filtering, and modern design practices.

---

## Technology Stack

- **Frontend**: React.js (Vite), React Hooks, CSS (Vanilla with HSL variables)
- **Backend**: Node.js, Express.js, Mongoose, MongoDB
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js
- **Validation**: Express Validator (Backend), Custom Hooks/Forms (Frontend)
- **CI/CD**: GitHub Actions (automatically builds and runs check on pushes to `main`)

---

## Folder Structure

Below is the directory structure layout for both Backend and Frontend components:

```text
backend/
├── config/             # DB and system configuration settings
├── controllers/        # Route controllers containing logic
├── middleware/         # Custom Express middlewares (Auth, Error, Validation)
├── models/             # Mongoose Schemas (User, Task)
├── routes/             # Express routes mapper
├── services/           # Service-layer logic
├── utils/              # Help/Utility files (JWT generators, etc.)
└── app.js              # Express main file

frontend/
└── src/
    ├── components/     # UI components (Navbar, loaders, custom widgets)
    ├── pages/          # Layout page elements (Login, Register, Dashboard)
    ├── services/       # Front-end API call wrappers
    ├── hooks/          # React hooks (useAuth, etc.)
    ├── context/        # Global React Contexts (Auth state, etc.)
    ├── utils/          # Frontend helper functions (formatters)
    └── App.jsx         # App component setup
```

---

## Environment Variables

A sample configuration is provided in [.env.example](file:///.env.example). Create a `.env` file in the root and backend directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

---

## Installation & Setup

Follow these steps to run the application locally:

### 1. Clone & Set Environment
Make sure you have [Node.js](https://nodejs.org/) installed.
Create your local `.env` variables from `.env.example`.

### 2. Run Backend API
```bash
cd backend
npm install
npm run dev
```
The server will start listening at `http://localhost:5000`.

### 3. Run Frontend UI
```bash
cd frontend
npm install
npm run dev
```
The Vite server will start listening at `http://localhost:5173`.

---

## API Documentation

The Postman collection is included in this repository to easily test the APIs:
- [TaskManagerCollection.postman_collection.json](file:///TaskManagerCollection.postman_collection.json)

### Endpoints:
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Sign in and get a JWT token.
- `GET /api/tasks` - Fetch authenticated user's tasks (supports search, sort, filter, and pagination).
- `POST /api/tasks` - Create a new task.
- `PUT /api/tasks/:id` - Update an existing task.
- `DELETE /api/tasks/:id` - Remove a task.
