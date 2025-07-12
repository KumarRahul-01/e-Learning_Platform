import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  Select,
  FormControl,
  InputLabel,
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Link
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserSignUpMutation } from "../../../hooks/react-query/query-hooks/authQuery";
import { Link as RouterLink } from "react-router-dom";

// Cleaner theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Softer blue instead of red
      contrastText: "#fff",
    },
    secondary: {
      main: "#4caf50", // Green for secondary actions
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // More standard font
    h4: {
      fontWeight: 500, // Less bold for elegance
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners
          textTransform: 'none', // Natural case
          padding: '10px 16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const UserSignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student", // Default to student
    },
  });

  const { mutate } = useUserSignUpMutation();

  const onSubmit = (data) => {
    mutate(data);
    reset();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa", // Light gray background
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our learning community today
              </Typography>
            </Box>

            <Box 
              component="form" 
              onSubmit={handleSubmit(onSubmit)} 
              noValidate
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    type="email"
                    variant="outlined"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    fullWidth
                    type="password"
                    variant="outlined"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>I am a...</InputLabel>
                    <Select
                      label="I am a..."
                      variant="outlined"
                      {...register("role", { required: "Please select a role" })}
                      error={!!errors.role}
                    >
                      <MenuItem value="student">Student</MenuItem>
                      
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                    {errors.role && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {errors.role.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
              >
                Create Account
              </Button>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link 
                    component={RouterLink} 
                    to="/signin" 
                    color="primary"
                    underline="hover"
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserSignUp;