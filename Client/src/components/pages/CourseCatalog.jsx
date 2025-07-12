// src/pages/CourseCatalog.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useCourses } from "../../hooks/react-query/query-hooks/coursesQuery";
// import CourseCard from "../common/CourseCard";

const CourseCatalog = () => {
  const { data, isLoading, error } = useCourses();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const filteredCourses = (data?.data || []).filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? course.category === category : true;
    const matchesLevel = level ? course.level === level : true;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get unique categories from the courses data
  const categories = [...new Set((data?.data || []).map(course => course.category))];

  return (
    <Box sx={{ px: 4, py: 6, maxWidth: '1400px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Browse Courses
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              value={level}
              label="Level"
              onChange={(e) => setLevel(e.target.value)}
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Results Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Loading State */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Box textAlign="center" py={8}>
          <Typography color="error" variant="h6">
            Error loading courses
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Please try again later
          </Typography>
          </Box>
      ) : filteredCourses.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No courses found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        /* Courses Grid */
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CourseCatalog;
