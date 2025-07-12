import { useQuery } from "@tanstack/react-query";

import { COURSES } from "../query-keys/QueryKeys";
import {  getAllcourses, getCourseById } from "../../../Api/functions/courses";
import { removeEnrollCourse } from "../../../Api/functions/enroll";

// Fetch all courses
export const useCourses = () =>
  useQuery({
    queryKey: [COURSES],
    queryFn: getAllcourses,
  });

// Fetch course by ID
export const useCourseById = (id) =>
  useQuery({
    queryKey: [COURSES, id],
    queryFn: ()=>getCourseById(id),
    enabled: !!id,
  });

  // enroll in a course
export const useEnrollCourse = (input) =>
  useQuery({
    queryKey: [COURSES, "enroll", input],
    queryFn: () => getCourseById(input),
    enabled: !!input,
  });

// remove from a course
export const useRemoveFromCourse = (courseId) =>
  useQuery({
    queryKey: [COURSES, "remove", courseId],
    queryFn: () => removeEnrollCourse(courseId),
    enabled: !!courseId,
  });


