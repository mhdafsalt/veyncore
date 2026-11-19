# Veyncore – Full-Stack Web Application

A clean, scalable, and professional full-stack web application starter built with **Next.js (App Router)** and **Express.js (MVC Architecture)** with **MongoDB Atlas** integration.

---

## 1. Project Overview

Veyncore is structured as a decoupled monorepo containing:
- **`frontend/`**: Modern React application powered by Next.js App Router, using vanilla JavaScript (JSX) and native CSS design tokens.
- **`backend/`**: Node.js & Express RESTful API utilizing the Model-View-Controller (MVC) pattern, ES Modules, and Mongoose ODM for MongoDB Atlas.
- **`docs/`**: Architectural overviews and API documentation.

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** JavaScript (ES6+) & JSX (No TypeScript / TSX)
- **Styling:** Vanilla CSS with custom properties / design tokens (No Tailwind CSS or external CSS frameworks)
- **Architecture:** Component-driven, responsive layout structure
- **Path Aliasing:** `@/` mapped to `src/` via `jsconfig.json`

### Backend
- **Runtime:** Node.js
- **Server Framework:** Express.js
- **Architecture:** Model-View-Controller (MVC)
- **Module System:** ES Modules (`import` / `export`)
- **Database:** MongoDB Atlas with Mongoose ODM
- **API Style:** REST API with standardized JSON responses

---

## 3. Complete Folder Structure

```text
project-root/
│
├── frontend/
│   ├── public/
│   │   ├── images/          # Image assets (.gitkeep)
│   │   ├── icons/           # Icon assets (.gitkeep)
│   │   └── assets/          # Miscellaneous static assets (.gitkeep)
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.jsx   # Root App Router layout
│   │   │   ├── page.jsx     # Basic responsive homepage
│   │   │   ├── globals.css  # Global styles & CSS variables
│   │   │   └── not-found.jsx# Custom 404 page
│   │   │
│   │   ├── components/
│   │   │   ├── common/      # Header, StatusBadge, etc.
│   │   │   ├── layout/      # Navbar, Footer, Container
│   │   │   └── ui/          # Button, Card
│   │   │
│   │   ├── services/        # Frontend API client & healthService
│   │   ├── hooks/           # Custom React hooks (useHealthCheck)
│   │   ├── lib/             # Constants and utility functions
│   │   └── styles/          # Additional CSS styles
│   │
│   ├── .env.local           # Frontend local environment config
│   ├── .gitignore           # Frontend git exclusion list
│   ├── jsconfig.json        # Path alias configuration (@/)
│   └── package.json         # Frontend dependencies and scripts
│
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Atlas connection handler
│   │
│   ├── controllers/         # Request handling & controller logic
│   │   └── health.controller.js
│   │
│   ├── models/              # Mongoose schema models
│   │   └── example.model.js
│   │
│   ├── routes/              # Express API route endpoints
│   │   ├── health.routes.js
│   │   └── index.js
│   │
│   ├── middleware/          # Express middleware (errorHandler, 404)
│   │   ├── errorHandler.js
│   │   └── not-foundHandler.js
│   │
│   ├── services/            # Reusable business logic
│   │   └── health.service.js
│   │
│   ├── utils/               # Helper utilities (logger, responses)
│   │   ├── logger.js
│   │   └── responseHandler.js
│   │
│   ├── validators/          # Request data validators
│   │   └── example.validator.js
│   │
│   ├── uploads/             # File uploads storage (.gitkeep)
│   │
│   ├── app.js               # Express app configuration & middleware
│   ├── server.js            # Server entry point & DB startup
│   ├── .env                 # Backend environment variables
│   ├── .env.example         # Environment variables template
│   ├── .gitignore           # Backend git exclusion list
│   └── package.json         # Backend dependencies and scripts
│
├── docs/
│   ├── architecture.md      # Full-stack architectural breakdown
│   └── api-guide.md         # API reference and endpoints
│
├── .gitignore               # Root git exclusion list
└── README.md                # Project documentation
```

---

## 4. Frontend Installation Steps

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `frontend/.env.local` exists and contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

---

## 5. Backend Installation Steps

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see below).

---

## 6. MongoDB Atlas Configuration

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User under **Database Access** with Read/Write privileges.
3. Allow your IP address (or `0.0.0.0/0` for development) under **Network Access**.
4. Retrieve your connection string from **Clusters > Connect > Drivers**. It will look similar to:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/veyncore?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials.
6. Set this value in `backend/.env` under `MONGODB_URI`.

> **Note:** If `MONGODB_URI` contains placeholder text or is missing, the backend will display a clear warning message on startup and continue running in offline database mode so that non-database endpoints like `/api/health` remain functional.

---

## 7. Environment Variable Setup

### Backend (`backend/.env` and `backend/.env.example`)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 8. Commands to Run Frontend and Backend

### Backend (Terminal 1)
```bash
cd backend

# Development mode (with auto-reload via nodemon)
npm run dev

# Production mode
npm start
```

### Frontend (Terminal 2)
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 9. Local Development URLs

| Service | URL | Notes |
| :--- | :--- | :--- |
| **Frontend Application** | `http://localhost:3000` | Next.js App Router Client |
| **Backend API Root** | `http://localhost:5000` | API service root info |
| **Backend Health Check** | `http://localhost:5000/api/health` | REST health-check endpoint |

---

## 10. API Health-Check Instructions

### Testing with `curl`:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend API is running"
}
```

### Testing with Detailed Diagnostics:
```bash
curl http://localhost:5000/api/health?detailed=true
```

Expected response:
```json
{
  "success": true,
  "message": "Backend API is running",
  "timestamp": "2026-11-19T02:30:00.000Z",
  "database": "disconnected",
  "environment": "development"
}
```

### Testing through the Frontend:
1. Start both backend (`cd backend && npm run dev`) and frontend (`cd frontend && npm run dev`).
2. Open `http://localhost:3000` in your web browser.
3. The interactive homepage will automatically ping `/api/health` and display a **Connected (200 OK)** status indicator along with the server response. Click **↻ Test Health Endpoint** anytime to re-verify.
