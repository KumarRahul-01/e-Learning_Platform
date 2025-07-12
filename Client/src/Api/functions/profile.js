import { axiosInstance } from "../axiosInstance/axiosInstance";
import { endPoints } from "../endPoints/endPoint";

export const profile = async () => {
  try {
    const { data } = await axiosInstance.get(endPoints.user.profile);
    console.log("from axios", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPasswordLink = async (email) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.sendResetLink, {
      email,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  try {
    const { data } = await axiosInstance.post(endPoints.user.resetpass(token), {
      password,
      confirmPassword,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
