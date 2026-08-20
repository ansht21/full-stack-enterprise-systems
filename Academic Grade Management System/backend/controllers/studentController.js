const { Student, Department, User } = require('../models');
const { Op } = require('sequelize');

// GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const { search, department_id, semester, batch_year, page = 1, limit = 10 } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { roll_number: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (department_id) where.department_id = department_id;
    if (semester) where.semester = semester;
    if (batch_year) where.batch_year = batch_year;

    const offset = (page - 1) * limit;
    const { count, rows } = await Student.findAndCountAll({
      where,
      include: [{ model: Department, attributes: ['name', 'code'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Department, attributes: ['name', 'code'] }],
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { roll_number, full_name, email, phone, department_id, semester, batch_year, dob, address } = req.body;

    const existing = await Student.findOne({ where: { [Op.or]: [{ roll_number }, { email }] } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Roll number or email already exists.' });
    }

    // Create login user for student
    const user = await User.create({ name: full_name, email, password: 'Student@123', role: 'student' });

    const student = await Student.create({
      user_id: user.id, roll_number, full_name, email, phone,
      department_id, semester, batch_year, dob, address,
    });

    res.status(201).json({ success: true, message: 'Student created successfully.', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    await student.update(req.body);
    res.json({ success: true, message: 'Student updated successfully.', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    await student.destroy();
    res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
