import React, { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Alert,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from "@mui/material";
import {
  Quiz as QuizIcon,
  School as CourseIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon
} from "@mui/icons-material";
import { getAllQuizzes } from "../../Api/functions/quiz";
import { getAllcourses } from "../../Api/functions/courses";

const QuizPage = () => {
  const theme = useTheme();
  const [quizzesByCourse, setQuizzesByCourse] = useState({});
  const [courseTitles, setCourseTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quizzes
        const quizRes = await getAllQuizzes();
        // Fetch courses
        const courseRes = await getAllcourses();
        
        // Map courseId to courseTitle
        const titles = {};
        (Array.isArray(courseRes.data) ? courseRes.data : []).forEach((course) => {
          titles[course._id] = course.title;
        });
        setCourseTitles(titles);

        // Group quizzes by courseId and count total questions
        const grouped = {};
        let questionCount = 0;
        
        (Array.isArray(quizRes.data) ? quizRes.data : []).forEach((quiz) => {
          if (!grouped[quiz.courseId]) grouped[quiz.courseId] = [];
          quiz.questions.forEach((q, idx) => {
            questionCount++;
            grouped[quiz.courseId].push({
              ...q,
              quizId: quiz._id,
              questionIdx: idx,
            });
          });
        });
        
        setQuizzesByCourse(grouped);
        setTotalQuestions(questionCount);
      } catch (err) {
        console.error("Error fetching data:", err);
        setQuizzesByCourse({});
        setCourseTitles({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOptionChange = (quizId, questionIdx, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [`${quizId}-${questionIdx}`]: optionIdx,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    Object.values(quizzesByCourse).forEach((questions) => {
      questions.forEach((q) => {
        const selectedOption = q.options[selectedAnswers[`${q.quizId}-${q.questionIdx}`]];
        if (selectedOption !== undefined && selectedOption === q.answer) {
          correct += 1;
        }
      });
    });
    setScore(correct);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!Object.keys(quizzesByCourse).length) {
    return (
      <Container maxWidth="md" sx={{ py: 5, textAlign: "center" }}>
        <QuizIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          No quizzes available at the moment.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <QuizIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4" fontWeight="bold">
            Course Assessments
          </Typography>
        </Stack>
        
        <Paper elevation={0} sx={{ 
          p: 2, 
          mb: 3,
          backgroundColor: theme.palette.grey[100],
          borderRadius: 2
        }}>
          <Typography variant="body1">
            Test your knowledge with these course assessments. Answer all questions and submit to see your score.
          </Typography>
          <Chip 
            label={`${totalQuestions} total questions`}
            color="info"
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          />
        </Paper>
      </Box>

      <form onSubmit={handleSubmit}>
        {Object.entries(quizzesByCourse).map(([courseId, questions], cIdx) => (
          <Card key={courseId} sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Accordion defaultExpanded elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CourseIcon color="primary" />
                    <Typography variant="h5" fontWeight="bold">
                      {courseTitles[courseId] || `Course ID: ${courseId}`}
                    </Typography>
                    <Chip 
                      label={`${questions.length} questions`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider sx={{ mb: 3 }} />
                  {questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[`${q.quizId}-${q.questionIdx}`] !== undefined;
                    const isCorrect = submitted && 
                                     q.options[selectedAnswers[`${q.quizId}-${q.questionIdx}`]] === q.answer;
                    
                    return (
                      <Paper
                        key={`${q.quizId}-${q.questionIdx}`}
                        elevation={1}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 2,
                          borderLeft: `4px solid ${
                            submitted 
                              ? isCorrect 
                                ? theme.palette.success.main 
                                : theme.palette.error.main
                              : isAnswered
                                ? theme.palette.primary.main
                                : theme.palette.divider
                          }`,
                          backgroundColor: submitted
                            ? isCorrect
                              ? theme.palette.success.light
                              : theme.palette.error.light
                            : theme.palette.background.paper
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          <Box component="span" sx={{ color: "primary.main", mr: 1 }}>
                            Q{idx + 1}:
                          </Box>
                          {q.questionText}
                        </Typography>

                        <FormControl component="fieldset" fullWidth>
                          <RadioGroup
                            name={`quiz-${q.quizId}-${q.questionIdx}`}
                            value={selectedAnswers[`${q.quizId}-${q.questionIdx}`] || ""}
                            onChange={(e) => handleOptionChange(q.quizId, q.questionIdx, parseInt(e.target.value))}
                          >
                            {Array.isArray(q.options) && q.options.length > 0 ? (
                              q.options.map((opt, oIdx) => (
                                <Paper
                                  key={oIdx}
                                  elevation={0}
                                  sx={{
                                    mb: 1,
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: 
                                      submitted && q.answer === opt
                                        ? theme.palette.success.light
                                        : submitted && 
                                          selectedAnswers[`${q.quizId}-${q.questionIdx}`] === oIdx && 
                                          q.answer !== opt
                                        ? theme.palette.error.light
                                        : "transparent",
                                    border: `1px solid ${
                                      selectedAnswers[`${q.quizId}-${q.questionIdx}`] === oIdx
                                        ? theme.palette.primary.main
                                        : theme.palette.divider
                                    }`
                                  }}
                                >
                                  <FormControlLabel
                                    value={oIdx}
                                    control={
                                      <Radio 
                                        disabled={submitted}
                                        color={
                                          submitted
                                            ? q.answer === opt
                                              ? "success"
                                              : selectedAnswers[`${q.quizId}-${q.questionIdx}`] === oIdx
                                                ? "error"
                                                : "primary"
                                            : "primary"
                                        }
                                      />
                                    }
                                    label={
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        width: '100%'
                                      }}>
                                        {opt}
                                        {submitted && q.answer === opt && (
                                          <CorrectIcon 
                                            sx={{ 
                                              ml: 1, 
                                              color: "success.main",
                                              fontSize: 20
                                            }} 
                                          />
                                        )}
                                        {submitted && 
                                         selectedAnswers[`${q.quizId}-${q.questionIdx}`] === oIdx && 
                                         q.answer !== opt && (
                                          <IncorrectIcon 
                                            sx={{ 
                                              ml: 1, 
                                              color: "error.main",
                                              fontSize: 20
                                            }} 
                                          />
                                        )}
                                      </Box>
                                    }
                                    sx={{
                                      width: '100%',
                                      m: 0,
                                      '& .MuiFormControlLabel-label': {
                                        flex: 1
                                      }
                                    }}
                                  />
                                </Paper>
                              ))
                            ) : (
                              <Alert severity="warning" sx={{ mt: 1 }}>
                                No options available for this question.
                              </Alert>
                            )}
                          </RadioGroup>
                        </FormControl>

                        {submitted && (
                          <Box sx={{ 
                            mt: 2,
                            p: 2,
                            backgroundColor: theme.palette.background.default,
                            borderRadius: 1
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Explanation:</strong> {q.explanation || "No explanation provided."}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {!submitted ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              Submit All Answers
            </Button>
          </Box>
        ) : (
          <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Assessment Results
              </Typography>
              <Box sx={{ 
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                border: `2px dashed ${theme.palette.primary.main}`,
                borderRadius: '50%',
                width: 200,
                height: 200,
                justifyContent: 'center',
                mb: 3
              }}>
                <Typography variant="h2" color="primary" fontWeight="bold">
                  {score}
                </Typography>
                <Typography variant="subtitle1">
                  out of {totalQuestions}
                </Typography>
              </Box>
              <Typography variant="h6" color="text.secondary">
                You scored {Math.round((score / totalQuestions) * 100)}%
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{ mt: 3, px: 4, fontWeight: "bold" }}
                onClick={() => {
                  setSubmitted(false);
                  setSelectedAnswers({});
                }}
              >
                Retake Assessment
              </Button>
            </CardContent>
          </Card>
        )}
      </form>
    </Container>
  );
};

export default QuizPage;