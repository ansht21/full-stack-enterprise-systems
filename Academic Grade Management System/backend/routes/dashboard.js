const express = require('express');
const router = express.Router();
const { getAdminDashboard, getStudentDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/admin', authorize('super_admin', 'admin', 'faculty'), getAdminDashboard);
router.get('/student/:student_id', getStudentDashboard);

module.exports = router;
