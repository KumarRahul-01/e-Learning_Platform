import React, { useState, useEffect } from "react";
import { useCourses } from "../../hooks/react-query/query-hooks/coursesQuery";
import { enroll } from "../../Api/functions/enroll";
import {
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

const Courses = () => {
  const { data, isLoading, error } = useCourses();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Extract all unique categories from courses
  const categories = [
    "all",
    ...new Set(data?.data?.map((course) => course.category)),
  ].filter(Boolean);

  // Snackbar state for feedback
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter courses based on search term, category, and price range
  useEffect(() => {
    if (data?.data) {
      let results = data.data;

      // Apply search filter
      if (searchTerm) {
        results = results.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.instructor?.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      // Apply category filter
      if (selectedCategory !== "all") {
        results = results.filter(
          (course) => course.category === selectedCategory
        );
      }

      // Apply price filter
      if (priceRange !== "all") {
        switch (priceRange) {
          case "free":
            results = results.filter(
              (course) => course.price === 0 || !course.price
            );
            break;
          case "under1000":
            results = results.filter(
              (course) => course.price > 0 && course.price < 1000
            );
            break;
          case "1000-5000":
            results = results.filter(
              (course) => course.price >= 1000 && course.price <= 5000
            );
            break;
          case "over5000":
            results = results.filter((course) => course.price > 5000);
            break;
          default:
            break;
        }
      }

      setFilteredCourses(results);
    }
  }, [data, searchTerm, selectedCategory, priceRange]);

  // Enroll handler
  const handleEnroll = async (courseId) => {
    try {
      await enroll({ courseId });
      setSnackbar({
        open: true,
        message: "Enrolled successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Enrollment failed.",
        severity: "error",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange("all");
  };

  const coursesToDisplay =
    searchTerm || selectedCategory !== "all" || priceRange !== "all"
      ? filteredCourses
      : Array.isArray(data?.data)
      ? data.data
      : [];

  return (
    <div>
      {/* Header Start */}
      {/* <div className="container-fluid bg-primary py-5 mb-5 page-header">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Courses
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a className="text-white" href="#">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a className="text-white" href="#">
                      Pages
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Courses
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div> */}
      {/* Header End */}

      {/* Categories Section */}

      <div className="container-xxl py-0 category">
        <div className="container">
          <div className="container-xxl py-5 category">
            <div className="container">
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h6 className="section-title bg-white text-center text-primary px-3">
                  Categories
                </h6>
                <h1 className="mb-5">Courses Categories</h1>
              </div>
              <div className="row g-3">
                <div className="col-lg-7 col-md-6">
                  <div className="row g-3">
                    <div
                      className="col-lg-12 col-md-12 wow zoomIn"
                      data-wow-delay="0.1s"
                    >
                      <a
                        className="position-relative d-block overflow-hidden"
                        href="#"
                      >
                        <img
                          className="img-fluid"
                          src="/img/cat-1.jpg"
                          alt=""
                        />
                        <div
                          className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                          style={{ margin: 1 }}
                        >
                          <h5 className="m-0">Web Design</h5>
                          <small className="text-primary">49 Courses</small>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-lg-6 col-md-12 wow zoomIn"
                      data-wow-delay="0.3s"
                    >
                      <a
                        className="position-relative d-block overflow-hidden"
                        href="#"
                      >
                        <img
                          className="img-fluid"
                          src="/img/cat-2.jpg"
                          alt=""
                        />
                        <div
                          className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                          style={{ margin: 1 }}
                        >
                          <h5 className="m-0">Graphic Design</h5>
                          <small className="text-primary">49 Courses</small>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-lg-6 col-md-12 wow zoomIn"
                      data-wow-delay="0.5s"
                    >
                      <a
                        className="position-relative d-block overflow-hidden"
                        href="#"
                      >
                        <img
                          className="img-fluid"
                          src="/img/cat-3.jpg"
                          alt=""
                        />
                        <div
                          className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                          style={{ margin: 1 }}
                        >
                          <h5 className="m-0">Video Editing</h5>
                          <small className="text-primary">49 Courses</small>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-5 col-md-6 wow zoomIn"
                  data-wow-delay="0.7s"
                  style={{ minHeight: 350 }}
                >
                  <a
                    className="position-relative d-block h-100 overflow-hidden"
                    href="#"
                  >
                    <img
                      className="img-fluid position-absolute w-100 h-100"
                      src="/img/cat-4.jpg"
                      alt=""
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                      style={{ margin: 1 }}
                    >
                      <h5 className="m-0">Online Marketing</h5>
                      <small className="text-primary">49 Courses</small>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container-xxl py-3">
        <div className="container">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
                {(searchTerm ||
                  selectedCategory !== "all" ||
                  priceRange !== "all") && (
                  <Button
                    variant="text"
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-md-4">
                <TextField
                  select
                  fullWidth
                  label="Price Range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <MenuItem value="all">All Prices</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="under1000">Under ₹1000</MenuItem>
                  <MenuItem value="1000-5000">₹1000 - ₹5000</MenuItem>
                  <MenuItem value="over5000">Over ₹5000</MenuItem>
                </TextField>
              </div>
            </div>
          )}

          {/* Active filters indicator */}
          {(searchTerm ||
            selectedCategory !== "all" ||
            priceRange !== "all") && (
            <div className="row mt-3">
              <div className="col-12">
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={() => setSearchTerm("")}
                    />
                  )}
                  {selectedCategory !== "all" && (
                    <Chip
                      label={`Category: ${selectedCategory}`}
                      onDelete={() => setSelectedCategory("all")}
                    />
                  )}
                  {priceRange !== "all" && (
                    <Chip
                      label={`Price: ${
                        priceRange === "free"
                          ? "Free"
                          : priceRange === "under1000"
                          ? "Under ₹1000"
                          : priceRange === "1000-5000"
                          ? "₹1000-₹5000"
                          : "Over ₹5000"
                      }`}
                      onDelete={() => setPriceRange("all")}
                    />
                  )}
                </Box>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Courses Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Courses
            </h6>
            <h1 className="mb-5">Popular Courses</h1>
          </div>

          {isLoading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error || coursesToDisplay.length === 0 ? (
            <div className="text-center my-5">
              <span className="text-danger">
                {searchTerm ||
                selectedCategory !== "all" ||
                priceRange !== "all"
                  ? "No courses match your filters."
                  : "No courses found."}
              </span>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {coursesToDisplay.map((course, idx) => (
                <div
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay={`0.${idx + 1}s`}
                  key={course._id}
                >
                  <div className="course-item bg-light">
                    <div className="position-relative overflow-hidden">
                      <img
                        className="img-fluid"
                        src={course.image || "/img/reactImg.jpeg"}
                        alt={course.title}
                      />
                      <div className="w-100 d-flex justify-content-center position-absolute bottom-0 start-0 mb-4">
                        <a
                          href={`/courses/${course._id}`}
                          className="flex-shrink-0 btn btn-sm btn-primary px-3 border-end"
                          style={{ borderRadius: "30px 0 0 30px" }}
                        >
                          Read More
                        </a>
                        <button
                          className="flex-shrink-0 btn btn-sm btn-primary px-3"
                          style={{ borderRadius: "0 30px 30px 0" }}
                          onClick={() => handleEnroll(course._id)}
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-4 pb-0">
                      <h3 className="mb-0">₹{course.price || "0.00"}</h3>
                      <div className="mb-3">
                        {[...Array(5)].map((_, i) => (
                          <small
                            key={i}
                            className={`fa fa-star${
                              i < (course.rating || 0) ? " text-primary" : ""
                            }`}
                          ></small>
                        ))}
                        <small>({course.reviews?.length || 0})</small>
                      </div>
                      <h5 className="mb-4">{course.title}</h5>
                    </div>
                    <div className="d-flex border-top">
                      <small className="flex-fill text-center border-end py-2">
                        <i className="fa fa-user-tie text-primary me-2"></i>
                        {course.instructor?.name || "Instructor"}
                      </small>
                      <small className="flex-fill text-center border-end py-2">
                        <i className="fa fa-clock text-primary me-2"></i>
                        {course.duration || "1.5 Hrs"}
                      </small>
                      <small className="flex-fill text-center py-2">
                        <i className="fa fa-user text-primary me-2"></i>
                        {course.studentsEnrolled || 0} Students
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Snackbar/Alert */}
      {snackbar.open && (
        <div
          className={`alert alert-${snackbar.severity} alert-dismissible fade show position-fixed`}
          style={{
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            minWidth: 300,
          }}
          role="alert"
        >
          {snackbar.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          ></button>
        </div>
      )}
    </div>
  );
};

export default Courses;
