import { useMutation, useQuery } from "@tanstack/react-query";
import { COURSES, QUIZZES } from "../query-keys/QueryKeys";
import {
  getAllQuizzes,
  
  getQuizById,
  getQuizzesByCourseId,
  submitQuizByCourseId,
  
} from "../../../Api/functions/quiz"; // <-- import getQuizById

// Get all quizzes for a course
export const useQuizzesByCourseId = (courseId) => {
  return useQuery({
    queryKey: [QUIZZES, COURSES, courseId],
    queryFn: () => getQuizzesByCourseId(courseId),
    enabled: !!courseId,
  });
};

export const useAllQuizzes = () =>
  useQuery({
    queryKey: [QUIZZES],
    queryFn: () => getAllQuizzes(),
  });

// Add this hook for fetching quiz by quizId
export const useQuizById = (quizId) =>
  useQuery({
    queryKey: [QUIZZES, "byId", quizId],
    queryFn: () => getQuizById(quizId),
    enabled: !!quizId,
  });

  // Custom hook for submitting a quiz
export const useQuizSubmit = () => {
  return useMutation({
    mutationFn: ({ courseId, quizId, answers }) =>
      submitQuizByCourseId(courseId, quizId, answers),

    onSuccess: (data) => {
      console.log("✅ Quiz Submitted Successfully!");
      console.log("Result:");
      console.log("Total Questions:", data.totalQuestions);
      console.log("Correct Answers:", data.correctAnswers);
      console.log("Incorrect Answers:", data.incorrectAnswer);
      console.log("Score Percentage:", data.scorePercentage);
    },

    onError: (error) => {
      console.error("❌ Error submitting quiz:", error?.response?.data?.message || error.message);
    },
  });
};
