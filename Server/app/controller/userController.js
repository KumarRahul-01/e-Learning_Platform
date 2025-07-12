const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Course = require("../model/course");
const Progress = require("../model/progress");
const Lesson = require("../model/lesson");
const Quiz = require("../model/quiz");
const transporter = require("../config/emailConfig"); // Assuming you have a configured transporter for sending emails

class UserController {
  // ✅ Register
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "student",
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      console.error("Register error:", err.message);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }

  // ✅ Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful.",

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }

  // ✅ 3. Enroll in a course
  async enrollCourse(req, res) {
    try {
      const { courseId } = req.body;
      const userId = req.user._id; // req.user is now the full user from middleware

      // Validate course
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      // Double-check user from DB (optional since middleware already fetched it)
      const user = await User.findById(userId);

      // Check if already enrolled
      if (user.enrolledCourses.includes(courseId)) {
        return res
          .status(400)
          .json({ success: false, message: "Already enrolled in this course" });
      }

      // Enroll the course
      user.enrolledCourses.push(courseId);
      await user.save();

      // Create progress entry
      const progress = new Progress({
        userId,
        courseId,
        lessonsCompleted: [],
        quizScores: [],
      });
      await progress.save();

      user.progress.push(progress._id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Enrolled in course successfully",
        data: {
          userId: user._id,
          courseId,
          progressId: progress._id,
        },
      });
    } catch (err) {
      console.error("Enroll error:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ✅ 4. Remove enrolled courses
  async removeEnrolledCourse(req, res) {
    try {
      const { courseId } = req.body;
      const userId = req.user._id;

      // Validate course
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      // Find user and check if enrolled
      const user = await User.findById(userId);
      if (!user.enrolledCourses.includes(courseId)) {
        return res
          .status(400)
          .json({ success: false, message: "Not enrolled in this course" });
      }

      // Remove course from enrolled courses
      user.enrolledCourses.pull(courseId);
      await user.save();

      // Remove progress entry
      const progress = await Progress.findOneAndDelete({
        userId,
        courseId,
      });

      if (progress) {
        user.progress.pull(progress._id);
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: "Course removed successfully",
        data: { userId, courseId },
      });
    } catch (err) {
      console.error("Remove course error:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ✅ 4. Get user profile with enrolled courses and progress
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .select("-password")
        .populate({
          path: "enrolledCourses",
          select: "title category description",
        })
        .populate({
          path: "progress",
          populate: [
            { path: "courseId", select: "title category" },
            { path: "lessonsCompleted", select: "title videoUrl duration" },
            { path: "quizScores.quizId", select: "questions" },
          ],
        });

      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
      });
    } catch (err) {
      console.error("Profile fetch error:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ✅ 5. Mark lesson complete (updates Progress)

  async completeLesson(req, res) {
    try {
      const { courseId, lessonId } = req.body;
      const userId = req.user._id;

      // Validate that the lesson exists and belongs to the course
      const lesson = await Lesson.findOne({ _id: lessonId, courseId });
      if (!lesson) {
        return res
          .status(404)
          .json({ success: false, message: "Lesson not found in this course" });
      }

      const progress = await Progress.findOne({ userId, courseId });

      if (!progress) {
        return res.status(404).json({
          success: false,
          message: "Progress not found. Please enroll in the course first.",
        });
      }

      if (!progress.lessonsCompleted.includes(lessonId)) {
        progress.lessonsCompleted.push(lessonId);
        await progress.save();
      }

      // Return populated progress to see the lesson details
      const updatedProgress = await Progress.findById(progress._id)
        .populate("lessonsCompleted", "_id title videoUrl duration")
        .populate("courseId", "title");

      return res.status(200).json({
        success: true,
        message: "Lesson marked as completed",
        data: updatedProgress,
      });
    } catch (err) {
      console.error("Lesson completion error:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // forget password

  async resetPasswordLink(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email is required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
      const resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const resetLink = `${process.env.FRONT_END_HOST}/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Link",
        html: `Click <a href="${resetLink}">here</a> to reset your password.`,
      };
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email.",
      });
    } catch (err) {
      console.error("Password reset link error:", err.message);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  }

  async resetPassword(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params; // Extract token from URL parameters

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Token, password, and confirm password are required.",
        });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Passwords do not match." });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired token." });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      user.password = await bcrypt.hash(password, 10);
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Password reset successfully." });
    } catch (err) {
      console.error("Reset password error:", err.message);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  }
}

module.exports = new UserController();
