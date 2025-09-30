# Ailes d'Espoir - Backend API

Backend API for the Ailes d'Espoir membership application system.

## Features

- RESTful API for managing membership applications
- SQLite database for data persistence
- CORS enabled for cross-origin requests
- Express.js web server

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Applications

#### Create Application
- **POST** `/api/applications`
- **Body**: JSON object with application data
```json
{
  "nom": "John Doe",
  "email": "john@example.com",
  "telephone": "+212 6XX XXX XXX",
  "ville": "Casablanca",
  "motivation": "I want to help...",
  "apport": "I can contribute...",
  "disponibilite": "regulier",
  "competences": ["communication", "gestion"],
  "autresDetails": "Additional details",
  "typeAdhesion": "actif",
  "newsletter": true
}
```
- **Response**: `201 Created`
```json
{
  "message": "Application created successfully",
  "id": 1
}
```

#### Get All Applications
- **GET** `/api/applications`
- **Response**: `200 OK`
```json
[
  {
    "id": 1,
    "nom": "John Doe",
    "email": "john@example.com",
    "telephone": "+212 6XX XXX XXX",
    "ville": "Casablanca",
    "motivation": "I want to help...",
    "apport": "I can contribute...",
    "disponibilite": "regulier",
    "competences": ["communication", "gestion"],
    "autresDetails": "Additional details",
    "typeAdhesion": "actif",
    "newsletter": true,
    "status": "pending",
    "timestamp": "01/01/2024 12:00:00",
    "created_at": "2024-01-01 12:00:00"
  }
]
```

#### Get Single Application
- **GET** `/api/applications/:id`
- **Response**: `200 OK` - Same as above, single object

#### Approve Application
- **PUT** `/api/applications/:id/approve`
- **Response**: `200 OK`
```json
{
  "message": "Application approved successfully"
}
```

#### Reject Application
- **PUT** `/api/applications/:id/reject`
- **Response**: `200 OK`
```json
{
  "message": "Application rejected successfully"
}
```

#### Get Statistics
- **GET** `/api/statistics`
- **Response**: `200 OK`
```json
{
  "total": 10,
  "pending": 5,
  "approved": 3,
  "rejected": 2
}
```

### Health Check
- **GET** `/api/health`
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Database Schema

The application uses SQLite with the following schema:

```sql
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL,
    ville TEXT NOT NULL,
    motivation TEXT NOT NULL,
    apport TEXT NOT NULL,
    disponibilite TEXT NOT NULL,
    competences TEXT,
    autresDetails TEXT,
    typeAdhesion TEXT NOT NULL,
    newsletter INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    timestamp TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development

To run in development mode:
```bash
npm run dev
```

## Technologies Used

- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin resource sharing
- **Body-Parser** - Request body parsing

## License

ISC
