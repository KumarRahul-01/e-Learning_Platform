import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const markLessonComplete = async ({ courseId, lessonId, complete = true }) => {
  try {
    console.log("Attempting to update lesson completion:", { courseId, lessonId, complete });
    console.log("Endpoint:", endPoints.progress.markLessonComplete);
    
    const { data } = await axiosInstance.post(
      endPoints.progress.markLessonComplete, 
      {
        courseId,
        lessonId,
        complete,
      }
    );
    
    console.log("Success response:", data);
    return data;
  } catch (error) {
    console.error("markLessonComplete error:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    console.error("Request config:", error.config);
    
    // Re-throw with more context
    throw new Error(`Failed to mark lesson complete: ${error.response?.data?.message || error.message}`);
  }
};
