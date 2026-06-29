const Progress = require('../model/progress');
const User = require('../model/user');
class ProgressController {
  // ✅ 1. Mark lesson as completed
  // controllers/progressController.js

 async markLessonComplete(req, res) {
  try {
    const userId = req.user._id; // from auth middleware
    const { courseId, lessonId, complete = true } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Lesson ID are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        lessonsCompleted: [],
        quizScores: [],
      });
    }

    const lessonAlreadyCompleted = progress.lessonsCompleted.some(
      (id) => id.toString() === lessonId
    );

    if (complete && !lessonAlreadyCompleted) {
      progress.lessonsCompleted.push(lessonId);
    }

    if (!complete && lessonAlreadyCompleted) {
      progress.lessonsCompleted.pull(lessonId);
    }

    await progress.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { progress: progress._id },
    });

    return res.status(200).json({
      success: true,
      message: complete
        ? "Lesson marked as complete."
        : "Lesson marked as incomplete.",
      progress,
    });
  } catch (err) {
    console.error("Error marking lesson complete:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}



  // ✅ 2. Save quiz score
  async saveQuizScore(req, res) {
    try {
      const userId = req.user._id;
      const { courseId, quizId, score } = req.body;

      if (!courseId || !quizId || score == null) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
      }

      let progress = await Progress.findOne({ userId, courseId });

      if (!progress) {
        progress = new Progress({
          userId,
          courseId,
          lessonsCompleted: [],
          quizScores: [{ quizId, score }]
        });
      } else {
        const existing = progress.quizScores.find(q => q.quizId.toString() === quizId);
        if (existing) {
          existing.score = score; // update score
          existing.date = new Date();
        } else {
          progress.quizScores.push({ quizId, score, date: new Date() });
        }
      }

      await progress.save();

      await User.findByIdAndUpdate(userId, {
        $addToSet: { progress: progress._id },
      });

      return res.status(200).json({
        success: true,
        message: 'Quiz score saved.',
        data: progress
      });
    } catch (err) {
      console.error('Error saving quiz score:', err.message);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  }

  // ✅ 3. Get progress by user and course
   async getProgress(req, res) {
    try {
      const { userId, courseId } = req.params;

      const progress = await Progress.findOne({ userId, courseId })
        .populate('lessonsCompleted', 'title')
        .populate('quizScores.quizId', 'questions');

      if (!progress) {
        return res.status(404).json({ success: false, message: 'Progress not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Progress fetched successfully.',
        total: progress.lessonsCompleted.length + progress.quizScores.length,
        data: progress
      });
    } catch (err) {
      console.error('Error fetching progress:', err.message);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
}

module.exports = new ProgressController();
