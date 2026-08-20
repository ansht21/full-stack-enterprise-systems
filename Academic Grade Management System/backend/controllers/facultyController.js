const { Faculty, Department, Subject, User } = require('../models');
const { Op } = require('sequelize');

const getAllFaculty = async (req, res) => {
  try {
    const { search, department_id } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (department_id) where.department_id = department_id;

    const faculty = await Faculty.findAll({
      where,
      include: [
        { model: Department, attributes: ['name', 'code'] },
        { model: Subject, attributes: ['subject_name', 'subject_code'] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['name', 'code'] },
        { model: Subject, as: undefined },
      ],
    });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found.' });
    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const { full_name, email, phone, department_id, designation } = req.body;

    const existing = await Faculty.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists.' });

    const user = await User.create({ name: full_name, email, password: 'Faculty@123', role: 'faculty' });
    const faculty = await Faculty.create({ user_id: user.id, full_name, email, phone, department_id, designation });

    res.status(201).json({ success: true, message: 'Faculty created.', data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found.' });
    await faculty.update(req.body);
    res.json({ success: true, message: 'Faculty updated.', data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found.' });
    await faculty.destroy();
    res.json({ success: true, message: 'Faculty deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty };
