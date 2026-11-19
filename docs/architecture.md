# Architecture Overview

This project is a decoupled full-stack web application built with a modern frontend and a structured MVC backend.

## 1. System Topology

```text
[ Client Browser ]
        │
        ▼ (Port 3000)
[ Next.js App Router (Frontend) ]
        │
        │ HTTP REST Requests (Fetch / JSON)
        ▼ (Port 5000)
[ Express.js REST API (Backend MVC) ]
        │
        ▼ Mongoose ODM
[ MongoDB Atlas (Cloud Database) ]
```

## 2. Frontend Structure (`/frontend`)

- **Next.js App Router:** High performance file-system based routing inside `src/app/`.
- **Pure JavaScript & JSX:** Lightweight, simple syntax without TypeScript build complications.
- **Native CSS Design System:** Modern CSS variables, flexbox, CSS grid, and responsive styling without third-party frameworks.
- **Import Alias:** `@/` mapped to `src/*` via `jsconfig.json`.
- **Modular Directory Organization:**
  - `src/components/common/`: Shared general components (Header, Badges).
  - `src/components/layout/`: Page layouts, Navigation bars, Footers, Containers.
  - `src/components/ui/`: Atomic UI components (Buttons, Cards).
  - `src/services/`: Abstracted backend API communication layer.
  - `src/hooks/`: Reusable custom React hooks (`useHealthCheck`).
  - `src/lib/`: Constants, formatters, and utility logic.
  - `public/`: Static image, icon, and asset placeholders.

## 3. Backend MVC Structure (`/backend`)

The backend follows Model-View-Controller design:

- **Entry Point (`server.js`):** Initializes environment variables, establishes MongoDB Atlas connection, starts Express server, and manages graceful shutdowns.
- **App Configuration (`app.js`):** Configures security middleware, CORS, body parsers, static routes, API routing tables, 404 handlers, and global error handling.
- **Config (`config/db.js`):** Connects to MongoDB Atlas using Mongoose and guards against missing/placeholder credentials.
- **Controllers (`controllers/`):** Request handlers that coordinate data retrieval, business logic, and HTTP responses.
- **Services (`services/`):** Encapsulated business logic independent of HTTP request/response objects.
- **Routes (`routes/`):** REST API route definitions linking HTTP verbs and paths to controllers.
- **Models (`models/`):** Mongoose schemas representing database collections with validation rules.
- **Middleware (`middleware/`):** Cross-cutting concerns such as error handling, route validation, and request filtering.
- **Utils (`utils/`):** Shared utilities such as standardized response formatting and structured logging.
- **Validators (`validators/`):** Input payload validation before hitting controllers.
- **Uploads (`uploads/`):** Directory for local file storage if applicable.
