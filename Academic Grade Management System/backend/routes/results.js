const express = require('express');
const router = express.Router();
const { generateResult, getResults, publishResult, getMarksheet, getResultSummary, getRankList } = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getResults);
router.get('/summary', getResultSummary);
router.get('/rank-list/:semester', getRankList);
router.get('/marksheet/:student_id/:semester', getMarksheet);
router.post('/generate', authorize('super_admin', 'admin'), generateResult);
router.post('/publish', authorize('super_admin', 'admin'), publishResult);

module.exports = router;
