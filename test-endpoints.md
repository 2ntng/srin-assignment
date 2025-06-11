# Testing API Endpoints

## Test the Fixed Endpoints

After the changes, you should test these endpoints that were previously causing "Unsupported Media Type" errors:

### 1. Test Author Creation (POST)
```bash
curl -X POST http://localhost:8080/api/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Author",
    "biography": "Test biography",
    "nationality": "American"
  }'
```

### 2. Test Author Update (PUT)
```bash
curl -X PUT http://localhost:8080/api/authors/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Author",
    "biography": "Updated biography",
    "nationality": "American"
  }'
```

### 3. Test Member Creation (POST)
```bash
curl -X POST http://localhost:8080/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Member",
    "email": "test@example.com",
    "phone": "+1234567890",
    "address": "123 Test St"
  }'
```

### 4. Test Member Update (PUT)
```bash
curl -X PUT http://localhost:8080/api/members/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Member",
    "email": "updated@example.com",
    "phone": "+1234567890",
    "address": "456 Updated St"
  }'
```

### 5. Test Borrowed Book Creation (POST)
```bash
curl -X POST http://localhost:8080/api/borrowed-books \
  -H "Content-Type: application/json" \
  -d '{
    "book": {"id": "book_id_here"},
    "member": {"id": "member_id_here"},
    "borrowDate": "2025-06-11T00:00:00",
    "dueDate": "2025-06-25T00:00:00"
  }'
```

## Changes Made

### Backend Changes:
1. **Added explicit content type declarations** to all POST and PUT endpoints:
   - `@PostMapping(consumes = "application/json", produces = "application/json")`
   - `@PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")`

2. **Standardized CORS configuration** across all controllers:
   - Added consistent `@CrossOrigin` annotations with proper headers
   - Added explicit methods including OPTIONS for preflight requests

3. **Enhanced content negotiation** in CorsConfig.java

### Frontend Changes:
1. **Added Accept header** to axios configuration
2. **Added request interceptor** to ensure Content-Type is set correctly
3. **Added response interceptor** for better error debugging
4. **Fixed API base URL** to use correct port (8080)

## Debugging Steps

If you're still getting 415 errors, try these debugging steps:

### 1. Check if backend is running:
```bash
curl -X GET http://localhost:8080/api/books
```

### 2. Check request headers being sent:
Open browser developer tools → Network tab → Look at the actual request headers

### 3. Enable detailed logging (add to application.properties):
```properties
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.web.servlet.DispatcherServlet=DEBUG
```

### 4. Test with simple curl first:
```bash
curl -v -X POST http://localhost:8080/api/authors \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "Test Author", "biography": "Test bio", "nationality": "US"}'
```

## Common Causes of "Unsupported Media Type" Error:

1. **Missing Content-Type header** - Fixed by adding interceptor
2. **Mismatched content type expectations** - Fixed by explicit consumes/produces
3. **CORS header issues** - Fixed by standardizing CORS configuration
4. **Request body format issues** - Should be resolved with proper headers

If you're still experiencing issues, check:
- Backend server is running on port 8080 (default Spring Boot port)
- Frontend is sending requests to the correct URL (http://localhost:8080/api)
- Request payloads match the expected model structure
- No firewall or proxy issues blocking requests
- MongoDB is running and accessible on localhost:27017
