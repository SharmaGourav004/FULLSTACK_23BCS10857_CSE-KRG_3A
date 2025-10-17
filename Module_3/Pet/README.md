# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running the full project (frontend + backend)

1. Backend (Spring Boot):
	- Configure MySQL and update `backend/src/main/resources/application.properties`.
	- From `backend/` run: `mvn spring-boot:run` (server runs on port 8080).

2. Frontend (Vite/React):
	- From project root run: `npm install` then `npm run dev`.
	- Frontend runs typically on http://localhost:5173 and will call the backend at http://localhost:8080 for auth.

Module 3 implements a basic Spring Boot auth backend with JWT and simple role seeding. Use the seeded faculty account: `faculty@example.com` / `password` for quick login.
