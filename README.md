# PrimeTrade.ai - Scalable Auth & Trade-Signal Ecosystem

A high-performance, secure, and scalable full-stack application demonstrating modern backend architecture and frontend integration for a fintech/Web3 environment.

## 🚀 Features

- **Robust Authentication:** JWT-based dual-token system (short-lived access + HttpOnly refresh token).
- **Role-Based Access Control (RBAC):** Admin-only access to mutations (create, edit, delete).
- **Secure by Default:** Rate limiting, Helmet (secure headers), Input sanitization (Zod + Prisma).
- **Performance:** Caching fallback using Redis, optimized PostgreSQL indexing.
- **Modern UI:** React (Vite) + Tailwind CSS v4 + TanStack Query with Glassmorphism aesthetic.

## 🏗️ Architecture Stack

- **Frontend:** React, Vite, TailwindCSS v4, React Router Dom, TanStack Query, Axios, Lucide React.
- **Backend:** Node.js, Express, TypeScript, Zod, JWT, bcryptjs.
- **Database:** PostgreSQL (managed via Prisma ORM), Redis (for Refresh token management).

## 📂 Project Structure

This is a monorepo containing both the frontend and backend applications.

- `/backend` - Express REST API
- `/frontend` - Vite React App

## 🚦 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL database
- Redis server (optional, will gracefully fallback if not available)

### 1. Database Setup

Create a PostgreSQL database and update the `DATABASE_URL` in `/backend/.env`.

### 2. Backend Setup

```bash
cd backend
npm install

# Apply database migrations
npm run prisma:migrate

# Seed database with sample data & admin user
npm run prisma:seed

# Start dev server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

## 🔐 Default Credentials (from seeder)

- **Admin Login:** `admin@primetrade.ai` / `Admin@123`
- **User Login:** `user@primetrade.ai` / `User@123`

## 📖 API Documentation (Swagger)

Once the backend is running, the Swagger documentation is available at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## 🛡️ Security Measures Implemented
- **Rate Limiting:** Protects auth endpoints against brute-force (5 req/min).
- **CORS Configuration:** Strictly allows configured frontend URL.
- **HttpOnly Cookies:** Prevents XSS attacks from stealing refresh tokens.
- **Centralized Error Handling:** Ensures no stack traces leak to the client.

## 📈 Scalability Roadmap
- **Horizontal Scaling:** Stateless authentication allows running behind a load balancer (Nginx).
- **Asynchronous Processing:** Ready for integration with BullMQ/RabbitMQ for trade alerts.
