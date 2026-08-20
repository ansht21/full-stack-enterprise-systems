const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', authorize('super_admin', 'admin'), createStudent);
router.put('/:id', authorize('super_admin', 'admin'), updateStudent);
router.delete('/:id', authorize('super_admin', 'admin'), deleteStudent);

module.exports = router;
