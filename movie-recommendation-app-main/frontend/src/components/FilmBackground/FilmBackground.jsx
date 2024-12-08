import { Stack } from "@mui/material"
import React from "react"
import bg from "../../assets/background.jpg"

const FilmBackground = ({ children }) => {
  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      spacing={2}
      height='100vh'
      sx={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative", // Ensure relative positioning for the overlay
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.9)", // Adjust the opacity as needed
          zIndex: 1, // Ensure the overlay is behind the content
        },
      }}
    >
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={2}
        sx={{ position: "relative", zIndex: 2 }} // Ensure content is above the overlay
      >
        {children}
      </Stack>
    </Stack>
  )
}

export default FilmBackground
