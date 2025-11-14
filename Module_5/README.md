# Pet Adoption Platform

A full-stack pet adoption platform with React frontend and Spring Boot backend.

## Features

- 🐾 Pet listing and adoption requests
- 📝 Blog posts for pet care tips
- 🩺 Veterinary appointment booking
- 👤 User authentication (Admin, Doctor, User roles)
- 📸 Cloudinary image upload
- 🔐 JWT-based authentication

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

After starting the backend, create default users using these endpoints:

### Create Admin User
```bash
POST http://localhost:8080/api/dev/create-admin
```
Default credentials: `admin@petapp.local` / `admin123`

### Create Doctor User
```bash
POST http://localhost:8080/api/dev/create-doctor
```
Default credentials: `doctor@petapp.local` / `doctor123`

### Seed Pets
```bash
POST http://localhost:8080/api/dev/seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Pets
- `GET /api/pets` - Get all pets (public)
- `GET /api/pets/{id}` - Get pet by ID (public)
- `POST /api/pets` - Create pet (Admin only)
- `PUT /api/pets/{id}` - Update pet (Admin only)
- `DELETE /api/pets/{id}` - Delete pet (Admin only)

### Blogs
- `GET /api/blogs` - Get all blogs (public)
- `GET /api/blogs/{id}` - Get blog by ID (public)
- `POST /api/blogs` - Create blog (authenticated)
- `PUT /api/blogs/{id}` - Update blog (owner/admin)
- `DELETE /api/blogs/{id}` - Delete blog (owner/admin)
- `POST /api/blogs/{id}/like` - Like blog (authenticated)

### Adoption Requests
- `GET /api/adoptions` - Get all adoption requests (Admin only)
- `POST /api/adoptions?petId={id}&message={msg}` - Submit adoption request (authenticated)
- `PATCH /api/adoptions/{id}?status={status}` - Update adoption status (Admin only)

### Vet Appointments
- `GET /api/vet/appointments` - Get appointments (Admin only)
- `POST /api/vet/appointments` - Book appointment (authenticated)
- `GET /api/vet/availability` - Get available slots (public)
- `POST /api/vet/availability` - Create availability slot (Doctor/Admin)
- `DELETE /api/vet/availability/{id}` - Delete availability slot (Doctor/Admin)

### Image Upload
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

