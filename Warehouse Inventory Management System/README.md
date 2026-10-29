<div align="center">

# Warehouse & Inventory Management System

### Production-Grade Full-Stack Inventory Platform with AI Demand Forecasting

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-24+-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-Passing-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/ansht21/warehouse-inventory-management-system/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

A robust, industry-standard **Warehouse & Inventory Management System** built with **Java 21**, **Spring Boot 3.3**, and **React 18 (Vite)**.
Engineered with ACID transactional guarantees, JPA optimistic concurrency control, automated JUnit 5 test suites, predictive supply chain analytics, and multi-stage containerization.

</div>

---

## Key Highlights

- **Predictive AI Demand Forecasting**: Heuristic Reorder Point (ROP) calculation, historical 30-day consumption velocity, stockout projection, and automated replenishment alerts.
- **ACID Transaction Boundaries & Concurrency Control**: Hibernate `@Version` optimistic locking to prevent stock race conditions during concurrent transactions.
- **Automated Testing Suite**: 19 unit tests across core business services using **JUnit 5**, **Mockito**, and **AssertJ** with 100% pass rate.
- **Enterprise Security**: Stateless JWT bearer authentication with role-based access control (Admin & Staff) and BCrypt password encryption.
- **DevOps & Containerization**: Multi-stage Docker builds for backend and frontend orchestrated via `docker-compose.yml`, with GitHub Actions CI/CD pipeline.

---

## Live Preview & Dashboard

| Dashboard | AI Demand Forecast | Purchases |
|-----------|--------------------|-----------|
| ![Dashboard](screenshots/dashboard.png) | ![AI Forecast](screenshots/dashboard.png) | ![Purchases](screenshots/purchases.png) |

| Products | Inventory Ledger | Categories |
|----------|------------------|------------|
| ![Products](screenshots/products.png) | ![Inventory](screenshots/inventory.png) | ![Categories](screenshots/categories.png) |

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                      │
│   Dashboard · Products · Inventory · AI Forecast · Purchases · Sales   │
│   Axios Interceptors (Bearer JWT) ──▶ React Router v6 ──▶ Tailwind UI │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (JSON)
┌───────────────────────────────────▼────────────────────────────────────┐
│                  BACKEND (Spring Boot 3.3.2 / Java 21)                 │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │               Spring Security 6 + JWT Filter Chain           │     │
│   └───────────────────────────────┬──────────────────────────────┘     │
│                                   │                                    │
│   ┌───────────────────────────────▼──────────────────────────────┐     │
│   │           REST Controllers (OpenAPI / Swagger v3 Docs)        │     │
│   │ Auth · Product · Category · Supplier · Sale · AI Analytics   │     │
│   └───────────────────────────────┬──────────────────────────────┘     │
│                                   │                                    │
│   ┌───────────────────────────────▼──────────────────────────────┐     │
│   │     Service Layer (@Transactional + Business Logic Validation)│    │
│   │   • Optimistic Locking (@Version)   • ROP Demand Engine       │    │
│   └───────────────────────────────┬──────────────────────────────┘     │
│                                   │                                    │
│   ┌───────────────────────────────▼──────────────────────────────┐     │
│   │         Spring Data JPA Repositories / Hibernate ORM         │     │
│   └───────────────────────────────┬──────────────────────────────┘     │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ JDBC / Connection Pooling (HikariCP)
┌───────────────────────────────────▼────────────────────────────────────┐
│                     DATABASE (MySQL 8.0 InnoDB)                        │
│   Normalized 3NF Schema · Indexed Foreign Keys · Audit Trail Logs      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## AI Predictive Demand Forecasting Engine

The platform incorporates an algorithmic inventory intelligence module (`AiAnalyticsService`) tailored for practical warehouse operations:

1. **Consumption Velocity Analysis**:
   Calculates 30-day average daily outflow per SKU based on historical recorded dispatches:
   $$\text{Avg Daily Demand} = \frac{\sum \text{Stock Dispatched (Last 30 Days)}}{30}$$

2. **Dynamic Reorder Point (ROP)**:
   Accounts for supplier turnaround lead time ($L = 3\text{ days}$) and safety buffer:
   $$\text{Safety Stock} = \max(\text{Min Stock Level}, \lceil \text{Avg Daily Demand} \times 3 \rceil)$$
   $$\text{ROP} = \lceil (\text{Avg Daily Demand} \times \text{Lead Time}) + \text{Safety Stock} \rceil$$

3. **Stockout Horizon Projection**:
   Determines runway days before zero-stock depletion:
   $$\text{Days to Stockout} = \left\lfloor \frac{\text{Current Quantity}}{\text{Avg Daily Demand}} \right\rfloor$$

4. **Risk Stratification**:
   - `CRITICAL`: Days until stockout $\le 3$ (immediate replenishment action required).
   - `WARNING`: Current stock $\le$ calculated ROP.
   - `OVERSTOCKED`: Stock exceeds $3.5\times$ ROP with stagnant sales velocity.
   - `OPTIMAL`: Stock maintains healthy safety buffer.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Java 21 (LTS), Spring Boot 3.3.2, Spring Security 6, Spring Data JPA, Hibernate, JJWT 0.12.5 |
| **Frontend** | React 18, Vite 5.4, Tailwind CSS 3.4, React Router 6, Axios, Lucide Icons |
| **Database** | MySQL 8.0 (InnoDB), Foreign Key Constraints, Audit Trail Ledger |
| **Testing** | JUnit 5, Mockito 5, AssertJ, Spring Boot Test |
| **DevOps & CI/CD** | Docker, Docker Compose, Multi-stage builds, Nginx Alpine, GitHub Actions |
| **Documentation** | SpringDoc OpenAPI 2.6.0 (Swagger UI), Markdown Architecture Specs |

---

## Automated Test Coverage

The backend includes 19 isolated unit tests verifying business service rules and transaction safety:

```bash
cd backend
mvn test
```

### Verified Test Breakdown

| Test Suite | Tests | Scope & Assertions |
|------------|:-----:|-------------------|
| `AuthServiceTest` | 5 | JWT issuance, BCrypt credential check, duplicate username/email guards |
| `ProductServiceTest` | 6 | Auto SKU generation, category/supplier validation, soft-delete, low-stock filter |
| `SaleServiceTest` | 4 | Stock reduction, insufficient stock guards, ledger log creation, rollback |
| `AiAnalyticsServiceTest` | 4 | ROP formula calculation, zero-consumption safety, critical risk thresholds |
| **Total** | **19** | **0 Failures · 0 Errors · 100% Passed** |

---

## Quick Start with Docker (Recommended)

Run the entire application stack (MySQL 8 + Backend + Frontend) in one command:

```bash
# 1. Clone repository
git clone https://github.com/ansht21/warehouse-inventory-management-system.git
cd warehouse-inventory-management-system

# 2. Build and start all containers
docker compose up --build
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Swagger Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

Default credentials:
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`

---

## Manual Local Development Setup

### 1. Prerequisites
- Java 21 JDK (Temurin / OpenJDK)
- Apache Maven 3.8+
- Node.js 18+ & npm
- MySQL Server 8.0+

### 2. Database Initialization
```bash
mysql -u root -p
CREATE DATABASE warehouse_db;
EXIT;

mysql -u root -p warehouse_db < database/schema.sql
```

### 3. Backend Execution
```bash
cd backend
# Set your local database password
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password

# Run Spring Boot
mvn spring-boot:run
```

### 4. Frontend Execution
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

---

## REST API Specification

Interactive Swagger UI available at `http://localhost:8080/swagger-ui.html`.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Authenticate & obtain JWT | Public |
| `POST` | `/api/auth/register` | Register new user | Public |
| `GET`  | `/api/auth/me` | Fetch active profile | Authenticated |
| `GET`  | `/api/dashboard` | KPI analytics & metrics | Authenticated |
| `GET`  | `/api/products` | Paginated product catalog | Authenticated |
| `POST` | `/api/products` | Create SKU with validation | Authenticated |
| `PUT`  | `/api/products/{id}` | Update product & minimum buffer | Authenticated |
| `DELETE` | `/api/products/{id}` | Soft delete product | Authenticated |
| `POST` | `/api/sales` | Create sale & decrement inventory atomically | Authenticated |
| `POST` | `/api/purchases` | Create purchase & increment stock | Authenticated |
| `GET`  | `/api/inventory` | Paginated audit trail ledger | Authenticated |
| `GET`  | `/api/ai/forecast` | SKU demand forecast & ROP list | Authenticated |
| `GET`  | `/api/ai/summary` | Warehouse-wide predictive insights | Authenticated |

---

## Relevance to Software Engineer & Analyst Trainee Roles

This project directly demonstrates core engineering competencies expected in entry-level analyst and developer roles:

1. **Data Handling & Relational Integrity**: 10 normalized tables in 3NF with foreign key constraints, indexing, and non-destructive soft deletes.
2. **Problem Solving & Business Math**: Practical translation of inventory turnover and reorder metrics into automated Java calculations.
3. **Quality Assurance & Verification**: Writing unit tests with Mockito mocks, verifying boundary conditions, and preventing regression errors.
4. **DevOps & Troubleshooting**: Dockerizing services, managing network bridges, and configuring automated CI builds.

### Resume-Ready Project Points

- *Architected a full-stack inventory platform using Java 21, Spring Boot 3.3, and React 18 with stateless JWT authentication and role-based access control.*
- *Implemented JPA optimistic locking (`@Version`) and transactional boundaries (`@Transactional`) across sales and purchases, eliminating concurrent race conditions and ensuring ACID data integrity.*
- *Developed an AI demand forecasting engine computing 30-day consumption velocity, dynamic Reorder Points (ROP), and days-to-stockout alerts to automate replenishment scheduling.*
- *Authored 19 comprehensive unit tests using JUnit 5, Mockito, and AssertJ covering security, inventory decrement logic, and predictive calculations.*
- *Constructed multi-stage Docker builds and automated continuous integration pipelines using GitHub Actions for automated unit testing and build verification.*

---

## License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
Developed by <strong>Ansh Thakur</strong>
</div>
