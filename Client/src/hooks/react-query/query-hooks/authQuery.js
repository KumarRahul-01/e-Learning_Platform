import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../GlobalHooks";
import { signup } from "../../../Api/functions/userSignUp";
import { USERS } from "../query-keys/QueryKeys";
import { signin } from "../../../Api/functions/userSignIn";
import { toast } from "react-toastify";
import {
  profile,
  resetPassword,
  resetPasswordLink,
} from "../../../Api/functions/profile";

export const useUserSignUpMutation = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      if (data.success === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [USERS] });
        // setTimeout(() => navigate("/otpverify"), 1000);
      } else {
        toast.error(data.message || "Signup failed");
        setTimeout(() => navigate("/signup"), 1000);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Signup error");
    },
  });
};

export const useUserSignInMutation = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      const { success, message, token, user } = response || {};
      if (success === true) {
        toast.success(message);
        localStorage.setItem("token", token);
        localStorage.setItem("name", user?.name || "");
        localStorage.setItem("message", message);
        queryClient.invalidateQueries({ queryKey: [USERS] });
        navigate("/courses"); // This redirects to the courses page
      } else {
        toast.error(message || "Sign in failed");
        setTimeout(() => navigate("/signin"), 1000);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Sign in error");
    },
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: [USERS],
    queryFn: profile,
  });
};

export const useSendResetLink = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: (email) => resetPasswordLink(email),
    onSuccess: (response) => {
      const { success, message } = response || {};
      if (success === true) {
        toast.success(message || "Reset link sent successfully.");
        queryClient.invalidateQueries({ queryKey: [USERS] });
        // navigate("/signin");
      } else {
        toast.error(message || "Link sending failed.");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error sending reset link");
    },
  });
};

export const useResetPassword = () => {
  const { navigate } = useGlobalHooks();

  return useMutation({
    mutationFn: ({ token, password, confirmPassword }) =>
      resetPassword({ token, password, confirmPassword }),
    onSuccess: (response) => {
      const { success, message } = response || {};
      if (success === true) {
        toast.success(message || "Password reset successful.");
        navigate("/signin");
      } else {
        toast.error(message || "Password reset failed.");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    },
  });
};

export const useLogout = () => {
  const { queryClient, navigate } = useGlobalHooks();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("message");

    queryClient.invalidateQueries({ queryKey: [USERS] });
    toast.success("Logout Successful!");
    navigate("/signin");
  };
};
