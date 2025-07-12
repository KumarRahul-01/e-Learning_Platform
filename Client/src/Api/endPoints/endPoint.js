


export const baseURL = "http://localhost:7007";

export const endPoints = {
  user: {
    register: "/user/register",
    login: "/user/login",
    profile: "/user/profile",
    enrollCourse: "/user/enroll",
    completeLesson: "/user/complete-lesson",
    removeEnroll: `/user/remove-enrolled-course`,
    sendResetLink: "/user/reset-password-link",
    resetpass: (token) => `/user/reset-password/${token}`,
  },

  courses: {
    getAllCourses: "/course/all-courses",
    getCourseById: (courseId) => `/course/${courseId}`,
  },

  lesson: {
    getAllLessons: "/lesson/get-lesson",
    getLessonById: (lessonId) => `/lesson/get-lesson/${lessonId}`,
    getLessonsByCourseId: (courseId) =>
      `/lesson/get-lessons-by-course/${courseId}`,
  },

  quiz: {
    getQuizByCourseId: (courseId) => `/quizzes/course/${courseId}`,
    getAllQuizzes: "/quizzes/get-all-quizzes",
    getQuizById: (quizId) => `/quizzes/${quizId}`, // <-- Added endpoint
    submitQuiz: (courseId) => `/quizzes/${courseId}/submit`,
  },

  progress: {
    markLessonComplete: "/progress/complete-lesson",
    getProgress: (userId, courseId) => `/progress/${userId}/${courseId}`,
    QuizScore: "/progress/save-quiz-score",
  },
};
