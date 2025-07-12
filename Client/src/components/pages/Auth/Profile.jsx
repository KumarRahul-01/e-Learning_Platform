import React from "react";
import {
  useDashboard,
  useLogout,
} from "../../../hooks/react-query/query-hooks/authQuery";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Divider,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  LinearProgress,
  Collapse,
  ListItemIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Email as EmailIcon,
  CheckCircleOutline,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Quiz as QuizIcon,
  Star as StarIcon,
  School as CoursesIcon,
  Lock as PasswordIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  MenuBook as LessonsIcon,
  BarChart as StatsIcon
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import profileImage from "../../../assets/profile.webp";
import { removeEnrollCourse } from "../../../Api/functions/enroll";

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data, refetch } = useDashboard();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [removingCourse, setRemovingCourse] = React.useState(null);
  const [expandedCourses, setExpandedCourses] = React.useState({});

  const user = data?.data;
  const logout = useLogout();

  const handleExpandCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const getCourseProgress = (courseId) => {
    return user?.progress?.find(
      (prog) => prog.courseId?._id === courseId || prog.courseId === courseId
    );
  };

  const handleRemoveCourse = async (courseId) => {
    setRemovingCourse(courseId);
    try {
      await removeEnrollCourse(courseId);
      setSnackbar({
        open: true,
        message: "Course removed successfully!",
        severity: "success",
      });
      await refetch();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Course removal failed.",
        severity: "error",
      });
    } finally {
      setRemovingCourse(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateProgressPercentage = (courseId, totalLessons = 10) => {
    const progress = getCourseProgress(courseId);
    if (!progress || !progress.completedLessons) return 0;
    return Math.round((progress.completedLessons.length / totalLessons) * 100);
  };

  const getAverageQuizScore = (quizScores) => {
    if (!quizScores || quizScores.length === 0) return 0;
    const sum = quizScores.reduce((acc, score) => acc + score.score, 0);
    return Math.round(sum / quizScores.length);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          My Learning Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your progress and manage your courses
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '3rem'
                }}
                src={profileImage}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              
              <Typography variant="h5" fontWeight="bold" align="center">
                {user?.name}
              </Typography>
              <Chip
                label={user?.role}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mt: 1, textTransform: "capitalize" }}
              />
              
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <EmailIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">{user?.email}</Typography>
              </Box>
              
              <Divider sx={{ my: 3, width: '100%' }} />
              
              <Stack spacing={2} width="100%">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CoursesIcon />}
                  fullWidth
                  onClick={() => navigate("/courses")}
                >
                  Browse Courses
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ProfileIcon />}
                  fullWidth
                  onClick={() => navigate(`/edit-user/${user?._id}`)}
                >
                  Edit Profile
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<PasswordIcon />}
                  fullWidth
                  onClick={() => navigate("/update-password")}
                >
                  Change Password
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  fullWidth
                  onClick={logout}
                >
                  Logout
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          {/* Learning Progress Summary */}
          <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Learning Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Enrolled Courses
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {user?.enrolledCourses?.length || 0}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Completed Lessons
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {user?.progress?.reduce((acc, prog) => acc + (prog.completedLessons?.length || 0), 0) || 0}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Quiz Score
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {user?.progress?.length ? 
                      Math.round(user.progress.reduce((acc, prog) => {
                        const avg = getAverageQuizScore(prog.quizScores);
                        return acc + (isNaN(avg) ? 0 : avg);
                      }, 0) / user.progress.length) : 0}%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Card>

          {/* Enrolled Courses Section */}
          <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              mb: 3
            }}>
              <Typography variant="h6" fontWeight="bold">
                My Courses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.enrolledCourses?.length || 0} enrolled
              </Typography>
            </Box>

            {user?.enrolledCourses && user.enrolledCourses.length > 0 ? (
              <List disablePadding>
                {user.enrolledCourses.map((course) => {
                  const courseProgress = getCourseProgress(course._id);
                  const lessonsCompleted = courseProgress?.completedLessons?.length || 0;
                  const quizScores = courseProgress?.quizScores || [];
                  const averageQuizScore = getAverageQuizScore(quizScores);
                  const isExpanded = expandedCourses[course._id] || false;
                  const progressPercentage = calculateProgressPercentage(course._id);

                  return (
                    <ListItem
                      key={course._id}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        mb: 2,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        p: 2,
                        transition: "all 0.3s ease",
                        '&:hover': {
                          boxShadow: 1,
                          borderColor: theme.palette.primary.light
                        }
                      }}
                    >
                      {/* Course Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography fontWeight="bold" variant="h6">
                            {course.title}
                          </Typography>
                          <Chip
                            label={course.category}
                            size="small"
                            sx={{ mt: 0.5 }}
                            color="secondary"
                          />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            component={RouterLink}
                            to={`/courses/${course._id}`}
                            size="small"
                            variant="outlined"
                            startIcon={<LessonsIcon fontSize="small" />}
                          >
                            {isMobile ? 'View' : 'View Course'}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveCourse(course._id)}
                            disabled={removingCourse === course._id}
                          >
                            {removingCourse === course._id ? "..." : "Remove"}
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleExpandCourse(course._id)}
                            endIcon={
                              isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                            }
                          >
                            {isExpanded ? "Less" : "More"}
                          </Button>
                        </Box>
                      </Box>

                      {/* Progress Bar */}
                      <Box sx={{ width: "100%", mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="body2">
                            <strong>Progress:</strong> {progressPercentage}%
                          </Typography>
                          <Typography variant="body2">
                            {lessonsCompleted} of 10 lessons
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progressPercentage}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                            }
                          }}
                        />
                      </Box>

                      {/* Quick Stats */}
                      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<QuizIcon fontSize="small" />}
                          label={`Quizzes: ${quizScores.length}`}
                          variant="outlined"
                          sx={{ backgroundColor: theme.palette.grey[100] }}
                        />
                        <Chip
                          icon={<StarIcon fontSize="small" />}
                          label={`Avg Score: ${averageQuizScore}%`}
                          variant="outlined"
                          sx={{ 
                            backgroundColor: theme.palette.grey[100],
                            color: averageQuizScore >= 80
                              ? theme.palette.success.main
                              : averageQuizScore >= 60
                              ? theme.palette.warning.main
                              : theme.palette.error.main
                          }}
                        />
                      </Box>

                      {/* Expanded Course Details */}
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
                        <Box sx={{ pl: 2 }}>
                          {/* Completed Lessons */}
                          {courseProgress?.completedLessons?.length > 0 ? (
                            <>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                                <LessonsIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Completed Lessons
                              </Typography>
                              <List dense sx={{ width: "100%", mb: 2 }}>
                                {courseProgress.completedLessons.map((lessonId, index) => (
                                  <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <CheckCircleOutline color="success" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={`Lesson ${index + 1}`}
                                      secondary={`Completed on ${new Date().toLocaleDateString()}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 2 }}>
                              No lessons completed yet. Start learning!
                            </Typography>
                          )}

                          {/* Quiz Results */}
                          {quizScores.length > 0 && (
                            <>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                                <QuizIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Quiz Results
                              </Typography>
                              <TableContainer component={Paper} sx={{ mb: 3 }}>
                                <Table size="small">
                                  <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                                    <TableRow>
                                      <TableCell>Quiz</TableCell>
                                      <TableCell align="right">Score</TableCell>
                                      <TableCell align="right">Date</TableCell>
                                      <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {quizScores.map((quiz, index) => (
                                      <TableRow key={index}>
                                        <TableCell>Quiz {index + 1}</TableCell>
                                        <TableCell align="right">{quiz.score}%</TableCell>
                                        <TableCell align="right">
                                          {new Date(quiz.date || new Date()).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                          <Chip
                                            size="small"
                                            label={
                                              quiz.score >= 80
                                                ? "Excellent"
                                                : quiz.score >= 60
                                                ? "Good"
                                                : "Needs Work"
                                            }
                                            sx={{
                                              backgroundColor:
                                                quiz.score >= 80
                                                  ? theme.palette.success.light
                                                  : quiz.score >= 60
                                                  ? theme.palette.warning.light
                                                  : theme.palette.error.light,
                                              color:
                                                quiz.score >= 80
                                                  ? theme.palette.success.contrastText
                                                  : quiz.score >= 60
                                                  ? theme.palette.warning.contrastText
                                                  : theme.palette.error.contrastText,
                                            }}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </>
                          )}

                          {/* Course Statistics */}
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                            <StatsIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Course Statistics
                          </Typography>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={4}>
                              <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Completion
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="primary">
                                  {progressPercentage}%
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Lessons Completed
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="primary">
                                  {lessonsCompleted}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Avg Quiz Score
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="primary">
                                  {averageQuizScore}%
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  You haven't enrolled in any courses yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/courses")}
                  startIcon={<CoursesIcon />}
                >
                  Browse Available Courses
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;