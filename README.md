# Library Management System

A full-stack web application for managing library operations including books, authors, members, and borrowing records.

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2.0 with MongoDB
- **Frontend**: React 19 with Vite and TailwindCSS
- **Database**: MongoDB
- **Build Tools**: Maven (Backend), npm/Vite (Frontend)

---

## 📋 Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+ & npm** (for frontend)
- **MongoDB** (running locally on default port 27017)
- **Maven 3.6+** (usually comes with Java installation)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/2ntng/srin-assignment.git
cd srin-assignment
```

### 2. Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 3. Backend Setup

Navigate to the backend directory and build the project:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ The backend will start on **[http://localhost:8081](http://localhost:8081)**  
✅ API base path: `/api`  
✅ Sample data will be automatically seeded on first run

### 4. Frontend Setup

Open a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

✅ The frontend will start on **[http://localhost:5173](http://localhost:5173)**

---

## 🌐 Accessing the Application

1. **Web Interface**: Open [http://localhost:5173](http://localhost:5173) in your browser
2. **API Endpoints**: Available at [http://localhost:8081/api](http://localhost:8081/api)
3. **Database**: MongoDB running on `localhost:27017` (database: `library_management`)

---

## 📚 Features

- **Book Management**: Add, edit, view, and delete books
- **Author Management**: Manage author information and bibliography
- **Member Management**: Handle library member registration and profiles
- **Borrowing System**: Track book borrowing and returns with due dates
- **Search & Filter**: Find books, authors, and members easily
- **Responsive Design**: Modern UI built with React and TailwindCSS

---

## 🗂️ Sample Data

The application comes with pre-seeded sample data including:
- **6 Books** from various genres (Fiction, Fantasy, Romance, etc.)
- **5 Authors** (F. Scott Fitzgerald, Harper Lee, George Orwell, etc.)
- **5 Members** with complete profiles
- **Sample borrowing records** including overdue items

This data is automatically created when you first run the backend (see `DataInitializer.java`).

## 🛠️ Development Commands

### Backend Commands
```bash
cd backend

# Clean and compile
mvn clean compile

# Run tests
mvn test

# Clean install (includes tests)
mvn clean install

# Run application
mvn spring-boot:run

# Package as JAR
mvn clean package
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Server runs on port 8081
server.port=8081

# MongoDB connection using URI/Connection String
spring.data.mongodb.uri=mongodb://localhost:27017/library_management

# CORS configuration for frontend
spring.web.cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration (`vite.config.js`)
- Uses React plugin for JSX support
- TailwindCSS integration for styling
- Development server on port 5173

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Errors:**
- Verify MongoDB is running: `mongosh --eval "db.runCommand('ping')"`
- Check if port 27017 is available
- Ensure MongoDB service is started

**Backend Won't Start:**
- Check if port 8081 is available
- Verify Java 17+ is installed: `java -version`
- Ensure Maven is properly configured: `mvn -version`

**Frontend Issues:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node -version` (should be 18+)

**CORS or 415 Errors:**
- Ensure both frontend and backend are running
- Check that frontend is connecting to correct backend URL (port 8081)
- See `test-endpoints.md` for detailed API debugging

**Port Conflicts:**
- Backend: Change `server.port` in `application.properties`
- Frontend: Change port in `vite.config.js` or use `npm run dev -- --port 3000`

---

## 🧪 API Testing

### Available Endpoints
- **Books**: `GET|POST|PUT|DELETE /api/books`
- **Authors**: `GET|POST|PUT|DELETE /api/authors`
- **Members**: `GET|POST|PUT|DELETE /api/members`
- **Borrowed Books**: `GET|POST|PUT /api/borrowed-books`

### Quick API Test
```bash
# Test if backend is running
curl http://localhost:8081/api/books

# Test with sample data
curl -X POST http://localhost:8081/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Author", "biography": "Test bio", "nationality": "American"}'
```

For detailed API testing examples, see [`test-endpoints.md`](./test-endpoints.md)

---

## 📁 Project Structure

```
srin-assignment/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/library/librarymanagement/
│   │   ├── config/         # Configuration classes
│   │   ├── controller/     # REST controllers
│   │   ├── model/          # Entity models
│   │   ├── repository/     # MongoDB repositories
│   │   └── service/        # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # State management
│   │   └── assets/        # Static assets
│   ├── package.json       # npm dependencies
│   └── vite.config.js     # Vite configuration
├── README.md              # This file
└── test-endpoints.md      # API testing guide
```

---

## 📝 Notes

- **Database Persistence**: Data persists between application restarts
- **Sample Data**: Only created on first run (when collections don't exist)
- **CORS**: Pre-configured for development (frontend on 5173, backend on 8081)
- **Validation**: Both frontend and backend include input validation
- **Responsive Design**: Application works on desktop and mobile devices

---