import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const getAllLesson = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.lesson.getAllLessons);
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getLessonById = async (lessonId) => {
  try {
    const { data } = await axiosInstance.get(
      endPoints.lesson.getLessonById(lessonId)
    );
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getLessonsByCourseId = async (courseId) => {
  try {
    const { data } = await axiosInstance.get(
      endPoints.lesson.getLessonsByCourseId(courseId)
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
