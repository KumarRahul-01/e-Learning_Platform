const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { requireAdminLogin } = require('../middleware/adminAuth');


router.get('/register', adminController.getRegister);
router.post('/register', adminController.postRegister);

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);

router.get('/createCourse', requireAdminLogin, adminController.getCreateCourse);
router.post('/create-course', requireAdminLogin, adminController.postCreateCourse);
router.get('/courses', requireAdminLogin, adminController.getAllCourses);


router.get('/edit-course/:id', requireAdminLogin, adminController.getEditCourse);
router.post('/edit-course/:id', requireAdminLogin, adminController.postEditCourse);


router.get('/create-lesson', requireAdminLogin, adminController.getCreateLesson);
router.post('/create-lesson', requireAdminLogin, adminController.postCreateLesson);

router.get('/create-quiz', requireAdminLogin, adminController.getCreateQuiz);
router.post('/create-quiz',requireAdminLogin, adminController.postCreateQuiz);

router.get('/', requireAdminLogin, adminController.getDashboard);
router.get('/logout',  adminController.logout);

module.exports = router;
