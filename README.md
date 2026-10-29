<div align="center">

# 🖥️ Full-Stack Projects Monorepo

### Production-grade and role-based web applications across the JavaScript and Java ecosystems

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-Passing-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

<br/>

[![GitHub Profile](https://img.shields.io/badge/GitHub-ansht21-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ansht21)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live_Site-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://ansh-thakur-netlify.netlify.app/)
[![Data Analytics](https://img.shields.io/badge/GitHub-Data_Analytics-6C8CFF?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ansht21/data-analytics)
[![Machine Learning](https://img.shields.io/badge/GitHub-Machine_Learning_Portfolio-A97BFF?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ansht21/machine-learning-portfolio)

</div>

---

This repository contains two complete full-stack software applications, each in its own self-contained directory with source code, setup instructions, and database schemas. Together they demonstrate enterprise authentication, role-based access control (RBAC), ACID transaction handling, concurrency management, predictive AI heuristics, automated unit testing, containerization, and modern responsive frontends across **Node.js** and **Java / Spring Boot 3**.

---

## Projects Overview

### 1. 📦 [Warehouse Inventory Management System](./Warehouse%20Inventory%20Management%20System/)

An enterprise-ready **Warehouse & Inventory Management Platform** engineered with **Java 21**, **Spring Boot 3.3.2**, and **React 18 (Vite)** featuring predictive AI demand forecasting, ACID transaction boundaries, and multi-stage containerization.

| Dimension | Details |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, Axios (JWT interceptors) |
| **Backend** | Java 21, Spring Boot 3.3.2, Spring Security 6, Spring Data JPA / Hibernate |
| **Database** | MySQL 8.0 InnoDB (10 normalized 3NF tables, audit ledger logs) |
| **AI Demand Engine** | 30-day velocity, Dynamic Reorder Point ($ROP = (\text{Avg Daily Demand} \times \text{Lead Time}) + \text{Safety Stock}$), Days-to-Stockout runway, Risk stratification |
| **Concurrency & ACID** | JPA Optimistic Locking (`@Version` on `Product`), transactional boundaries (`@Transactional`) |
| **Testing** | 19 Unit Tests (JUnit 5, Mockito, AssertJ) with 100% pass rate |
| **DevOps** | Multi-stage Dockerfiles, `docker-compose.yml`, GitHub Actions CI/CD workflow |

→ **[Read the Full Warehouse Documentation & Setup Guide](./Warehouse%20Inventory%20Management%20System/README.md)**

---

### 2. 🎓 [Academic Grade Management System](./Academic%20Grade%20Management%20System/)

A role-based **Student Result Management System** that allows colleges to manage students, faculty, courses, and marks, publishing semester results with automated rank lists and marksheets.

| Dimension | Details |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express.js, Sequelize ORM |
| **Database** | MySQL (`schema.sql`, `seed.sql`) |
| **Security** | Stateless JWT authentication, BCrypt password encryption, RBAC (Admin / Faculty / Student) |
| **Highlights** | Faculty grade entry, one-click semester result publishing, automatic SGPA & grade calculation |

→ **[Read the Full Academic Grade README](./Academic%20Grade%20Management%20System/README.md)**

---

## Tech Stack Comparison

| Capability | Warehouse Inventory Management | Academic Grade Management |
| :--- | :--- | :--- |
| **Primary Language** | Java 21 (LTS) | JavaScript / Node.js 20 |
| **Backend Framework** | Spring Boot 3.3.2 | Express.js |
| **ORM / Data Access** | Spring Data JPA / Hibernate | Sequelize ORM |
| **Security & Auth** | Spring Security 6 + Stateless JWT | Express Middleware + JWT + BCrypt |
| **Concurrency Model** | JPA Optimistic Locking (`@Version`) | Relational DB transactions |
| **Specialized Feature** | Algorithmic AI Demand Forecasting (ROP) | Academic SGPA & Result Aggregation |
| **Automated Testing** | 19 Unit Tests (JUnit 5 + Mockito 5) | API Integration Testing |
| **Containerization** | Docker, Docker Compose (MySQL + App + Web) | Node Container / Local Node |
| **CI/CD** | GitHub Actions Automated Test & Build | GitHub Actions / npm scripts |

---

## Repository Structure

```
full-stack-enterprise-systems/
│
├── .github/workflows/
│   └── ci.yml                                      # Automated CI/CD pipeline (backend test & frontend build)
│
├── Warehouse Inventory Management System/          # Flagship Java 21 + Spring Boot 3 + React 18 + AI
│   ├── backend/                                    # Spring Boot application (Controllers, Services, Repositories, DTOs)
│   │   ├── Dockerfile                              # Multi-stage Java 21 build
│   │   ├── pom.xml                                 # Maven configuration
│   │   └── src/test/                               # 19 Unit Tests (Auth, Product, Sale, AI Analytics)
│   ├── frontend/                                   # React 18 + Vite + Tailwind CSS SPA
│   │   ├── Dockerfile                              # Multi-stage Node 20 + Nginx Alpine build
│   │   └── src/pages/AiAnalytics.jsx               # AI Demand Forecasting UI
│   ├── database/schema.sql                         # MySQL normalized schema + initial seeds
│   ├── docker-compose.yml                          # Full-stack container orchestration
│   └── README.md                                   # Detailed warehouse architecture & API specs
│
├── Academic Grade Management System/               # Student Grade Platform (Node.js + React + Express)
│   ├── backend/                                    # Express API server
│   ├── frontend/                                   # React UI client
│   ├── database/                                   # Schema and seed scripts
│   └── README.md                                   # Academic system documentation
│
└── README.md                                       # Monorepo overview (this file)
```

---

## Quick Launch: Warehouse Inventory with Docker

Run the complete Warehouse stack in one command:

```bash
cd "Warehouse Inventory Management System"
docker compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

Default credentials:
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`

---

## 👨‍💻 Author

**Ansh Thakur** — Data Analyst & Software Engineer · B.Sc. Information Technology

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-ansht21-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ansht21)
[![Portfolio](https://img.shields.io/badge/Portfolio-ansh--thakur.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://ansh-thakur-netlify.netlify.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ansh-thakur-5407192b4/)
[![Email](https://img.shields.io/badge/Email-ansht1194@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ansht1194@gmail.com)

</div>
