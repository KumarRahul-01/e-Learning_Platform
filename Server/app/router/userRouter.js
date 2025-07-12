const express = require('express');
const userController = require('../controller/userController');
const {AuthCheck} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/reset-password-link',userController.resetPasswordLink);
router.post('/reset-password/:token',userController.resetPassword);

router.post('/enroll',AuthCheck,  userController.enrollCourse);

router.delete('/remove-enrolled-course',AuthCheck,  userController.removeEnrolledCourse);
router.get('/profile',AuthCheck,  userController.getProfile);
router.post('/complete-lesson',AuthCheck,  userController.completeLesson);

module.exports = router;
