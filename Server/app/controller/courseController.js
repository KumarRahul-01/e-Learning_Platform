const Course = require("../model/course");

class CourseController {
  // Create a new course
  async createCourse(req, res) {
    try {
      const { title, category, description, lessons, quizzes } = req.body;

      if (!title || !category) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Title and category are required.",
          });
      }

      const CourseData = new Course({
        title,
        category,
        description,
        lessons,
        quizzes,
      });
      const savedCourse = await CourseData.save();

      return res.status(201).json({
        success: true,
        message: "Course created successfully.",
        data: savedCourse,
      });
    } catch (err) {
      console.error("Error creating course:", err.message);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  // Get all courses
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find()  //.populate("lessons quizzes");
      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully.",
        total: courses.length,
        data: courses,
      });
    } catch (err) {
      console.error("Error fetching courses:", err.message);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  // Get course by ID
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findById(id).populate("lessons quizzes");

      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Course details fetched successfully.",
        data: course,
      });
    } catch (err) {
      console.error("Error fetching course:", err.message);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
}

module.exports = new CourseController();
