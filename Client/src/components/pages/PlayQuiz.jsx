import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Container,
  Paper,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Quiz as QuizIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Timer as TimerIcon,
  ArrowBack as BackIcon,
  Send as SubmitIcon,
  Refresh as RetryIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuizById,
  useQuizSubmit,
} from "../../hooks/react-query/query-hooks/quizQuery";
import { useCourseById } from "../../hooks/react-query/query-hooks/coursesQuery";

const PlayQuiz = () => {
  const theme = useTheme();
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  // Fetch quiz and course data
  const {
    data: quizData,
    isLoading: quizLoading,
    error: quizError,
  } = useQuizById(quizId);
  const { data: courseData, isLoading: courseLoading } =
    useCourseById(courseId);

  const quiz = quizData?.data;
  const course = courseData?.data;

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [results, setResults] = useState([]);

  // Quiz submission mutation
  const { mutate: submitQuiz, isLoading: isSubmitting } = useQuizSubmit();

  // Update the handleSubmitQuiz function to:
  const handleSubmitQuiz = () => {
    // Map answers by question index, not _id
    const orderedAnswers = quiz.questions.map((_, idx) =>
      typeof answers[idx] === "number" ? answers[idx] : null
    );

    submitQuiz(
      { courseId, quizId, answers: orderedAnswers },
      {
        onSuccess: (data) => {
          setScore(data.correctAnswers);
          setResults(data.results);
          setQuizCompleted(true);
          setShowResults(true);
          setShowConfirmDialog(false);

          setSnackbar({
            open: true,
            message: "Quiz submitted successfully!",
            severity: "success",
          });
        },
        onError: (error) => {
          setSnackbar({
            open: true,
            message: "Failed to submit quiz. Please try again.",
            severity: "error",
          });
        },
      }
    );
  };

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  // Initialize timer when quiz starts
  const startQuiz = () => {
    setQuizStarted(true);
    // Set timer to 30 minutes (1800 seconds) or based on quiz settings
    const quizDuration = quiz?.duration || 1800;
    setTimeLeft(quizDuration);
    setSnackbar({
      open: true,
      message: "Quiz started! Good luck!",
      severity: "success",
    });
  };

  // Handle answer selection
  const handleAnswerChange = (questionIndex, selectedOptionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOptionIndex,
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Jump to specific question
  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Calculate score
  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  // Submit quiz
  // const handleSubmitQuiz = () => {
  //   submitQuiz();
  // };

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get progress percentage
  const getProgress = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / quiz.questions.length) * 100;
  };

  // Loading state
  if (quizLoading || courseLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (quizError || !quiz) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Quiz not found or failed to load.
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate(`/courses/${courseId}`)}
          startIcon={<BackIcon />}
        >
          Back to Course
        </Button>
      </Container>
    );
  }

  // Quiz not started state
  if (!quizStarted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                }}
              >
                <QuizIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Ready to Start Quiz?
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {course?.title}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2} mb={4}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">
                  <strong>Total Questions:</strong>
                </Typography>
                <Chip label={quiz.questions.length} color="primary" />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">
                  <strong>Time Limit:</strong>
                </Typography>
                <Chip
                  label={`${Math.floor((quiz.duration || 1800) / 60)} minutes`}
                  color="secondary"
                  icon={<TimerIcon />}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">
                  <strong>Passing Score:</strong>
                </Typography>
                <Chip label="70%" color="success" />
              </Box>
            </Stack>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                • You can navigate between questions using the question
                navigator
                <br />
                • Make sure you have a stable internet connection
                <br />• The quiz will auto-submit when time runs out
              </Typography>
            </Alert>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/courses/${courseId}`)}
                startIcon={<BackIcon />}
                sx={{ flex: 1 }}
              >
                Back to Course
              </Button>
              <Button
                variant="contained"
                onClick={startQuiz}
                startIcon={<QuizIcon />}
                sx={{ flex: 2 }}
                size="large"
              >
                Start Quiz
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Quiz results state
  if (showResults) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Avatar
              sx={{
                bgcolor: passed
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
              }}
            >
              {passed ? (
                <CorrectIcon fontSize="large" />
              ) : (
                <WrongIcon fontSize="large" />
              )}
            </Avatar>

            <Typography variant="h4" fontWeight="bold" mb={1}>
              Quiz {passed ? "Completed!" : "Failed"}
            </Typography>

            <Typography variant="h2" color="primary" fontWeight="bold" mb={2}>
              {score}/{quiz.questions.length}
            </Typography>

            <Typography variant="h5" mb={3}>
              {percentage}%
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
              <Chip
                label={`${score} Correct`}
                color="success"
                icon={<CorrectIcon />}
              />
              <Chip
                label={`${quiz.questions.length - score} Wrong`}
                color="error"
                icon={<WrongIcon />}
              />
            </Stack>

            <Alert severity={passed ? "success" : "warning"} sx={{ mb: 3 }}>
              {passed
                ? "Congratulations! You have passed the quiz."
                : "You need 70% to pass. Keep studying and try again!"}
            </Alert>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => navigate(`/courses/${courseId}`)}
                startIcon={<BackIcon />}
              >
                Back to Course
              </Button>
              {!passed && (
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                  startIcon={<RetryIcon />}
                >
                  Retry Quiz
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" mb={2}>
              Your Answers:
            </Typography>
            {results.map((res, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  Q{idx + 1}: {res.questionText}
                </Typography>
                <Typography>
                  Your Answer: {res.options[res.userAnswer]}
                  {res.isCorrect ? (
                    <Chip label="Correct" color="success" sx={{ ml: 2 }} />
                  ) : (
                    <Chip label="Wrong" color="error" sx={{ ml: 2 }} />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answer: {res.options[res.correctAnswer]}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    );
  }

  // Main quiz interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            {course?.title} - Quiz
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${currentQuestionIndex + 1}/${quiz.questions.length}`}
              color="primary"
            />
            <Chip
              label={formatTime(timeLeft)}
              color={timeLeft < 300 ? "error" : "secondary"}
              icon={<TimerIcon />}
            />
          </Stack>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Progress: {answeredQuestions}/{quiz.questions.length} questions
            answered
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Paper>

      <Stack direction="row" spacing={2}>
        {/* Question Navigator */}
        <Paper elevation={2} sx={{ p: 2, width: 200, height: "fit-content" }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={2}>
            Questions
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {quiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={
                  currentQuestionIndex === index ? "contained" : "outlined"
                }
                color={
                  answers[quiz.questions[index]._id] ? "success" : "primary"
                }
                size="small"
                onClick={() => handleQuestionJump(index)}
                sx={{ minWidth: 32, height: 32 }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* Main Question Area */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Question {currentQuestionIndex + 1}
              </Typography>

              <Typography
                variant="body1"
                mb={4}
                sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
              >
                {currentQuestion.questionText}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[currentQuestionIndex] ?? ""}
                  onChange={(e) =>
                    handleAnswerChange(
                      currentQuestionIndex,
                      Number(e.target.value)
                    )
                  }
                >
                  {currentQuestion.options.map((option, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={idx}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            mt={2}
          >
            <Button
              variant="outlined"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              startIcon={<PrevIcon />}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowConfirmDialog(true)}
                endIcon={<SubmitIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                endIcon={<NextIcon />}
              >
                Next
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your quiz? You won't be able to make
            changes after submission.
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            You've answered {Object.keys(answers).length} out of{" "}
            {quiz.questions.length} questions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitQuiz}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <SubmitIcon />
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PlayQuiz;
