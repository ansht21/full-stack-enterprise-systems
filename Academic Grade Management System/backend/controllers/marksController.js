const { Mark, Student, Subject, Result } = require('../models');
const { calculateGrade, calculateSGPA } = require('../utils/gradeCalculator');

// GET /api/marks?student_id=&semester=
const getMarks = async (req, res) => {
  try {
    const { student_id, semester, subject_id } = req.query;
    const where = {};
    if (student_id) where.student_id = student_id;
    if (semester) where.semester = semester;
    if (subject_id) where.subject_id = subject_id;

    const marks = await Mark.findAll({
      where,
      include: [
        { model: Student, attributes: ['full_name', 'roll_number'] },
        { model: Subject, attributes: ['subject_name', 'subject_code', 'credits'] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/marks - Enter or update marks
const enterMarks = async (req, res) => {
  try {
    const { student_id, subject_id, semester, internal_marks, practical_marks, theory_marks } = req.body;

    // Check if locked
    const existing = await Mark.findOne({ where: { student_id, subject_id, semester } });
    if (existing && existing.is_locked) {
      return res.status(400).json({ success: false, message: 'Marks are locked and cannot be edited.' });
    }

    const total = parseFloat(internal_marks || 0) + parseFloat(practical_marks || 0) + parseFloat(theory_marks || 0);
    const { grade } = calculateGrade(total);

    const markData = {
      student_id, subject_id, semester,
      internal_marks, practical_marks, theory_marks,
      total_marks: total, grade,
      entered_by: req.user.id,
    };

    let mark;
    if (existing) {
      await existing.update(markData);
      mark = existing;
    } else {
      mark = await Mark.create(markData);
    }

    res.json({ success: true, message: 'Marks saved successfully.', data: mark });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/marks/bulk - Enter marks for multiple students
const enterBulkMarks = async (req, res) => {
  try {
    const { marksArray } = req.body; // [{ student_id, subject_id, semester, internal_marks, practical_marks, theory_marks }]
    const results = [];

    for (const entry of marksArray) {
      const total = parseFloat(entry.internal_marks || 0) + parseFloat(entry.practical_marks || 0) + parseFloat(entry.theory_marks || 0);
      const { grade } = calculateGrade(total);
      const markData = { ...entry, total_marks: total, grade, entered_by: req.user.id };

      const [mark] = await Mark.upsert(markData);
      results.push(mark);
    }

    res.json({ success: true, message: `${results.length} marks saved.`, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/marks/lock - Lock marks for a semester
const lockMarks = async (req, res) => {
  try {
    const { student_id, semester } = req.body;
    await Mark.update({ is_locked: true }, { where: { student_id, semester } });
    res.json({ success: true, message: 'Marks locked successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMarks, enterMarks, enterBulkMarks, lockMarks };
