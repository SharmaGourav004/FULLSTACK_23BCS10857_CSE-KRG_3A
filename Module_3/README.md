# Pet Adoption Platform - Module 3: Backend Authentication

A Spring Boot backend with JWT authentication and role-based access control connected to MySQL database.

## Module 3 Features

- 🔐 JWT-based authentication
- 👤 User registration and login
- 🔑 Role-based access (USER, ADMIN)
- 🗄️ MySQL database integration
- 🔒 Secure password hashing with BCrypt

## Tech Stack

- Spring Boot 3.5.7
- MySQL 8.0+
- JWT (JSON Web Tokens)
- Spring Security
- Spring Data JPA

## Prerequisites

- Java 17+
- MySQL 8.0+
- Maven (or use mvnw wrapper included)

## Setup Instructions

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE petcare;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/petcare
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Run the application:
   - **Windows (PowerShell):**
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **Windows (CMD):**
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - **Linux/Mac:**
     ```bash
     ./mvnw spring-boot:run
     ```

3. Backend will start on `http://localhost:8080`

## API Endpoints

### Authentication Endpoints (Public)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "role": "USER",
  "name": "John Doe"
}
```

### Development Endpoints (Public - for testing)

#### Create Admin User
```http
POST /api/dev/create-admin
```
Creates: `admin@petapp.local` / `admin123`

#### Create Test User
```http
POST /api/dev/create-test-user
```
Creates: `user@petapp.local` / `user123`

## Authentication Flow

1. **Register**: User registers with name, email, and password
2. **Login**: User logs in with email and password
3. **Receive JWT**: Backend returns JWT token with user info
4. **Protected Routes**: Use token in Authorization header: `Bearer <token>`

## Security Configuration

- All endpoints require authentication except:
  - `/api/auth/**` (register, login)
  - `/api/dev/**` (development utilities)
  - `/h2-console/**` (if H2 console is enabled)

- Passwords are hashed using BCrypt
- JWT tokens expire after 1 hour (configurable)
- CORS enabled for `http://localhost:5173` and `http://127.0.0.1:5173`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);
```

## Configuration

Key properties in `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/petcare
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JWT
app.jwt.secret=change-this-dev-secret-please-1234567890
app.jwt.expiration-ms=3600000

# CORS
app.cors.allowed-origins=http://localhost:5173,http://127.0.0.1:5173
```

## Testing with cURL

### Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Create Admin (for testing)
```bash
curl -X POST http://localhost:8080/api/dev/create-admin
```

## Project Structure

```
backend/
├── src/main/java/com/adoptionplatform/backend/
│   ├── BackendApplication.java           # Main application entry point
│   ├── controller/
│   │   ├── AuthController.java          # Login & Register endpoints
│   │   └── DevController.java           # Development utilities
│   ├── dto/
│   │   ├── AuthRequest.java             # Login request DTO
│   │   ├── LoginResponse.java           # Login response DTO
│   │   └── RegisterRequest.java         # Registration request DTO
│   ├── model/
│   │   └── User.java                    # User entity
│   ├── repository/
│   │   └── UserRepository.java          # User data access
│   ├── security/
│   │   ├── JwtFilter.java               # JWT authentication filter
│   │   ├── JwtUtil.java                 # JWT token utilities
│   │   └── SecurityConfig.java          # Security configuration
│   └── service/
│       └── UserService.java             # User business logic
└── src/main/resources/
    └── application.properties           # Application configuration
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `application.properties`

### JWT Token Issues
- Ensure token is sent in Authorization header: `Bearer <token>`
- Check token hasn't expired (default: 1 hour)
- Verify JWT secret is set in `application.properties`

### CORS Issues
- Verify frontend URL is in `app.cors.allowed-origins`
- Check browser console for CORS errors

## Next Steps

- Connect a frontend (React/Angular/Vue) to consume these APIs
- Implement password reset functionality
- Add email verification
- Implement refresh tokens
- Add more user roles and permissions

## License

This project is for educational purposes - Module 3: Backend Authentication.
