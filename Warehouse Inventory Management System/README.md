# Warehouse Inventory Management System

A full-stack warehouse and inventory management application built as a final year MCA college project. Manages products, categories, suppliers, purchases, sales, inventory logs, users, and a dashboard.

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
