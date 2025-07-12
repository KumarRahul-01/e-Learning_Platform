const Lesson = require('../model/lesson');
const Course = require('../model/course');

class LessonController {
  // ✅ 1. Create a new lesson
  static async createLesson(req, res) {
    try {
      const { courseId, title, videoUrl, duration } = req.body;

      if (!courseId || !title || !videoUrl || !duration) {
        return res.status(400).json({
          success: false,
          message: 'All fields (courseId, title, videoUrl, duration) are required'
        });
      }
       // Check if course exists
      const existingCourse = await Course.findById(courseId);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: 'Course not found. Cannot create lesson for non-existing course.'
        });
      }

      const lesson = new Lesson({ courseId, title, videoUrl, duration });
      const savedLesson = await lesson.save();

      // Add lesson to the course's lessons array (assuming course has lessons field)
      await Course.findByIdAndUpdate(
        courseId,
        { $push: { lessons: savedLesson._id } },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        data: savedLesson
      });
    } catch (error) {
      console.error('Error creating lesson:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // ✅ 2. Get all lessons
  static async getAllLessons(req, res) {
    try {
      const lessons = await Lesson.find().populate('courseId', 'title');

      return res.status(200).json({
        success: true,
        message: 'Lessons fetched successfully',
        total: lessons.length,
        data: lessons
      });
    } catch (error) {
      console.error('Error fetching lessons:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // ✅ 3. Get lesson by ID
  static async getLessonById(req, res) {
    try {
      const { id } = req.params;
      const lesson = await Lesson.findById(id).populate('courseId', 'title');

      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: 'Lesson not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Lesson retrieved successfully',
        data: lesson
      });
    } catch (error) {
      console.error('Error fetching lesson:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };
  // ✅ 4. Get lessons by course ID
  static async getLessonsByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      const lessons = await Lesson.find({ courseId }).populate('courseId', 'title');
      if (lessons.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No lessons found for this course'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Lessons retrieved successfully',
        total: lessons.length,
        data: lessons
      });
    } catch (error) {
      console.error('Error fetching lessons by course ID:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
}

// mark as completed


module.exports = LessonController;
