# Product Requirements Document (PRD): Scalable Auth & Trade-Signal Ecosystem

**Version:** 1.0  
**Status:** Draft / Assignment Submission  
**Author:** Priyanshu Chaurasia  
**Target Organization:** Primetrade.ai

---

## 1. Executive Summary

The objective is to build a high-performance, secure, and scalable full-stack application that demonstrates proficiency in modern backend architecture and frontend integration. The system will feature a robust **Identity Access Management (IAM)** layer and a **Trade Signal Management** system, tailored for a fintech/Web3 environment.

---

## 2. Project Goals

- **Security First:** Implementation of industry-standard authentication (JWT) and authorization (RBAC).
- **Performance & Scalability:** Utilization of modular architecture, caching strategies, and efficient database indexing.
- **Seamless UX:** A responsive dashboard to interact with backend APIs with real-time feedback.
- **Developer Experience (DX):** Fully documented APIs with automated validation and type safety.

---

## 3. Target Audience

- **Standard Users:** Can view trade signals and manage their own profile.
- **Admins:** Can create, update, and delete trade signals (CRUD), and manage user roles.

---

## 4. Functional Requirements

### 4.1 Backend (Core Engine)

| Feature | Requirement |
|---------|-------------|
| **Authentication** | Register/Login using Email/Password with bcrypt hashing ($12$ rounds). |
| **JWT Management** | Dual-token system: Short-lived Access Token + HttpOnly Refresh Token. |
| **RBAC** | Middleware to restrict POST, PATCH, DELETE routes to ADMIN role only. |
| **Entity CRUD** | Full lifecycle management for "Trade Signals" (Symbol, Entry, Target, Stop Loss). |
| **Validation** | Schema-based validation (Zod) for all incoming Request Bodies and Params. |
| **Versioning** | All APIs prefixed with `/api/v1/` to ensure backward compatibility. |

### 4.2 Frontend (User Interface)

| Feature | Requirement |
|---------|-------------|
| **Auth Pages** | Clean, minimalist Login and Registration forms with validation errors. |
| **Dashboard** | A protected route displaying a table/grid of Trade Signals fetched from the API. |
| **Admin Tools** | Conditional rendering of "Create Signal" buttons only for Admin users. |
| **Global State** | Centralized Auth provider to manage user session across the app. |

---

## 5. Technical Specification

### 5.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js (v20+) with TypeScript |
| **Framework** | Express.js (Modular Monolith) |
| **Database** | PostgreSQL with Prisma ORM for type-safe queries |
| **Caching** | Redis (for Refresh Token blacklisting or Signal caching) |
| **Frontend** | React (Vite) + Tailwind CSS + TanStack Query |

### 5.2 Database Schema (High-Level)

- **User Table:** `id`, `email`, `password_hash`, `role` (Enum: USER, ADMIN), `last_login`.
- **Signal Table:** `id`, `symbol`, `entry_price`, `target_price`, `stop_loss`, `status`, `created_by` (FK), `timestamps`.

---

## 6. Security & Scalability Plan

### 6.1 Security Measures

- **Rate Limiting:** Protect against DoS on Auth routes (max 5 requests/min per IP).
- **Input Sanitization:** Prevent SQLi and XSS via Prisma and dedicated middleware.
- **CORS Policy:** Strict origin checks to allow only the production frontend domain.
- **Error Handling:** Global middleware to ensure stack traces are never leaked in production.

### 6.2 Scalability Roadmap

- **Horizontal Scaling:** Stateless Auth (JWT) allows the backend to run on multiple containers behind a Load Balancer (Nginx).
- **Database Optimization:** Indexing on `email` (User) and `status`/`createdAt` (Signals).
- **Async Processing:** Implement BullMQ or RabbitMQ for non-blocking tasks like sending welcome emails or trade alerts.

---

## 7. Success Metrics & Deliverables

| Metric | Target |
|--------|--------|
| **Performance** | API response time < 200ms for CRUD operations |
| **Code Quality** | Zero TypeScript errors; ESLint/Prettier compliance |
| **Documentation** | Comprehensive README.md and a functional Postman/Swagger link |
| **Deployment** | Live URL for both Frontend (Vercel) and Backend (Render/Railway) |

---

## 8. Timeline (72-Hour Sprint)

| Phase | Hours | Deliverable |
|-------|-------|-------------|
| **Phase 1** | 0–12 | Backend architecture, DB schema, and Auth logic |
| **Phase 2** | 12–36 | Entity CRUD, Middleware refinement, and Unit Testing |
| **Phase 3** | 36–60 | Frontend Dashboard, Integration with TanStack Query |
| **Phase 4** | 60–72 | Deployment, Documentation, and Final Submission |