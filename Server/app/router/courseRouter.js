const express = require('express');
const courseController = require('../controller/courseController');
const { isAdmin, AuthCheck } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/add-course',AuthCheck,isAdmin, courseController.createCourse);
router.get('/all-courses',AuthCheck, courseController.getAllCourses);
router.get('/:id',AuthCheck, courseController.getCourseById);

module.exports = router;
