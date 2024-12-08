// NewestMovies.js
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent, CardActions, Grid, Stack } from "@mui/material";
import api from "../../api/api"; // Assuming this handles API calls
import Sidebar from "../Sidebar/Sidebar";
import Movies from "../MoviesSection/Movies";

const NewestMovies = () => {
  const [newestMovies, setNewestMovies] = useState([]);
  const [predictedScores, setPredictedScores] = useState({});

  useEffect(() => {
    const fetchNewestMovies = async () => {
      try {
        const response = await api.get("/newestMovies"); // Adjust endpoint as needed
        setNewestMovies(response.data.movies);
      } catch (error) {
        console.error("Error fetching newest movies:", error);
      }
    };

    fetchNewestMovies();
  }, []);

  const handlePredictIMDb = async (movie) => {
    const { runtime, release_year, genres, production_companies, production_countries, original_language, directors, main_characters, keywords } = movie;

    try {
      const response = await api.post("/predict_xgboost", {
        runtime,
        release_year,
        genres,
        production_companies,
        production_countries,
        original_language,
        directors,
        main_characters,
        keywords,
      });
      setPredictedScores((prevScores) => ({
        ...prevScores,
        [movie.id]: response.data.predicted_vote_average,
      }));
    } catch (error) {
      console.error("Error predicting IMDb score:", error);
    }
  };

  return (
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 3, mb: 5 }}>
      <Sidebar />
      <Box sx={{ mt: 3, mb: 5 }}>
        <Movies title='Newest Movies' movies={newestMovies} isNewest={true} />
        {/* <Typography variant="h4" color="primary" gutterBottom>
          Newest Movies
        </Typography> */}
        {/* <Grid container spacing={2}>
          {newestMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card sx={{ backgroundColor: "#121212", color: "#ffffff" }}>
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {movie.release_year}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePredictIMDb(movie)}
                  >
                    Predict IMDb
                  </Button>
                </CardActions>
                {predictedScores[movie.id] && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1">
                      Predicted IMDb Score: {predictedScores[movie.id].toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid> */}
      </Box>
    </Stack>
  );
};

export default NewestMovies;
