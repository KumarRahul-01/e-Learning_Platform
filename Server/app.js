const express = require("express");
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./app/config/db");

const cors = require("cors");

const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();
// Load Swagger YAML
const swaggerDocument = yaml.load(fs.readFileSync('./Docs/swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);
app.use(flash());
app.use(cookieParser());
app.use(
  express.json({
    limit: "50mb",
    extended: true,
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(express.json());

//setting up template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app;

app.use(express.static(path.join(__dirname, "public")));
app.use("uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.redirect("/admin");
});
// Home route
// app.get("/", async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalCourses = await Course.countDocuments();
//     res.render('home', {
//       user: req.user || null,
//       totalUsers,
//       totalCourses,
//       // currentPage: 'home', // to highlight the active page in the navbar
//     });
//   } catch (err) {
//     res.render('home', {
//       user: req.user || null,
//       totalUsers: 0,
//       totalCourses: 0,
//     });
//   }
// });
const adminRoutes = require("./app/router/adminRouter");
app.use("/admin", adminRoutes);

const userRouter = require("./app/router/userRouter");
app.use("/user", userRouter);

const courseRouter = require("./app/router/courseRouter");
app.use("/course", courseRouter);

const lessonRouter = require("./app/router/lessonRouter");
app.use("/lesson", lessonRouter);

const quizRoutes = require("./app/router/quizRouter");
app.use("/quizzes", quizRoutes);

const progressRouter = require("./app/router/progressRouter");
const { cursorTo } = require("readline");
app.use("/progress", progressRouter);

// app.get("/", (req, res) => {
//   res.send("e-Learning Platform");
// });

const PORT = 7007;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
