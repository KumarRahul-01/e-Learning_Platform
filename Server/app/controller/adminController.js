const User = require("../model/user");
const Course = require("../model/course");
const Lesson = require("../model/lesson");
const Quiz = require("../model/quiz");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getRegister = (req, res) => {
  try {
    res.render("admin/register", { title: "register" });
  } catch (error) {
    console.log("Error in getLogin:", error.message);
  }
};

exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.send("Admin already exists.");

  const hashed = await bcrypt.hash(password, 10);
  const admin = await User.create({
    name,
    email,
    password: hashed,
    role: "admin",
  });
  req.flash("success", "Registration successful! Please login.");
  res.redirect("/admin/login");

  req.session.adminId = admin._id;
  // res.redirect("/admin/login");
};

exports.getLogin = (req, res) => {
  try {
    res.render("admin/login", {
      title: "Login",
      message: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (error) {
    console.log("Error in getLogin:", error.message);
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: "admin" });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    req.flash("error", "Invalid credentials");
    return res.redirect("/admin/login");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: admin._id, role: admin.role, name: admin.name },
    "your_jwt_secret", // Use a strong secret in production!
    { expiresIn: "1d" }
  );

  res.cookie("token", token, { httpOnly: true });

  req.flash("success", "Login successful!");
  res.redirect("/admin");
};

exports.getCreateCourse = (req, res) => {
  res.render("admin/createCourse", {
    user: req.user, // Pass the user object
    error: null,
    message: null,
  });
};

exports.postCreateCourse = async (req, res) => {
  const { title, category, description,price } = req.body;
  try {
    await Course.create({
      title,
      category,
      description,
      price,
      lessons: [],
      quizzes: [],
    });
    res.redirect("/admin");
  } catch (err) {
    console.error("Error creating course:", err.message);
    res.render("admin/createCourse", {
      error: "Failed to create course. Please try again.",
      message: null,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("lessons").populate("quizzes");
    res.render("admin/allCourses", {
      user: req.user,
      courses,
      
      title: "All Courses",
      error: null, // Always define error
    });
  } catch (err) {
    res.render("admin/allCourses", {
      user: req.user,
      courses: [],
      title: "All Courses",
      error: "Failed to load courses.",
    });
  }
};
exports.getEditCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      req.flash("error", "Course not found.");
      return res.redirect("/admin/courses");
    }
    res.render("admin/editCourse", {
      user: req.user,
      course,
      title: "Edit Course",
      message: null,
      error: null,
    });
  } catch (err) {
    console.error("Error fetching course:", err.message);
    req.flash("error", "Failed to fetch course.");
    res.redirect("/admin/courses");
  }
};

exports.postEditCourse = async (req, res) => {
  const courseId = req.params.id;
  const { title, category, description, price } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(
      courseId,
      { title, category, description, price },
      { new: true }
    );
    if (!course) {
      req.flash("error", "Course not found.");
      return res.redirect("/admin/courses");
    }
    req.flash("success", "Course updated successfully.");
    res.redirect("/admin/courses");
  } catch (err) {
    console.error("Error updating course:", err.message);
    req.flash("error", "Failed to update course.");
    res.redirect("/admin/courses");
  }
};
exports.getCreateLesson = async (req, res) => {
  const courses = await Course.find();
  res.render("admin/createLesson", { courses, error: null, message: null });
};

exports.postCreateLesson = async (req, res) => {
  try {
    const { courseId, title, videoUrl, duration } = req.body;

    const lesson = new Lesson({
      courseId,
      title,
      videoUrl,
      duration: `${duration} mins`,
    });

    await lesson.save();

    await Course.findByIdAndUpdate(courseId, {
      $push: { lessons: lesson._id },
    });

    res.redirect("/admin/courses");
  } catch (err) {
    console.error("Error creating lesson:", err.message);
    // Always fetch courses before rendering the page again
    const courses = await Course.find();
    res.render("admin/createLesson", {
      courses,
      error: "Lesson creation failed: " + err.message,
      message: null,
    });
  }
};

exports.getCreateQuiz = async (req, res) => {
  const courses = await Course.find();
  res.render("admin/createQuiz", {
    user: req.user,
    courses,
    error: null,
    message: null,
  });
};


exports.postCreateQuiz = async (req, res) => {
  const { courseId, title, questions } = req.body; // <-- include title
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }

    // Parse questions and validate
    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(questions);
    } catch (e) {
      return res.status(400).send("Invalid questions format");
    }

    // Create the quiz document
    const quiz = await Quiz.create({
      courseId,
      title, // <-- add title here
      questions: parsedQuestions,
    });

    // Push the quiz _id to the course's quizzes array
    course.quizzes.push(quiz._id);
    await course.save();

    res.redirect("/admin/courses");
  } catch (err) {
    console.error("Error creating quiz:", err.message);
    res.status(500).send("Quiz creation failed");
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    res.render("admin/dashboard", {
      user: req.user,
      totalUsers,
      totalCourses,
      title: "Dashboard",
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (err) {
    res.render("admin/dashboard", {
      user: req.user,
      totalUsers: 0,
      totalCourses: 0,
      title: "Dashboard",
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }
};

exports.logout = (req, res) => {
  req.flash("success", "Logged out successfully."); // Set flash first
  res.clearCookie("token");
  res.redirect("/admin/login");
  // req.session.destroy(() => {
  //   res.redirect("/admin/login");
  // });
};
