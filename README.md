# Project Setup & Run Manual

This guide will help you install, configure, and run the Library Management System project (Spring Boot + MongoDB backend, React + Vite frontend).

---

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+ & npm** (for frontend)
- **MongoDB** (running locally on default port 27017)

---

## 1. Clone the Repository

```sh
git clone <your-repo-url>
cd srin-assignment
```

---

## 2. Backend Setup

### a. Configure MongoDB
- Ensure MongoDB is running locally on `localhost:27017`.
- The database name will be `library_management` (see `backend/src/main/resources/application.properties`).

### b. Build & Run Backend

```sh
cd backend
mvn clean install
mvn spring-boot:run
```

- The backend will start on [http://localhost:8080](http://localhost:8080)
- API base path: `/api`

---

## 3. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

- The frontend will start on [http://localhost:5173](http://localhost:5173)

---

## 4. Access the Application

- Open your browser and go to [http://localhost:5173](http://localhost:5173)
- The frontend will communicate with the backend at [http://localhost:8080/api](http://localhost:8080/api)

---

## 5. Troubleshooting

- **MongoDB connection errors:**
  - Make sure MongoDB is running and accessible on `localhost:27017`.
- **CORS or 415 errors:**
  - Ensure both frontend and backend are running.
  - See `test-endpoints.md` for API debugging tips.
- **Port conflicts:**
  - Change the port in `frontend/vite.config.js` or `backend/src/main/resources/application.properties` if needed.

---

## 6. Useful Commands

### Backend
- Build: `mvn clean install`
- Run: `mvn spring-boot:run`
- Test: `mvn test`

### Frontend
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

---

## 7. API Testing

See `test-endpoints.md` for example API requests and troubleshooting tips.

---

## 8. Notes
- Default users/data may be seeded by the backend (see `DataInitializer.java`).
- Update MongoDB connection or ports as needed in the respective config files.

---

Enjoy using the Library Management System!
