import React, { useState } from "react";
import FilmBackground from "../FilmBackground/FilmBackground";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { ArrowForward, Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData); // Submit the form data (you can perform further actions here)
    await api
      .get(`/user/findbyemail/${formData?.username}`)
      .then((response) => {
        if (response.data) {
          if (response.data.password === formData.password) {
            localStorage.setItem("userId", response.data._id);
            navigate("/movies");
          } else {
            alert("Invalid password");
          }
        } else {
          alert("User not found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <FilmBackground>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={2}
        padding={2}
      >
        <img width={400} src={logo} alt='Filmatic logo' />
        <Typography variant='h4'>Login to your account</Typography>
        <TextField
          label='Email'
          variant='outlined'
          name='username'
          value={formData.username}
          onChange={handleChange}
          sx={{ width: "100%" }}
        />
        <TextField
          label='Password'
          variant='outlined'
          type={showPassword ? "text" : "password"}
          name='password'
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%" }}
        />
        <Button
          variant='contained'
          color='primary'
          endIcon={<ArrowForward />}
          onClick={handleSubmit}
        >
          Login
        </Button>
      </Stack>
    </FilmBackground>
  );
};

export default Login;
