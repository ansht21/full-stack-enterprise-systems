# 📦 Warehouse Inventory Management System

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

[![Full-Stack Repo](https://img.shields.io/badge/GitLab-college--full--stack--project-FC6D26?style=flat&logo=gitlab&logoColor=white)](https://gitlab.com/ansht_121/college-full-stack-project) · [Profile](https://gitlab.com/ansht_121) · [Portfolio](https://ansh-thakur.netlify.app/)

A full-stack warehouse and inventory management application built as a final year college project. Manages products, categories, suppliers, purchases, sales, inventory logs, users, and a dashboard.

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.3.5, Spring Security + JWT, Spring Data JPA, MySQL, OpenAPI/Swagger, Lombok, JUnit
- **Frontend:** React 18, Vite 5, React Router, Axios, Tailwind CSS, react-hot-toast

## Project Structure

```
Warehouse Inventory Management System/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/com/warehouse/inventory/
│   │   ├── controller/       # REST endpoints (Auth, Product, Sale, Purchase, etc.)
│   │   ├── service/          # Business logic
│   │   ├── repository/       # JPA repositories
│   │   ├── entity/           # JPA entities
│   │   ├── dto/              # Request/response DTOs
│   │   ├── security/         # JWT + Spring Security config
│   │   ├── config/           # OpenAPI, DataInitializer, Security
│   │   └── exception/        # Global exception handling
│   ├── src/main/resources/
│   │   └── application.yml   # DB + JWT config
│   └── pom.xml
└── frontend/                 # React + Vite SPA
    ├── src/
    │   ├── pages/            # Dashboard, Products, Inventory, Sales, etc.
    │   ├── components/       # Layout, ProtectedRoute, UI primitives
    │   ├── context/          # AuthContext
    │   └── api/              # Axios client
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Features

- JWT-based authentication with role-based access
- Product, category, and supplier management
- Purchase and sale order tracking
- Inventory logs (auto-generated on stock changes)
- Dashboard with key metrics
- OpenAPI/Swagger docs at `/swagger-ui.html` (backend)

## Running locally

### Backend
```bash
cd backend
# Configure DB credentials in src/main/resources/application.yml
./mvnw spring-boot:run          # or: mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend dev server (default Vite): http://localhost:5173
Backend dev server (default Spring Boot): http://localhost:8080

## Database

MySQL is used in production (`mysql-connector-j`). Tests use H2 in-memory. Schema is auto-managed by JPA/Hibernate on first run.

## License

College project — for educational use.

---

## 👨‍💻 Author

**Ansh Thakur** — Data Analyst & Machine Learning Practitioner

[![GitLab](https://img.shields.io/badge/GitLab-ansht__121-FC6D26?style=flat&logo=gitlab&logoColor=white)](https://gitlab.com/ansht_121)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live_Site-00C7B7?style=flat&logo=netlify&logoColor=white)](https://ansh-thakur.netlify.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ansh-thakur-5407192b4/)
