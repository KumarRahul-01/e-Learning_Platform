const Quiz = require("../model/quiz");
const Course = require("../model/course");
const mongoose = require("mongoose");

class QuizController {
  // ✅ 1. Create a quiz
  async createQuiz(req, res) {
    try {
      const { courseId, questions } = req.body;

      if (!courseId || !questions || !Array.isArray(questions)) {
        return res.status(400).json({
          success: false,
          message: "Course ID and questions are required.",
        });
      }
      // Check if course exists
      const existingCourse = await Course.findById(courseId);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message:
            "Course not found. Cannot create quiz for non-existing course.",
        });
      }

      const quiz = new Quiz({ courseId, questions });
      const savedQuiz = await quiz.save();
      // Add quiz to the course's quiz field (assuming course has quiz field)
      await Course.findByIdAndUpdate(
        courseId,
        { $push: { quizzes: savedQuiz._id } },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        message: "Quiz created successfully.",
        data: savedQuiz,
      });
    } catch (error) {
      console.error("Error creating quiz:", error.message);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  }

  // get all quizzes
  async getAllQuizzes(req, res) {
    try {
      const quizzes = await Quiz.find();
      return res.status(200).json({
        success: true,
        message: "Quizzes fetched successfully.",
        totalQuizzes: quizzes.length,
        data: quizzes.map((quiz) => ({
          _id: quiz._id,
          courseId: quiz.courseId,
          questions: quiz.questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
          })),
        })),
      });
    } catch (error) {
      console.error("Error fetching quizzes:", error.message);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  }

  // ✅ 2. Get quiz by course ID
  async getQuizByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      const quizzes = await Quiz.find({ courseId }).populate(
        "courseId",
        "title"
      );

      if (!quizzes.length) {
        return res.status(404).json({
          success: false,
          message: "No quizzes found for this course",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Quizzes retrieved successfully",
        total: quizzes.length,
        data: quizzes, // Returns an array of quizzes
      });
    } catch (error) {
      console.error("Error fetching quizzes:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  // ✅ 3. Submit quiz answers
  async submitQuiz(req, res) {
    try {
      const { courseId } = req.params;
      const { answers } = req.body; // answers = [1, 0, 2, ...]

      const quiz = await Quiz.findOne({ courseId });

      if (!quiz) {
        return res
          .status(404)
          .json({ success: false, message: "Quiz not found." });
      }

      if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
        return res.status(400).json({
          success: false,
          message: "Answers are incomplete or invalid.",
        });
      }

      let correctAnswers = 0;
      let incorrectAnswers = 0;
      const results = [];

      quiz.questions.forEach((q, index) => {
        const userAnswer = Number(answers[index]);
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
        results.push({
          questionText: q.questionText,
          options: q.options,
          userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
        });
      });

      return res.status(200).json({
        success: true,
        message: "Quiz submitted successfully.",
        totalQuestions: quiz.questions.length,
        correctAnswers,
        incorrectAnswers,
        scorePercentage: Math.round(
          (correctAnswers / quiz.questions.length) * 100
        ),
        results, // Array with per-question feedback
      });
    } catch (error) {
      console.error("Error submitting quiz:", error.message);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  }

  // ✅ 4. Get quiz by quiz ID
  async getQuizById(req, res) {
    try {
      const { quizId } = req.params;

      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        return res
          .status(404)
          .json({ success: false, message: "Quiz not found." });
      }

      // Exclude correctAnswer when sending to client
      const quizToSend = {
        _id: quiz._id,
        courseId: quiz.courseId,
        questions: quiz.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
        })),
      };

      return res.status(200).json({
        success: true,
        message: "Quiz fetched successfully.",
        data: quizToSend,
      });
    } catch (error) {
      console.error("Error fetching quiz by ID:", error.message);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  }
}

module.exports = new QuizController();
