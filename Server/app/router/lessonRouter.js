const express=require("express");
const LessonController = require("../controller/lessonController");
const { isAdmin, AuthCheck } = require("../middleware/authMiddleware");

const router=express.Router();


router.post('/add-lesson',AuthCheck,isAdmin,LessonController.createLesson);
router.get('/get-lessons',AuthCheck,LessonController.getAllLessons);
router.get('/get-lesson/:id',AuthCheck,LessonController.getLessonById);
router.get('/get-lessons-by-course/:courseId',AuthCheck,LessonController.getLessonsByCourseId);

module.exports=router;