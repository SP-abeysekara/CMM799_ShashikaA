import { Button, Stack, Typography } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import FilmBackground from "../FilmBackground/FilmBackground"

const GetStarted = () => {
  const navigate = useNavigate()

  return (
    <FilmBackground>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={2}
        sx={{ position: "relative", zIndex: 2 }} // Ensure content is above the overlay
      >
        <img width={500} src={logo} alt='Filmatic logo' />
        <Typography variant='h4' color='white'>
          Welcome to Filmatic
        </Typography>
        <Stack spacing={1} direction='row'>
          <Button
            onClick={() => navigate("/login")}
            variant='contained'
            color='primary'
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/register")}
            variant='outlined'
            color='primary'
          >
            Register
          </Button>
        </Stack>
      </Stack>
    </FilmBackground>
  )
}

export default GetStarted
