import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

// Get all quizzes for a course
export const getQuizzesByCourseId = async (courseId) => {
  try {
    const { data } = await axiosInstance.get(
      endPoints.quiz.getQuizByCourseId(courseId)
    );
    console.log("from axios", data);
    return data.data || []; // Return array even if empty
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // No quizzes found
    }
    throw error;
  }
};

export const getAllQuizzes = async () => {
  const { data } = await axiosInstance.get(endPoints.quiz.getAllQuizzes);
  return data;
};

export const getQuizById = async (quizId) => {
  try {
    const { data } = await axiosInstance.get(endPoints.quiz.getQuizById(quizId));
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Quiz not found
    }
    throw error;
  }
};

export const submitQuizByCourseId = async (courseId, quizId, answers) => {
  try {
    const { data } = await axiosInstance.post(
      endPoints.quiz.submitQuiz(courseId), // ✅ FIXED
      { quizId, answers }                  // ✅ send quizId in body
    );
    return data;
  } catch (error) {
    throw error;
  }
};

