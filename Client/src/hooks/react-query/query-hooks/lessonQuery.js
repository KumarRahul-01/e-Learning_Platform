import { useQuery } from "@tanstack/react-query";
import {
  getAllLesson,
  getLessonsByCourseId,
} from "../../../Api/functions/lesson";
import { LESSONS } from "../query-keys/QueryKeys";

// fetch all lessons
export const useLessons = () =>
  useQuery({
    queryKey: [LESSONS],
    queryFn: getAllLesson,
  });

// fetch lesson by ID
export const useLessonById = (id) =>
  useQuery({
    queryKey: [LESSONS, id],
    queryFn: () => getAllLesson(id),
    enabled: !!id,
  });

// fetch lessons by course ID
export const useLessonsByCourseId = (courseId) =>
  useQuery({
    queryKey: [LESSONS, courseId],
    queryFn: () => getLessonsByCourseId(courseId),
    enabled: !!courseId,
  });
