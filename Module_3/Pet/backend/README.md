Pet Backend (Module 3)

Quick start (development)

1. Ensure you have Java 11+ and Maven installed.
2. Create a MySQL database named `petdb` and update `src/main/resources/application.properties` with your DB credentials.
3. From this folder run:

   mvn spring-boot:run

By default the server runs on port 8080. The frontend expects backend at http://localhost:8080.

Auth endpoints:
- POST /api/auth/register  { name, email, password }
- POST /api/auth/login     { email, password }

The server will return a JSON object with a `token` property. Store it on the client (we use localStorage.token).

Notes:
- This is a minimal development setup with JWT and simple role seeding. For production, rotate the JWT secret and secure DB credentials.
