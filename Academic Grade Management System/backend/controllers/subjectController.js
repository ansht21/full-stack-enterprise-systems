const { Subject, Department, Faculty } = require('../models');

const getAllSubjects = async (req, res) => {
  try {
    const { semester, department_id } = req.query;
    const where = {};
    if (semester) where.semester = semester;
    if (department_id) where.department_id = department_id;

    const subjects = await Subject.findAll({
      where,
      include: [
        { model: Department, attributes: ['name', 'code'] },
        { model: Faculty, as: 'assignedFaculty', attributes: ['full_name', 'email'] },
      ],
      order: [['semester', 'ASC'], ['subject_code', 'ASC']],
    });

    res.json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['name', 'code'] },
        { model: Faculty, as: 'assignedFaculty', attributes: ['full_name'] },
      ],
    });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { subject_code, subject_name, credits, semester, department_id, faculty_id } = req.body;
    const existing = await Subject.findOne({ where: { subject_code } });
    if (existing) return res.status(400).json({ success: false, message: 'Subject code already exists.' });

    const subject = await Subject.create({ subject_code, subject_name, credits, semester, department_id, faculty_id });
    res.status(201).json({ success: true, message: 'Subject created.', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    await subject.update(req.body);
    res.json({ success: true, message: 'Subject updated.', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    await subject.destroy();
    res.json({ success: true, message: 'Subject deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };
