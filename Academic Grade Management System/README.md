# 🎓 Student Result Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A full-stack, role-based **Student Result Management System** built as a final year college project. It allows colleges to manage students, faculty, subjects, marks, and generate semester results with marksheets.

---

## 🖥️ Live Demo Screenshots

> Login → Dashboard → Marks Entry → Result → Marksheet → Rank List

---

## ✨ Features

### 👨‍💼 Admin
- 📊 Dashboard with stats (Students, Faculty, Pass %)
- 👥 Full CRUD — Students, Faculty, Subjects
- ✏️ Marks entry (Internal + Practical + Theory)
- ⚡ One-click result generation
- 📢 Publish / unpublish results
- 🏆 Semester rank list with medals

### 👨‍🏫 Faculty
- Enter marks for students
- View result statistics

### 🎓 Student
- View published semester results
- View subject-wise marksheet
- Print marksheet as PDF

### 🔐 Security
- JWT-based authentication
- Role-based access control (Super Admin / Admin / Faculty / Student)
- bcrypt password hashing
- Protected API routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MySQL |
| ORM | Sequelize |
| Auth | JWT, bcryptjs |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
StudentResultMS/
│
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routes
│   ├── utils/           # Grade & SGPA calculator
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/
│       ├── components/  # Sidebar, Modal, StatCard
│       ├── context/     # Auth context
│       ├── pages/       # Admin & Student pages
│       └── utils/       # Axios instance
│
└── database/
    ├── schema.sql       # All table definitions
    └── seed.sql         # Sample data
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MySQL](https://dev.mysql.com/downloads/) v8+
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (optional)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ansht120/full-stack-web-development.git
cd full-stack-web-development
```

---

### Step 2 — Setup Database

Open MySQL Workbench or MySQL terminal and run:

```sql
source database/schema.sql
source database/seed.sql
```

This creates the `student_result_db` database with all tables and sample data.

---

### Step 3 — Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_result_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Install dependencies and start:

```bash
npm install
npm run dev
```

✅ API running at: `http://localhost:5000`

---

### Step 4 — Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

✅ App running at: `http://localhost:3000`

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.com | Password@123 |
| Faculty | rajesh@college.com | Password@123 |
| Student | rahul@student.com | Password@123 |
| Student | priya@student.com | Password@123 |

> New students get default password: `Student@123`
> New faculty get default password: `Faculty@123`

---

## 📊 Grade System

| Marks (out of 100) | Grade | Grade Point |
|--------------------|-------|-------------|
| 90 and above | O (Outstanding) | 10 |
| 80 – 89 | A+ (Excellent) | 9 |
| 70 – 79 | A (Very Good) | 8 |
| 60 – 69 | B+ (Good) | 7 |
| 50 – 59 | B (Average) | 6 |
| 40 – 49 | C (Pass) | 5 |
| Below 40 | F (Fail) | 0 |

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/login | Login | No |
| GET | /auth/me | Get current user | Yes |
| GET | /students | List all students | Yes |
| POST | /students | Add student | Admin |
| PUT | /students/:id | Update student | Admin |
| DELETE | /students/:id | Delete student | Admin |
| GET | /faculty | List faculty | Yes |
| POST | /faculty | Add faculty | Admin |
| GET | /subjects | List subjects | Yes |
| POST | /subjects | Add subject | Admin |
| GET | /marks | Get marks | Yes |
| POST | /marks | Enter marks | Admin/Faculty |
| POST | /results/generate | Generate result | Admin |
| POST | /results/publish | Publish result | Admin |
| GET | /results/marksheet/:sid/:sem | Get marksheet | Yes |
| GET | /results/rank-list/:semester | Rank list | Yes |
| GET | /dashboard/admin | Admin stats | Admin/Faculty |

---

## 🗄️ Database Schema

```
users          → id, name, email, password, role
students       → id, roll_number, full_name, department_id, semester
faculty        → id, full_name, department_id, designation
departments    → id, name, code
subjects       → id, subject_code, subject_name, credits, semester, faculty_id
marks          → id, student_id, subject_id, internal, practical, theory, total, grade
results        → id, student_id, semester, percentage, sgpa, status, is_published
audit_logs     → id, user_id, action, module, created_at
```

---

## 🚀 How to Use

1. **Login** as Admin at `http://localhost:3000`
2. Go to **Students** → Add students
3. Go to **Faculty** → Add faculty members
4. Go to **Subjects** → Add subjects and assign faculty
5. Go to **Marks Entry** → Select student → Enter marks per subject
6. Go to **Results** → Click Generate → Click Publish
7. Login as **Student** → View Results → View Marksheet → Print

---

## 👨‍💻 Author

**Ansh Thakur**
- GitHub: [@ansht120](https://github.com/ansht120)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built as a Final Year College Project — B.Sc Information Technology*
