const { Student, Faculty, Subject, Result, Mark } = require('../models');

// GET /api/dashboard/admin
const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalFaculty = await Faculty.count();
    const totalSubjects = await Subject.count();
    const totalResults = await Result.count({ where: { is_published: true } });
    const passedResults = await Result.count({ where: { status: 'pass', is_published: true } });

    res.json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalSubjects,
        totalResults,
        passPercentage: totalResults > 0
          ? parseFloat(((passedResults / totalResults) * 100).toFixed(2))
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/student/:student_id
const getStudentDashboard = async (req, res) => {
  try {
    const { student_id } = req.params;

    const results = await Result.findAll({
      where: { student_id, is_published: true },
      order: [['semester', 'ASC']],
    });

    const latestResult = results[results.length - 1] || null;

    res.json({
      success: true,
      data: {
        results,
        cgpa: latestResult?.cgpa || 0,
        totalSemesters: results.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdminDashboard, getStudentDashboard };
