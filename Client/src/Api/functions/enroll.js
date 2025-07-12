import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const enroll = async (input) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.enrollCourse, input);
    return data;
  } catch (error) {
    console.error("enrollCourse error:", error.response?.data || error.message); 
    throw error;
  }
};

export const removeEnrollCourse = async (courseId) => {
  try {
    const { data } = await axiosInstance.delete(endPoints.user.removeEnroll, {
      data: { courseId },
    });
    return data;
  } catch (error) {
    console.error("removeEnrollCourse error:", error.response?.data || error.message);
    throw error;
  }
};