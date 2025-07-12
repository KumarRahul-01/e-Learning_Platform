const express = require("express");
const QuizController = require("../controller/quizController");
const { AuthCheck, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", AuthCheck, isAdmin, QuizController.createQuiz); // Create a quiz
router.get("/get-all-quizzes", AuthCheck, QuizController.getAllQuizzes); // Fetch all quizzes
router.get("/:quizId", AuthCheck, QuizController.getQuizById); // Fetch quiz by ID
router.get("/course/:courseId", AuthCheck, QuizController.getQuizByCourseId); // Fetch quiz by course
router.post("/:courseId/submit", AuthCheck, QuizController.submitQuiz); // Submit quiz answers


module.exports = router;
