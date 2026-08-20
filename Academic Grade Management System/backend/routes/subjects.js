const express = require('express');
const router = express.Router();
const { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', authorize('super_admin', 'admin'), createSubject);
router.put('/:id', authorize('super_admin', 'admin'), updateSubject);
router.delete('/:id', authorize('super_admin', 'admin'), deleteSubject);

module.exports = router;
