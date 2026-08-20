const express = require('express');
const router = express.Router();
const { getAllFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);
router.post('/', authorize('super_admin', 'admin'), createFaculty);
router.put('/:id', authorize('super_admin', 'admin'), updateFaculty);
router.delete('/:id', authorize('super_admin', 'admin'), deleteFaculty);

module.exports = router;
