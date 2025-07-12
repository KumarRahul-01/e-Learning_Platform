import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Box, Typography, CircularProgress } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useSendResetLink } from "../../../hooks/react-query/query-hooks/authQuery";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D32F2F",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h5: {
      fontWeight: 700,
      color: "#D32F2F",
    },
  },
});

const ForgotPasswordLink = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { mutate, isPending, isSuccess } = useSendResetLink();

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // Pass the email string directly, not the entire data object
    mutate(data.email);
  };

  // Reset form after successful submission
  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            p: 4,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Forgot Password
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Enter Your Email"
              type="email"
              fullWidth
              margin="normal"
              disabled={isPending}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isPending}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#B71C1C",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              {isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                  Sending...
                </>
              ) : (
                "Send Reset Password Email"
              )}
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ForgotPasswordLink;
