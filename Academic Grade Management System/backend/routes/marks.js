const express = require('express');
const router = express.Router();
const { getMarks, enterMarks, enterBulkMarks, lockMarks } = require('../controllers/marksController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getMarks);
router.post('/', authorize('super_admin', 'admin', 'faculty'), enterMarks);
router.post('/bulk', authorize('super_admin', 'admin', 'faculty'), enterBulkMarks);
router.post('/lock', authorize('super_admin', 'admin'), lockMarks);

module.exports = router;
