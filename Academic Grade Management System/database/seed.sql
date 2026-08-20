-- Sample Data for Student Result Management System
USE student_result_db;

-- Departments
INSERT INTO departments (name, code) VALUES
('Computer Science', 'CS'),
('Information Technology', 'IT'),
('Electronics', 'EC'),
('Mechanical Engineering', 'ME');

-- Users (passwords are bcrypt hash of "Password@123")
INSERT INTO users (name, email, password, role) VALUES
('Super Admin', 'superadmin@college.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin'),
('Admin User', 'admin@college.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Dr. Rajesh Kumar', 'rajesh@college.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('Prof. Sunita Sharma', 'sunita@college.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty'),
('Rahul Verma', 'rahul@student.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Priya Singh', 'priya@student.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

-- Faculty
INSERT INTO faculty (user_id, full_name, email, phone, department_id, designation) VALUES
(3, 'Dr. Rajesh Kumar', 'rajesh@college.com', '9876543210', 1, 'Associate Professor'),
(4, 'Prof. Sunita Sharma', 'sunita@college.com', '9876543211', 2, 'Assistant Professor');

-- Students
INSERT INTO students (user_id, roll_number, full_name, email, phone, department_id, semester, batch_year, dob, address) VALUES
(5, 'CS2024001', 'Rahul Verma', 'rahul@student.com', '9876543212', 1, 5, 2022, '2002-05-15', 'Mumbai, Maharashtra'),
(6, 'CS2024002', 'Priya Singh', 'priya@student.com', '9876543213', 1, 5, 2022, '2003-08-22', 'Delhi, India');

-- Subjects
INSERT INTO subjects (subject_code, subject_name, credits, semester, department_id, faculty_id) VALUES
('CS501', 'Data Structures', 4, 5, 1, 1),
('CS502', 'Database Management', 4, 5, 1, 1),
('CS503', 'Computer Networks', 3, 5, 1, 2),
('CS504', 'Operating Systems', 4, 5, 1, 2),
('CS505', 'Software Engineering', 3, 5, 1, 1);

-- Marks
INSERT INTO marks (student_id, subject_id, semester, internal_marks, practical_marks, theory_marks, total_marks, grade) VALUES
(1, 1, 5, 18, 20, 55, 93, 'O'),
(1, 2, 5, 16, 18, 48, 82, 'A+'),
(1, 3, 5, 14, 15, 42, 71, 'B+'),
(1, 4, 5, 17, 19, 52, 88, 'A+'),
(1, 5, 5, 15, 16, 45, 76, 'A'),
(2, 1, 5, 20, 20, 58, 98, 'O'),
(2, 2, 5, 18, 19, 54, 91, 'O'),
(2, 3, 5, 16, 17, 49, 82, 'A+'),
(2, 4, 5, 19, 20, 56, 95, 'O'),
(2, 5, 5, 17, 18, 51, 86, 'A+');

-- Results
INSERT INTO results (student_id, semester, total_marks, obtained_marks, percentage, sgpa, cgpa, status, is_published) VALUES
(1, 5, 500, 410, 82.00, 8.20, 8.05, 'pass', TRUE),
(2, 5, 500, 452, 90.40, 9.04, 8.90, 'pass', TRUE);
