import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Link as MUILink,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUserSignInMutation } from "../../../hooks/react-query/query-hooks/authQuery";
import { Link as RouterLink } from "react-router-dom";
import bgImg from "../../../assets/login-bg.webp";
import logomain from "../../../assets/logoMain.webp";

const UserSignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate } = useUserSignInMutation();

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center", // <-- keep this
        justifyContent: "center",
        background: {
          xs: "#101828",
          md: `url(${bgImg}) no-repeat center center/cover`,
        },
        position: "relative",
      }}
    >
      {/* Overlay for dark effect on desktop */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: { xs: "none", md: "rgba(10,20,40,0.85)" },
          zIndex: 1,
        }}
      />
      {/* Left Side: Form */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: { xs: "100%", md: "45%" },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center", // Center horizontally
          px: { xs: 2, sm: 6, md: 10 },
          bgcolor: { xs: "#101828", md: "transparent" },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Box sx={{ mb: 5, textAlign: { xs: "center", md: "left" } }}>
            <span>
              <h2
                className="m-0 text-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                <i className="fa fa-book me-3"></i>eLEARNING
              </h2>
            </span>
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#fff"
            gutterBottom
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            Welcome to e-Learning Platform!
          </Typography>
          <Typography
            color="#bdbdbd"
            sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}
          >
            Please sign-in to your account and start the adventure.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: "100%",
              maxWidth: 400,
              mx: { xs: "auto", md: 0 },
            }}
          >
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                sx: {
                  bgcolor: "#232b3e",
                  color: "#fff",
                  borderRadius: 2,
                  "& input": { color: "#fff" },
                },
              }}
              InputLabelProps={{
                sx: { color: "#bdbdbd" },
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("password", {
                required: "Password is required",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                sx: {
                  bgcolor: "#232b3e",
                  color: "#fff",
                  borderRadius: 2,
                  "& input": { color: "#fff" },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      sx={{ color: "#bdbdbd" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { color: "#bdbdbd" },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 1,
                mb: 2,
              }}
            >
              <MUILink
                component={RouterLink}
                to="/reset-password-link"
                sx={{
                  color: "#ffd600",
                  fontWeight: 500,
                  fontSize: 15,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot Password?
              </MUILink>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(90deg,#0d6efd 0%,#1e90ff 100%)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
                py: 1.5,
                borderRadius: 2,
                mb: 2,
                boxShadow: "0 4px 16px 0 rgba(13,110,253,0.10)",
                "&:hover": {
                  background: "linear-gradient(90deg,#0b5ed7 0%,#0d6efd 100%)",
                },
              }}
            >
              Login
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                color: "#bdbdbd",
                fontSize: 14,
                textAlign: "center",
                mb: 1,
              }}
            >
              Terms and Conditions&nbsp;&nbsp;|&nbsp;&nbsp;Privacy
              Policy&nbsp;&nbsp;|&nbsp;&nbsp;Refund/Cancellation Policy
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserSignIn;
