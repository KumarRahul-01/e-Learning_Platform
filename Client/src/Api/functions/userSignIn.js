import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const signin = async (input) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.login, input);
    return data;
  } catch (error) {
    console.error("Signin error:", error.response?.data || error.message); 
    throw error;
  }
};