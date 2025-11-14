# Pet Adoption Platform

A full-stack pet adoption platform with React frontend and Spring Boot backend.

## Features

- 🐾 Pet listing and adoption requests
- 🩺 Veterinary appointment booking
- 👤 User authentication with JWT (Admin and User roles)
- 📸 Cloudinary image upload
- 🔐 Role-based access control

## Modules Implemented

### Module 3: Backend – Authentication + Connect to Frontend
- Spring Boot setup with MySQL database
- JWT authentication & role-based access control
- User registration and login endpoints
- React login/register pages connected to backend
- Secure routes with authentication checks

### Module 4: Backend – Pet Listings, Adoption, Vet Booking
- CRUD APIs for pet management with Cloudinary image uploads
- Adoption request APIs with status tracking
- Vet booking APIs with scheduling logic
- Full frontend-backend integration for pets, adoptions, and vet bookings

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router

### Backend
- Spring Boot 3.5.7
- MySQL
- JWT Authentication
- Cloudinary (Image upload)
- Spring Security

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven (or use mvnw wrapper)

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

### Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Update credentials in `backend/src/main/resources/application.properties`:
```properties
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET
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

   Or use the provided scripts from the root directory:
   - `start-backend.ps1` (PowerShell)
   - `start-backend.bat` (CMD)

3. Backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to http://localhost:8080):
```env
VITE_API_BASE=http://localhost:8080
```

4. Start development server:
```bash
npm run dev
```

5. Frontend will start on `http://localhost:5173`

## Default Users

After starting the backend, you can register new users via the `/register` page or create an admin user manually.

### Create Admin User (Optional)
You can create an admin user by registering and then manually updating the role in the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Default user role: `USER`
Available roles: `USER`, `ADMIN`

## API Endpoints

### Authentication (Module 3)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Pets (Module 4)
- `GET /api/pets` - Get all pets (public)
- `GET /api/pets/{id}` - Get pet by ID (public)
- `POST /api/pets` - Create pet (Admin only)
- `PUT /api/pets/{id}` - Update pet (Admin only)
- `DELETE /api/pets/{id}` - Delete pet (Admin only)

### Adoption Requests (Module 4)
- `GET /api/adoptions` - Get all adoption requests (Admin only)
- `GET /api/adoptions/user` - Get user's own adoption requests (authenticated)
- `POST /api/adoptions?petId={id}&message={msg}` - Submit adoption request (authenticated)
- `PATCH /api/adoptions/{id}?status={status}` - Update adoption status (Admin only)

### Vet Appointments (Module 4)
- `GET /api/vet/appointments` - Get all appointments (Admin only)
- `GET /api/vet/user-appointments` - Get user's appointments (authenticated)
- `POST /api/vet/appointments` - Book appointment (authenticated)
- `GET /api/vet/availability` - Get available time slots (public)
- `POST /api/vet/availability` - Create availability slot (Admin only)
- `DELETE /api/vet/availability/{id}` - Delete availability slot (Admin only)

### Image Upload (Module 4)
- `POST /api/uploads/image` - Upload image to Cloudinary (authenticated)

## Deployment

### Backend Deployment

1. Build the application:
```bash
cd backend
mvnw.cmd clean package
```

2. Run the JAR:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

3. For production, update `application.properties`:
   - Set strong JWT secret
   - Update database credentials
   - Set proper CORS origins
   - Configure Cloudinary credentials

### Frontend Deployment

1. Build for production:
```bash
cd Frontend
npm run build
```

2. The `dist` folder contains production-ready files

3. Deploy `dist` folder to any static hosting service (Vercel, Netlify, etc.)

4. Set environment variable `VITE_API_BASE` to your backend URL

## Environment Variables

### Backend (application.properties)
- `spring.datasource.url` - Database connection URL
- `spring.datasource.username` - Database username
- `spring.datasource.password` - Database password
- `app.jwt.secret` - JWT secret key
- `app.jwt.expiration-ms` - JWT expiration time
- `cloudinary.cloud-name` - Cloudinary cloud name
- `cloudinary.api-key` - Cloudinary API key
- `cloudinary.api-secret` - Cloudinary API secret
- `app.cors.allowed-origins` - Allowed CORS origins

### Frontend (.env)
- `VITE_API_BASE` - Backend API URL (default: http://localhost:8080)

## Troubleshooting

### Backend won't start
- Check MySQL is running and database exists
- Verify database credentials in `application.properties`
- Check Java version (requires Java 17+)

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check CORS configuration in `SecurityConfig.java`
- Verify `VITE_API_BASE` environment variable

### Image upload fails
- Verify Cloudinary credentials in `application.properties`
- Check Cloudinary account is active
- Ensure user is authenticated

### Database connection errors
- Verify MySQL is running
- Check database name matches configuration
- Ensure user has proper permissions

## License

This project is for educational purposes.

## Support

For issues and questions, please check the codebase or create an issue in the repository.

