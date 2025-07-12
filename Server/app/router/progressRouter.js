const express = require('express');
const progressController = require('../controller/progressController');
const { AuthCheck } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/complete-lesson',AuthCheck, progressController.markLessonComplete);
router.post('/save-quiz-score',AuthCheck, progressController.saveQuizScore);
router.get('/:userId/:courseId', AuthCheck,progressController.getProgress);

module.exports = router;
