import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/layout/Root.jsx";
import UserSignUp from "./components/pages/Auth/UserSignUp.jsx";
import UserSignIn from "./components/pages/Auth/UserSignIn.jsx";

import HomePage from "./components/pages/HomePage.jsx";

import { AuthRouter } from "./middleware/AuthRouter.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/pages/Auth/Profile.jsx";
import Courses from "./components/pages/Courses.jsx";
import CourseById from "./components/pages/CourseById.jsx";
import About from "./components/pages/About.jsx";
import "./App.css";
import Contact from "./components/pages/Contact.jsx";
import OurTeam from "./components/pages/OurTeam.jsx";
import Testimonial from "./components/pages/Testimonial.jsx";
import QuizPage from "./components/pages/QuizPage.jsx";
import ForgotPasswordLink from "./components/pages/Auth/ForgotPasswordLink.jsx";
import ResetPassword from "./components/pages/Auth/ResetPassword.jsx";
import CourseCatalog from "./components/pages/CourseCatalog.jsx";
import PlayQuiz from "./components/pages/PlayQuiz.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        
        element: <About />,
      },
      {
        path: "/contact",
        
        element: <Contact />,
      },
      {
        path: "/team",
        element: <OurTeam />,
      },
      {
        path: "/testimonial",
        element: <Testimonial />,
      },
      {
        path: "/signup",
        element: <UserSignUp />,
      },
      {
        path: "/signin",
        element: <UserSignIn />,
      },
      {
        path: "/reset-password-link",
        element: <ForgotPasswordLink />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },

      {
        element: <AuthRouter />,
        children: [
          {
            path: "/courses",
            element: <Courses />,
          },
          {
            path: "/courses/:id",
            element: <CourseById />,
          },
          {
            path: "/quiz",
            element: <QuizPage />,
          },
          {
            path: "/courses/:courseId/quiz/:quizId",
            element: <PlayQuiz />,
          },
          // {
          //   path: "/course-catalog",
          //   element: <CourseCatalog />,
          // },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
