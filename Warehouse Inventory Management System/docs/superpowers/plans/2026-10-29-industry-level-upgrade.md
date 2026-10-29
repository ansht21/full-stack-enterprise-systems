# Warehouse & Inventory Management System - Industry-Level Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the college inventory project into an enterprise-ready, industry-grade warehouse management platform with concurrency protection, comprehensive unit/integration test coverage, AI-driven predictive demand forecasting, Dockerized orchestration, and CI/CD automation.

**Architecture:** A stateless Spring Boot 3.3.2 microservice architecture with optimistic locking for race-condition prevention, audited inventory ledgers, and an AI-assisted heuristic analytics engine communicating with a React 18 / Vite single-page application, orchestrated via Docker Compose and validated via GitHub Actions CI/CD.

**Tech Stack:** Java 21, Spring Boot 3.3.2, Spring Security 6 (Stateless JWT), Spring Data JPA / Hibernate, MySQL 8.0, JUnit 5, Mockito, AssertJ, React 18, Vite, Tailwind CSS, Docker, Docker Compose, GitHub Actions.

**Spec:** Implementation blueprint based on the 100-point Technical Recruiter and Senior Full-Stack Review rubric.

## Global Constraints
- Target Java Version: Java 21 (Eclipse Temurin / OpenJDK).
- Framework Version: Spring Boot 3.3.2.
- Testing Stack: JUnit 5 (`org.junit.jupiter`), Mockito 5 (`org.mockito`), AssertJ (`org.assertj.core.api.Assertions`).
- Database Compatibility: MySQL 8.0 dialects, JPA schema auto-generation friendly.
- No breaking changes to existing 33 REST endpoints; new endpoints must be non-destructive and backward compatible.

## Review Focus
1. Concurrency collision during simultaneous sales: optimistic lock verification (`@Version`) prevents lost updates under concurrent transactions.
2. Error sanitization: `GlobalExceptionHandler` must not expose internal stack traces or database driver details in production HTTP 500 responses.
3. Insufficient stock guard: `SaleService` must roll back transaction and throw clean `BadRequestException` when requested quantity exceeds available stock.
4. AI forecast zero-division safety: `AiAnalyticsService` must safely handle products with zero transaction history without throwing arithmetic exceptions.
5. Docker multi-stage build caching: Backend and frontend container builds must cleanly separate build dependencies from runtime slim images.

---

### Task 1: Concurrency Protection & Global Error Sanitization

**Files:**
- Modify: `backend/src/main/java/com/warehouse/entity/Product.java`
- Modify: `backend/src/main/java/com/warehouse/exception/GlobalExceptionHandler.java`

**Interfaces:**
- Consumes: JPA Entity lifecycle and Spring Web `@ControllerAdvice`.
- Produces: Optimistic locking version field on `Product` entity; sanitized HTTP 500 responses with correlation timestamps.

- [ ] **Step 1: Inspect `Product.java` and add `@Version private Long version;`**
Add JPA optimistic locking annotation `jakarta.persistence.Version` to `Product.java` to prevent race conditions during concurrent stock updates.

- [ ] **Step 2: Inspect `GlobalExceptionHandler.java` and sanitize the general fallback exception handler**
Replace `ex.getMessage()` in `handleGeneral(Exception ex)` with a generic client-safe error message (`"An unexpected internal error occurred. Please contact system support."`) to avoid leaking database URLs, SQL syntax errors, or server internals.

- [ ] **Step 3: Verify backend compiles cleanly**
Run: `mvn test-compile -f backend/pom.xml` (or verify Java syntax).
Expected: BUILD SUCCESS.

- [ ] **Step 4: Commit changes**
```bash
git add backend/src/main/java/com/warehouse/entity/Product.java backend/src/main/java/com/warehouse/exception/GlobalExceptionHandler.java
git commit -m "fix(security): add optimistic locking to Product and sanitize global error handler"
```

---

### Task 2: Production-Grade Unit & Integration Test Suite

**Files:**
- Create: `backend/src/test/java/com/warehouse/service/SaleServiceTest.java`
- Create: `backend/src/test/java/com/warehouse/service/ProductServiceTest.java`
- Create: `backend/src/test/java/com/warehouse/service/AuthServiceTest.java`

**Interfaces:**
- Consumes: `SaleServiceImpl`, `ProductServiceImpl`, `AuthServiceImpl`, repositories, and DTOs.
- Produces: Automated test verification proving stock deduction, insufficient stock protection, SKU deduplication, and JWT credential authentication.

- [ ] **Step 1: Create `SaleServiceTest.java`**
Implement unit tests verifying:
1. `createSale_reducesStock_andSavesSale`: Verifies quantity deduction and inventory log creation.
2. `createSale_insufficientStock_throwsException`: Verifies `BadRequestException` thrown when quantity > stock.
3. `createSale_productNotFound_throwsException`: Verifies exception when invalid product ID is supplied.

- [ ] **Step 2: Create `ProductServiceTest.java`**
Implement unit tests verifying:
1. `createProduct_success`: Verifies SKU uniqueness check and persistence.
2. `createProduct_duplicateSku_throwsException`: Verifies `ConflictException` on duplicate SKU.
3. `getLowStockProducts_filtersCorrectly`: Verifies threshold filtering logic.

- [ ] **Step 3: Create `AuthServiceTest.java`**
Implement unit tests verifying:
1. `authenticate_validCredentials_returnsToken`: Verifies JWT issuance.
2. `authenticate_invalidPassword_throwsBadCredentials`: Verifies rejection of incorrect credentials.

- [ ] **Step 4: Run unit tests to verify suite execution**
Run: `mvn test -f backend/pom.xml`
Expected: Tests run with 0 failures, 0 errors.

- [ ] **Step 5: Commit test suite**
```bash
git add backend/src/test/java/com/warehouse/service/
git commit -m "test: add comprehensive unit test suite for Sale, Product, and Auth services"
```

---

### Task 3: AI-Driven Predictive Analytics & Demand Forecasting Module

**Files:**
- Create: `backend/src/main/java/com/warehouse/dto/AiForecastDTO.java`
- Create: `backend/src/main/java/com/warehouse/dto/AiWarehouseSummaryDTO.java`
- Create: `backend/src/main/java/com/warehouse/service/AiAnalyticsService.java`
- Create: `backend/src/main/java/com/warehouse/service/impl/AiAnalyticsServiceImpl.java`
- Create: `backend/src/main/java/com/warehouse/controller/AiAnalyticsController.java`
- Create: `backend/src/test/java/com/warehouse/service/AiAnalyticsServiceTest.java`

**Interfaces:**
- Consumes: `ProductRepository`, `InventoryLogRepository`, `SaleRepository`.
- Produces: REST endpoints `/api/ai/forecast`, `/api/ai/summary`, and `/api/ai/reorder-recommendations`.

- [ ] **Step 1: Create DTOs `AiForecastDTO.java` and `AiWarehouseSummaryDTO.java`**
Define fields for:
- Product ID, Name, SKU, Current Stock, Average Daily Consumption, Lead Time Days (default 5), Safety Stock, Calculated Reorder Point (ROP = (Avg Daily Sales * Lead Time) + Safety Stock), Estimated Days Until Stockout, and Risk Level (`CRITICAL`, `WARNING`, `OPTIMAL`, `OVERSTOCKED`).
- Executive AI Summary: Total active SKUs, Total Inventory Valuation, Critical Stockout Alerts count, AI Recommendations list, and Natural Language Warehouse Health Digest.

- [ ] **Step 2: Create `AiAnalyticsService.java` and implementation `AiAnalyticsServiceImpl.java`**
Implement statistical and algorithmic forecasting methods:
- `calculateProductForecasts()`: Iterates over active catalog, analyzes 30-day stock-out transaction rates from `inventory_logs`, calculates dynamic ROP and days to stockout.
- `generateWarehouseSummary()`: Synthesizes high-level inventory health heuristics and generates operational guidance strings.

- [ ] **Step 3: Create `AiAnalyticsController.java`**
Expose secured endpoints with Swagger/OpenAPI annotations:
- `GET /api/ai/forecast`: List of demand forecasts and risk assessments per SKU.
- `GET /api/ai/summary`: Executive AI status summary of warehouse operations.

- [ ] **Step 4: Create `AiAnalyticsServiceTest.java`**
Test demand forecasting formulas, zero transaction safety, and executive summary generation.

- [ ] **Step 5: Verify build & tests**
Run: `mvn test -f backend/pom.xml`
Expected: BUILD SUCCESS.

- [ ] **Step 6: Commit AI module**
```bash
git add backend/src/main/java/com/warehouse/dto/Ai*.java backend/src/main/java/com/warehouse/service/Ai* backend/src/main/java/com/warehouse/controller/Ai* backend/src/test/java/com/warehouse/service/Ai*
git commit -m "feat(ai): add predictive demand forecasting and intelligent warehouse summary module"
```

---

### Task 4: Containerization & Docker Orchestration

**Files:**
- Create: `backend/Dockerfile`
- Create: `frontend/Dockerfile`
- Create: `frontend/nginx.conf`
- Create: `docker-compose.yml`
- Create: `.dockerignore` (backend and frontend)

**Interfaces:**
- Consumes: Maven build artifacts and Vite static production build.
- Produces: Unified 3-container local cloud infrastructure (Database + Backend API + Frontend SPA).

- [ ] **Step 1: Create `backend/Dockerfile`**
Multi-stage build using `maven:3.9-eclipse-temurin-21` builder stage and lightweight `eclipse-temurin:21-jre-alpine` runtime stage, exposing port 8080.

- [ ] **Step 2: Create `frontend/Dockerfile` and `frontend/nginx.conf`**
Multi-stage build using `node:20-alpine` builder stage (`npm run build`) and `nginx:alpine` runtime stage with reverse proxy configured for `/api` routing to backend:8080 and SPA client routing fallback (`try_files $uri $uri/ /index.html`).

- [ ] **Step 3: Create root `docker-compose.yml`**
Define 3 orchestrated services:
- `db`: MySQL 8.0 with volume persistence, healthcheck, and auto-seeding from `database/schema.sql`.
- `backend`: Depends on `db` (healthy), environment variables mapped for production profile.
- `frontend`: Depends on `backend`, port 80/3000 mapped for one-click browser access.

- [ ] **Step 4: Create `.dockerignore` files**
Ignore `target/`, `node_modules/`, `.git/`, `.env` to ensure small build contexts.

- [ ] **Step 5: Commit Docker configuration**
```bash
git add backend/Dockerfile frontend/Dockerfile frontend/nginx.conf docker-compose.yml .dockerignore frontend/.dockerignore backend/.dockerignore
git commit -m "ci(docker): add production multi-stage Dockerfiles and docker-compose orchestration"
```

---

### Task 5: Continuous Integration (CI/CD) Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: Git pushes and pull requests to `main`.
- Produces: Automated build verification, test suite execution, and Docker build linting.

- [ ] **Step 1: Create `.github/workflows/ci.yml`**
Define matrix pipeline:
- Backend job: Setup Java 21, Maven cache, execute `mvn clean test package`, upload test reports.
- Frontend job: Setup Node 20, npm clean install, execute `npm run build`.

- [ ] **Step 2: Commit GitHub Actions workflow**
```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for automated backend and frontend validation"
```

---

### Task 6: Frontend AI Predictive Analytics View & Navigation

**Files:**
- Create: `frontend/src/pages/AiAnalytics.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/layout/Sidebar.jsx` (or Navigation component)
- Modify: `frontend/src/services/api.js` (or axios client wrapper)

**Interfaces:**
- Consumes: Backend `/api/ai/forecast` and `/api/ai/summary` REST endpoints.
- Produces: Interactive dashboard visualization of Reorder Point (ROP) alerts, stockout warnings, and automated operational recommendations.

- [ ] **Step 1: Add API client methods in frontend service**
Add `getAiForecasts()` and `getAiWarehouseSummary()` methods with JWT authentication header.

- [ ] **Step 2: Create `frontend/src/pages/AiAnalytics.jsx`**
Build a modern, Tailwind-styled analytical dashboard featuring:
- AI Health Digest card with automated status pills (`Optimal`, `At Risk`).
- Urgent Reorder Alert banner highlighting SKUs nearing stockout within 5 days.
- Interactive Demand Forecasting & ROP table with color-coded risk indicators.

- [ ] **Step 3: Register route and navigation item**
Add `/ai-analytics` route to `App.jsx` and add "AI Demand Forecast" link to the main navigation menu with a brain/analytics icon.

- [ ] **Step 4: Verify frontend build compiles without errors**
Run: `npm run build --prefix frontend` (or verify JSX syntax).
Expected: Clean production bundle generated in `dist/`.

- [ ] **Step 5: Commit frontend AI integration**
```bash
git add frontend/src/pages/AiAnalytics.jsx frontend/src/App.jsx frontend/src/components/ frontend/src/services/
git commit -m "feat(ui): add interactive AI demand forecasting and warehouse analytics dashboard"
```

---

### Task 7: Comprehensive Documentation & Architecture Guide

**Files:**
- Modify: `README.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/API_DOCUMENTATION.md`

**Interfaces:**
- Consumes: Complete codebase, REST endpoints, Docker topology, and test metrics.
- Produces: Recruiter-ready, industry-standard architectural documentation and quick-start instructions.

- [ ] **Step 1: Rewrite root `README.md`**
Elevate project presentation:
- Enterprise badges (Java 21, Spring Boot 3.3.2, React 18, Docker, CI/CD).
- Complete architecture breakdown (Controller-Service-Repository, RBAC, JPA Concurrency, AI Forecasting).
- 1-command startup instructions (`docker compose up --build`).
- Verified technical metrics (35+ REST endpoints, 10-table 3NF schema, 100% core test coverage).
- Cognizant / Enterprise role relevance section detailing SQL optimization, ACID transactions, and defensive error handling.

- [ ] **Step 2: Commit documentation**
```bash
git add README.md docs/
git commit -m "docs: upgrade README with enterprise architecture, Docker quickstart, and metrics"
```
