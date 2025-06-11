@echo off
echo Setting up development environment...

set CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
set MONGODB_URI=mongodb://localhost:27017/library_management
set SERVER_PORT=8081

echo Starting Spring Boot application...
mvnw.cmd spring-boot:run
