import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Switch,
  Container,
  Stack,
  useTheme,
  Paper,
  Avatar,
  Grid
} from "@mui/material";
import {
  PlayCircle as PlayIcon,
  CheckCircle as CompleteIcon,
  Quiz as QuizIcon,
  School as CourseIcon,
  Lock as PaymentIcon,
  AccessTime as DurationIcon,
  MenuBook as LessonsIcon,
  QuestionAnswer as QuestionsIcon
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseById } from "../../hooks/react-query/query-hooks/coursesQuery";
import { enroll } from "../../Api/functions/enroll";
import { useLessonsByCourseId } from "../../hooks/react-query/query-hooks/lessonQuery";
import { useMarkLessonComplete } from "../../hooks/react-query/query-hooks/progressQuery";
import { useQuizzesByCourseId } from "../../hooks/react-query/query-hooks/quizQuery";
import { useQuizById } from "../../hooks/react-query/query-hooks/quizQuery";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CourseById = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCourseById(id);
  const course = data?.data;

  const { data: lessonsData, isLoading: lessonsLoading } = useLessonsByCourseId(course?._id);
  const { data: quizzesData, isLoading: quizzesLoading } = useQuizzesByCourseId(course?._id);
  const [selectedQuizId, setSelectedQuizId] = React.useState(null);
  const { data: quizDetails } = useQuizById(selectedQuizId);

  const { mutate: markComplete } = useMarkLessonComplete();

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [completingLessons, setCompletingLessons] = React.useState(new Set());
  const [completedLessons, setCompletedLessons] = React.useState(new Set());

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please log in to enroll.",
        severity: "warning",
      });
      return;
    }

    if (!course.price || course.price === 0) {
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
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || typeof window.Razorpay === "undefined") {
      setSnackbar({
        open: true,
        message: "Payment gateway failed to load.",
        severity: "error",
      });
      return;
    }

    const options = {
      key: "rzp_test_1ZNFJliTxKI2kU",
      amount: Number(course.price) * 100,
      currency: "INR",
      name: "E-Learning Platform",
      description: `Enrollment for ${course.title}`,
      image: "/e-learning.png",
      handler: async () => {
        try {
          await enroll({ courseId });
          setSnackbar({
            open: true,
            message: "Enrollment successful!",
            severity: "success",
          });
        } catch (err) {
          setSnackbar({
            open: true,
            message: err?.response?.data?.message || "Enrollment failed.",
            severity: "error",
          });
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: { color: theme.palette.primary.main },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleLessonComplete = (courseId, lessonId, isComplete) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please log in to mark lessons as complete.",
        severity: "warning",
      });
      return;
    }

    setCompletingLessons((prev) => new Set(prev).add(lessonId));

    markComplete(
      { courseId, lessonId, complete: isComplete },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: `Lesson ${isComplete ? "marked" : "unmarked"} as complete!`,
            severity: "success",
          });
          setCompletedLessons(prev => {
            const newSet = new Set(prev);
            isComplete ? newSet.add(lessonId) : newSet.delete(lessonId);
            return newSet;
          });
          setCompletingLessons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(lessonId);
            return newSet;
          });
        },
        onError: (error) => {
          console.error("Error marking lesson complete:", error);
          setSnackbar({
            open: true,
            message:
              error?.response?.data?.message ||
              "Failed to update lesson status.",
            severity: "error",
          });
          setCompletingLessons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(lessonId);
            return newSet;
          });
        },
      }
    );
  };

  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please log in to take quizzes.",
        severity: "warning",
      });
      return;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography color="error">Course not found.</Typography>
      </Box>
    );
  }

  const totalQuestions = Array.isArray(quizzesData) 
    ? quizzesData.reduce((total, quiz) => total + (quiz.questions?.length || 0), 0)
    : (quizzesData?.data?.reduce((total, quiz) => total + (quiz.questions?.length || 0), 0) || 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${theme.palette.primary.main}`
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  width: 56, 
                  height: 56,
                  mt: 1
                }}>
                  <CourseIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Chip 
                    label={course.category} 
                    color="primary" 
                    size="small" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {course.description}
                  </Typography>
                  
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Chip 
                      icon={<LessonsIcon />}
                      label={`${lessonsData?.data?.length || 0} Lessons`}
                      variant="outlined"
                      color="info"
                    />
                    <Chip 
                      icon={<QuestionsIcon />}
                      label={`${totalQuestions} Questions`}
                      variant="outlined"
                      color="info"
                    />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
          {/* Lessons Section */}
          <Card sx={{ 
            mt: 4, 
            borderRadius: 3, 
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <LessonsIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="bold">
                  Course Curriculum
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              {lessonsLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (lessonsData?.data || []).length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No lessons available yet.
                </Typography>
              ) : (
                <List disablePadding>
                  {lessonsData.data.map((lesson, index) => {
                    const isCompleted = completedLessons.has(lesson._id);
                    const isMarking = completingLessons.has(lesson._id);
                    
                    return (
                      <ListItem
                        key={lesson._id}
                        sx={{
                          p: 2.5,
                          mb: 1.5,
                          borderRadius: 2,
                          backgroundColor: isCompleted ? theme.palette.success.light : theme.palette.background.paper,
                          border: `1px solid ${isCompleted ? theme.palette.success.main : theme.palette.divider}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mr: 2,
                          minWidth: 40
                        }}>
                          <Typography 
                            variant="h6" 
                            color={isCompleted ? 'success.main' : 'text.secondary'}
                            fontWeight="bold"
                          >
                            {index + 1}.
                          </Typography>
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="bold"
                            color={isCompleted ? 'success.dark' : 'text.primary'}
                          >
                            {lesson.title}
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                            <Typography 
                              variant="body2" 
                              color={isCompleted ? 'success.dark' : 'text.secondary'}
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <DurationIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {lesson.duration}
                            </Typography>
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Button
                            variant={isCompleted ? "contained" : "outlined"}
                            color={isCompleted ? "success" : "primary"}
                            size="small"
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<PlayIcon />}
                            sx={{ 
                              minWidth: 120,
                              '&:hover': {
                                backgroundColor: isCompleted ? theme.palette.success.dark : undefined
                              }
                            }}
                          >
                            {isCompleted ? 'Review' : 'Watch'}
                          </Button>

                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            ml: 2
                          }}>
                            {isMarking ? (
                              <CircularProgress size={24} />
                            ) : (
                              <>
                                <Switch
                                  checked={isCompleted}
                                  onChange={(e) => handleLessonComplete(
                                    course._id, 
                                    lesson._id, 
                                    e.target.checked
                                  )}
                                  color="success"
                                />
                                <Typography 
                                  variant="body2" 
                                  sx={{ ml: 1 }}
                                  color={isCompleted ? 'success.dark' : 'text.secondary'}
                                >
                                  {isCompleted ? 'Completed' : 'Mark Complete'}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Stack>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Quizzes Section */}
          <Card sx={{ 
            mt: 4, 
            borderRadius: 3, 
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <QuizIcon color="primary" fontSize="large" />
                <Typography variant="h5" fontWeight="bold">
                  Course Assessments
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              {quizzesLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (Array.isArray(quizzesData) ? quizzesData : (quizzesData?.data || [])).length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No quizzes available for this course.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {(Array.isArray(quizzesData) ? quizzesData : (quizzesData?.data || [])).map((quiz, index) => {
                    const questionCount = quiz.questions?.length || 0;
                    const isSelected = selectedQuizId === quiz._id;
                    
                    return (
                      <React.Fragment key={quiz._id}>
                        <Paper 
                          elevation={isSelected ? 4 : 2}
                          sx={{ 
                            p: 3, 
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: `4px solid ${theme.palette.primary.main}`,
                            backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.background.paper,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              Quiz {index + 1}: {quiz.title || 'Untitled Quiz'}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                              <Chip 
                                icon={<QuestionsIcon fontSize="small" />}
                                label={`${questionCount} question${questionCount !== 1 ? 's' : ''}`}
                                size="small"
                                color={questionCount > 0 ? 'primary' : 'default'}
                                variant="outlined"
                              />
                              {quiz.timeLimit && (
                                <Chip
                                  icon={<DurationIcon fontSize="small" />}
                                  label={`${quiz.timeLimit} min`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Box>
                          <Button
                            variant={isSelected ? "contained" : "outlined"}
                            color="primary"
                            onClick={() => handleStartQuiz(quiz._id)}
                            startIcon={<QuizIcon />}
                            disabled={questionCount === 0}
                            sx={{ 
                              minWidth: 180,
                              fontWeight: 'bold'
                            }}
                          >
                            {questionCount === 0 ? 'No Questions' : isSelected ? 'Viewing Details' : 'View Details'}
                          </Button>
                        </Paper>

                        {/* Quiz Details Section */}
                        {isSelected && quizDetails?.data && (
                          <Paper elevation={2} sx={{ 
                            p: 3, 
                            borderRadius: 2, 
                            mt: 1,
                            backgroundColor: theme.palette.background.default,
                            border: `1px solid ${theme.palette.divider}`
                          }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                              Quiz Preparation
                            </Typography>
                            
                            <Typography variant="body1" paragraph>
                              This assessment contains <strong>{quizDetails.data.questions?.length || 0}</strong> questions
                              {quizDetails.data.timeLimit ? ` with a time limit of ${quizDetails.data.timeLimit} minutes.` : '.'}
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Sample Questions:
                              </Typography>
                              <List dense sx={{ 
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: 1,
                                p: 1
                              }}>
                                {quizDetails.data.questions?.slice(0, 3).map((q, i) => (
                                  <ListItem key={i} sx={{ 
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    '&:last-child': { borderBottom: 'none' }
                                  }}>
                                    <ListItemText
                                      primary={
                                        <Typography fontWeight="medium">
                                          {i + 1}. {q.questionText}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box component="span">
                                          Options: {q.options.map((opt, idx) => (
                                            <Box 
                                              component="span" 
                                              key={idx}
                                              sx={{ 
                                                display: 'inline-block',
                                                mr: 1,
                                                p: 0.5,
                                                backgroundColor: theme.palette.grey[100],
                                                borderRadius: 0.5
                                              }}
                                            >
                                              {opt}
                                            </Box>
                                          ))}
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                              {quizDetails.data.questions?.length > 3 && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                  + {quizDetails.data.questions.length - 3} more questions in the actual quiz
                                </Typography>
                              )}
                            </Box>

                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              pt: 2,
                              borderTop: `1px solid ${theme.palette.divider}`
                            }}>
                              <Button 
                                variant="outlined" 
                                onClick={() => setSelectedQuizId(null)}
                                sx={{ minWidth: 120 }}
                              >
                                Back
                              </Button>
                              <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => navigate(`/courses/${course._id}/quiz/${quiz._id}`)}
                                sx={{ 
                                  minWidth: 180,
                                  fontWeight: 'bold'
                                }}
                              >
                                Start Assessment Now
                              </Button>
                            </Box>
                          </Paper>
                        )}
                      </React.Fragment>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            position: 'sticky',
            top: 20,
            borderRadius: 3,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderTop: `4px solid ${theme.palette.primary.main}`
          }}>
            <CardContent>
              <Box sx={{ 
                textAlign: 'center',
                mb: 3,
                p: 2,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2
              }}>
                <Typography variant="h6" color="primary.dark" fontWeight="bold">
                  Ready to Start Learning?
                </Typography>
              </Box>
              
              {course.price > 0 ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" color="primary" fontWeight="bold" textAlign="center">
                    ₹{course.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    One-time payment for lifetime access
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  mb: 3,
                  p: 2,
                  backgroundColor: theme.palette.success.light,
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" color="success.dark" fontWeight="bold">
                    Free Course
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => handleEnroll(course._id)}
                startIcon={<PaymentIcon />}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                  }
                }}
              >
                Enroll Now
              </Button>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Course Highlights
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={`${lessonsData?.data?.length || 0} video lessons`} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={`${Array.isArray(quizzesData) ? quizzesData.length : (quizzesData?.data?.length || 0)} assessments`} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={`Certificate of completion`} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Share This Course
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small" color="inherit">Facebook</Button>
                <Button variant="outlined" size="small" color="inherit">Twitter</Button>
                <Button variant="outlined" size="small" color="inherit">LinkedIn</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: "100%",
            boxShadow: theme.shadows[4],
            alignItems: 'center'
          }}
          elevation={6}
        >
          <Typography fontWeight="bold">{snackbar.message}</Typography>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseById;