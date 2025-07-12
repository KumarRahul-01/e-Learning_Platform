import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import { PROGRESS } from "../query-keys/QueryKeys";
import { markLessonComplete } from "../../../Api/functions/progress";

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload) => {
      console.log("Marking lesson complete with payload:", payload); // Debug log
      return markLessonComplete(payload);
    },
    onSuccess: (data) => {
      console.log("Success response:", data); // Debug log
      if (data.success) {
        toast.success(data.message || "Lesson marked complete");
        // Invalidate and refetch progress queries
        queryClient.invalidateQueries({ queryKey: [PROGRESS] });
      } else {
        toast.error(data.message || "Failed to mark lesson complete");
      }
    },
    onError: (err) => {
      console.error("Mutation error:", err); // Debug log
      console.error("Error response:", err?.response?.data); // Debug log
      toast.error(
        err?.response?.data?.message || 
        err?.message || 
        "Server error occurred while marking lesson complete"
      );
    },
  });
};
