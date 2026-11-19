# API Reference Guide

Base URL: `http://localhost:5000/api`

## Endpoints

### 1. Health Check

Verifies server status and connectivity.

- **URL:** `/api/health`
- **Method:** `GET`
- **Access:** Public
- **Query Parameters:**
  - `detailed` (optional, boolean): Set to `true` for extended diagnostic data (database state, uptime, timestamp).

#### Standard Response (`GET /api/health`)
- **Status:** `200 OK`
- **Content-Type:** `application/json`

```json
{
  "success": true,
  "message": "Backend API is running"
}
```

#### Detailed Response (`GET /api/health?detailed=true`)
- **Status:** `200 OK`
- **Content-Type:** `application/json`

```json
{
  "success": true,
  "message": "Backend API is running",
  "timestamp": "2026-11-19T02:30:00.000Z",
  "database": "connected",
  "environment": "development"
}
```

---

### 2. Error Response Structure

All endpoints return a standardized JSON structure on error:

```json
{
  "success": false,
  "message": "Resource not found at /api/invalid-route"
}
```
