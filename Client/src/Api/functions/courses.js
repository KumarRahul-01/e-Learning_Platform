import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const getAllcourses = async () => {
  try {
    const {data} = await axiosInstance.get(endPoints.courses.getAllCourses);
    console.log("from axios",data)
    return data
  } catch (error) {
    console.log(error);
  }
};

export const getCourseById = async (courseId) => {
  try {
    const {data} = await axiosInstance.get(endPoints.courses.getCourseById(courseId));
    console.log("from axios",data)
    return data
  } catch (error) {
    console.log(error);
  }
};
