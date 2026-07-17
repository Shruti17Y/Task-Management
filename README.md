# Task Management System (MERN Stack)

A complete, production-ready Task Management System designed with Node.js/Express, MongoDB, and React.js. It features robust JWT authentication, CRUD operations on tasks, pagination, sorting, search, filtering, a local-persisted dark/light theme switch, real-time admin-to-user notifications powered by Server-Sent Events (SSE), a visual diffing sidebar, and custom animated toast notifications.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [Installation Steps](#-installation-steps)
- [API Documentation](#-api-documentation)
  - [Authentication API](#1-authentication-api)
  - [Tasks API](#2-tasks-api)
  - [Notifications API](#3-notifications-api)
- [Steps to Run the Project Locally](#-steps-to-run-the-project-locally)

---

## 🔍 Project Overview

This application serves as a multi-user task delegation and tracking tool:
- **Admin Capabilities**: Seeded with a default administrator account (`admin@example.com`). The admin can view all tasks, search/filter them, create new tasks, and assign them to any registered system user. They can also update or delete tasks belonging to other users.
- **Normal User Capabilities**: Normal users can only see, search, edit, delete, or mark completed **their own tasks**.
- **Real-Time SSE Admin Notifications**: When an admin creates a task for a user, updates a task belonging to them, or deletes one of their tasks, the user receives an instant real-time notification badge (glowing count indicator) and an animated slide-in Toast banner.
- **Task Difference Visualizer**: Clicking the notification bell slides open a panel from the right. For updated tasks, it performs a comparison and renders a side-by-side properties comparison (Old vs. New values) for fields modified by the admin.
- **Theme Switcher**: A micro-interactive Moon/Sun navbar button allows toggling between a clean light theme and a slate-tinted dark mode. The priority task cards dynamically adapt their colors to be fully readable in both modes.

---

## 🛠️ Technology Stack

- **Frontend**:
  - **React.js** (Vite-powered single page application)
  - **React Hooks & Global Context API** (for Tasks, Auth, Toast, and Notification states)
  - **CSS Custom Variables** (for responsive theme toggles and priority layouts)
  - **Native EventSource Client** (for real-time server streams without heavy client libraries)
- **Backend**:
  - **Node.js & Express.js** (modular routes, controllers, and services layout)
  - **Mongoose & MongoDB** (object modeling and persistence layer)
  - **JSON Web Tokens (JWT)** (session tokens transmitted via headers or query strings)
  - **Bcrypt.js** (one-way password hashing)
  - **Server-Sent Events (SSE)** (unidirectional persistent streaming for real-time alerts)

---

## 📁 Folder Structure

```text
Task Management/
├── backend/
│   ├── config/             # DB connection configuration
│   ├── controllers/        # Route controller logics
│   │   ├── authController.js
│   │   ├── notificationController.js
│   │   └── taskController.js
│   ├── middleware/         # Express middlewares (Auth protect, error handlers)
│   ├── models/             # Mongoose schemas (User, Task, Notification)
│   ├── routes/             # Route mapping specs
│   ├── services/           # Real-time SSE connection broker service
│   ├── utils/              # JWT tokens signer
│   ├── .env                # Backend environment settings
│   └── app.js              # Server bootstrapper file
│
└── frontend/
    ├── src/
    │   ├── components/     # UI elements (Navbar, Sidebar, TaskCard, Toast, Badge)
    │   ├── context/        # Global context managers (Auth, Tasks, Notifications, Toasts)
    │   ├── hooks/          # Shared hooks (useTasks, useAuth, useConnectivity)
    │   ├── pages/          # Full page layout modules (Login, Register, Dashboard)
    │   ├── services/       # Fetch client interface configurations
    │   ├── utils/          # Data converters (formatDate, priorityColor)
    │   ├── App.jsx         # App view manager
    │   ├── index.css       # Core variable mappings
    │   └── main.jsx        # App entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `/backend` directory.

| Variable Name | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | Port the Express backend runs on | `5000` |
| `MONGO_URI` | MongoDB database connection URI | `mongodb://localhost:27017/taskmanager` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | `your_jwt_secret_key_here` |
| `CLIENT_URL` | URL of the frontend client (for CORS configuration) | `http://localhost:5173` |

---

## 🚀 Installation Steps

Make sure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed and running locally.

### 1. Set Up the Backend
```bash
cd backend
npm install
```

### 2. Set Up the Frontend
```bash
cd ../frontend
npm install
```

---

## 🔌 API Documentation

**Base API URL**: `http://localhost:5000/api`

### 1. Authentication API

All protected endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.

#### `POST /auth/register`
Creates a new user account.
- **Body Parameters**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109a1",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

#### `POST /auth/login`
Authenticates a user and returns a token.
- **Body Parameters**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109a1",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

#### `GET /auth/users` *(Protected, Admin Only)*
Fetches a list of all registered users (useful for assigning tasks).
- **Response (200 OK)**:
  ```json
  [
    { "_id": "60d0fe4f5311236168a109a1", "name": "John Doe", "email": "john@example.com" }
  ]
  ```

---

### 2. Tasks API

#### `GET /tasks` *(Protected)*
Fetches tasks. If logged in as admin, returns all tasks. If a normal user, returns only their own tasks.
- **Query Parameters (Optional)**:
  - `status`: `Pending` \| `In Progress` \| `Completed`
  - `priority`: `Low` \| `Medium` \| `High`
  - `search`: string search query matching the title
  - `sortBy`: `createdAt:desc` \| `createdAt:asc` \| `dueDate:asc` \| `dueDate:desc`
  - `page`: page number (default: `1`)
  - `limit`: items per page (default: `10`)
- **Response (200 OK)**:
  ```json
  {
    "tasks": [
      {
        "_id": "60d0fe4f5311236168a109b0",
        "title": "Complete Project Report",
        "description": "Final report detailing metrics",
        "status": "Pending",
        "priority": "High",
        "dueDate": "2026-08-01T00:00:00.000Z",
        "user": { "_id": "60d0fe4f5311236168a109a1", "name": "John Doe" }
      }
    ],
    "total": 1,
    "page": 1,
    "pages": 1
  }
  ```

#### `POST /tasks` *(Protected)*
Creates a new task. Admins can assign to any user using the `assignedUser` field; normal users cannot assign tasks to others.
- **Body Parameters**:
  ```json
  {
    "title": "Build UI Component",
    "description": "Code custom dashboard view",
    "status": "In Progress",
    "priority": "Medium",
    "dueDate": "2026-07-25",
    "assignedUser": "60d0fe4f5311236168a109a1" 
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Task created successfully",
    "task": { ... }
  }
  ```

#### `PUT /tasks/:id` *(Protected)*
Updates an existing task. Normal users can only update their own tasks.
- **Body Parameters**: Partial fields list (`title`, `description`, `status`, `priority`, `dueDate`, `assignedUser`).
- **Response (200 OK)**:
  ```json
  {
    "message": "Task updated successfully",
    "task": { ... }
  }
  ```

#### `DELETE /tasks/:id` *(Protected)*
Permanently deletes a task. Normal users can only delete their own tasks.
- **Response (200 OK)**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

---

### 3. Notifications API

#### `GET /notifications` *(Protected)*
Fetches the last 50 notifications for the authenticated user, sorted by date.
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "60d0fe4f5311236168a109c0",
      "user": "60d0fe4f5311236168a109a1",
      "action": "updated",
      "taskDetails": {
        "title": "Complete Project Report",
        "status": "Completed"
      },
      "oldTaskDetails": {
        "title": "Complete Project Report",
        "status": "In Progress"
      },
      "read": false,
      "createdAt": "2026-07-17T12:00:00.000Z"
    }
  ]
  ```

#### `PUT /notifications/mark-read` *(Protected)*
Marks all unread notifications for the authenticated user as read.
- **Response (200 OK)**:
  ```json
  {
    "message": "All notifications marked as read"
  }
  ```

#### `PUT /notifications/:id/read` *(Protected)*
Marks a single notification as read.
- **Response (200 OK)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109c0",
    "read": true
  }
  ```

#### `GET /notifications/stream` *(Protected)*
Establishes a persistent Server-Sent Events (SSE) stream.
- **Authentication**: Accepts JWT from the URL query parameter: `?token=YOUR_JWT_TOKEN`.
- **Response Stream Header**: `Content-Type: text/event-stream`

---

## 🏃 Steps to Run the Project Locally

### 1. Launch MongoDB
Make sure your local MongoDB daemon is running:
```bash
# Example for Windows Command Prompt if not running as a system service
"C:\Program Files\MongoDB\Server\X.Y\bin\mongod.exe"
```

### 2. Start Backend Server
In the `/backend` directory:
```bash
npm run dev
```
The console will log `Server running on port 5000` and `MongoDB Connected: 127.0.0.1`. A default admin user will automatically be seeded in the database if it doesn't already exist:
- **Admin Login**: `admin@example.com`
- **Admin Password**: `password123`

### 3. Start Frontend Client
In the `/frontend` directory:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to start managing your tasks!
