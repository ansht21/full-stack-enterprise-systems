const { Result, Student, Mark, Subject, Department } = require('../models');
const { calculateGrade, calculateSGPA } = require('../utils/gradeCalculator');

// POST /api/results/generate - Generate semester result for a student
const generateResult = async (req, res) => {
  try {
    const { student_id, semester } = req.body;

    const marks = await Mark.findAll({
      where: { student_id, semester },
      include: [{ model: Subject, attributes: ['credits', 'subject_name'] }],
    });

    if (!marks.length) {
      return res.status(404).json({ success: false, message: 'No marks found for this student and semester.' });
    }

    let totalMax = 0;
    let totalObtained = 0;
    let hasFail = false;

    marks.forEach((m) => {
      totalMax += 100; // assuming max 100 per subject
      totalObtained += parseFloat(m.total_marks);
      if (m.grade === 'F') hasFail = true;
    });

    const percentage = parseFloat(((totalObtained / totalMax) * 100).toFixed(2));
    const sgpa = calculateSGPA(marks);
    const status = hasFail ? 'fail' : 'pass';

    const [result] = await Result.upsert({
      student_id, semester,
      total_marks: totalMax,
      obtained_marks: totalObtained,
      percentage, sgpa, cgpa: sgpa,
      status,
    });

    res.json({ success: true, message: 'Result generated.', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/results?student_id=&semester=
const getResults = async (req, res) => {
  try {
    const { student_id, semester } = req.query;
    const where = {};
    if (student_id) where.student_id = student_id;
    if (semester) where.semester = semester;

    const results = await Result.findAll({
      where,
      include: [
        {
          model: Student,
          attributes: ['full_name', 'roll_number'],
          include: [{ model: Department, attributes: ['name'] }],
        },
      ],
      order: [['semester', 'ASC']],
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/results/publish - Publish result
const publishResult = async (req, res) => {
  try {
    const { student_id, semester } = req.body;
    await Result.update({ is_published: true }, { where: { student_id, semester } });
    res.json({ success: true, message: 'Result published.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/results/marksheet/:student_id/:semester
const getMarksheet = async (req, res) => {
  try {
    const { student_id, semester } = req.params;

    const student = await Student.findByPk(student_id, {
      include: [{ model: Department, attributes: ['name', 'code'] }],
    });

    const marks = await Mark.findAll({
      where: { student_id, semester },
      include: [{ model: Subject, attributes: ['subject_name', 'subject_code', 'credits'] }],
    });

    const result = await Result.findOne({ where: { student_id, semester } });

    if (!student || !result) {
      return res.status(404).json({ success: false, message: 'Marksheet not found.' });
    }

    res.json({ success: true, data: { student, marks, result } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/results/summary - Dashboard stats
const getResultSummary = async (req, res) => {
  try {
    const { semester } = req.query;
    const where = semester ? { semester } : {};

    const total = await Result.count({ where });
    const passed = await Result.count({ where: { ...where, status: 'pass' } });
    const failed = await Result.count({ where: { ...where, status: 'fail' } });

    res.json({
      success: true,
      data: {
        total,
        passed,
        failed,
        pass_percentage: total > 0 ? parseFloat(((passed / total) * 100).toFixed(2)) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/results/rank-list/:semester
const getRankList = async (req, res) => {
  try {
    const { semester } = req.params;

    const results = await Result.findAll({
      where: { semester, is_published: true },
      include: [{ model: Student, attributes: ['full_name', 'roll_number'] }],
      order: [['percentage', 'DESC']],
    });

    const ranked = results.map((r, idx) => ({ rank: idx + 1, ...r.toJSON() }));
    res.json({ success: true, data: ranked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateResult, getResults, publishResult, getMarksheet, getResultSummary, getRankList };
