import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/newestMoviePreditor_api"

const MovieCard = ({ title, subtitle, image, category, movie_id, vote_average, poster_path,
  runtime, release_date, genres, production_companies, production_countries, original_language, directors, main_characters, keywords,
  movie, isNewest }) => {
  const [predictedScores, setPredictedScores] = useState("");
  const navigate = useNavigate();
  const handleMovieClick = (movie_id) => {
    navigate(`/movies/${movie_id}`);
  };
  const image_path = 'https://image.tmdb.org/t/p/w500' + poster_path;


  const handlePredictIMDb = async () => {
    // Destructure the movie object and assign default values
    // const {
    //   runtime: runtime, // Default runtime (e.g., 120 minutes)
    //   release_year = 0, // Default release year
    //   genres = "", // Default genre
    //   production_companies = "", // Default production company
    //   production_countries = "", // Default production country
    //   original_language = "", // Default language (English)
    //   directors = "", // Default director name
    //   main_characters = "", // Default characters
    //   keywords = "" // Default keywords
    // } = movie;



    try {
      //store release date as a date object
      const release_date1 = new Date(release_date);
      console.log(release_date1)
      //extract release year from release date
      const release_year = release_date1.getFullYear();
      console.log(release_year)
      // Send the API request
      const response = await api.post("/predict_xgboost", {
        runtime: runtime || 0,
        release_year: release_year || 0,
        genres: genres || "",
        production_companies: production_companies || "",
        production_countries: production_countries || "",
        original_language: original_language || "",
        directors: directors || "",
        main_characters: main_characters || "",
        keywords: keywords || "",
      });

      console.log(response)

      // Update the predicted scores state
      // setPredictedScores((prevScores) => ({
      //   ...prevScores,
      //   [movie.movie_id]: response.predicted_vote_average,
      // }));
      setPredictedScores(response.data.predicted_vote_average);
    } catch (error) {
      console.error("Error predicting IMDb score:", error);
    }
  };


  return (
    <Card sx={{ borderRadius: "12px" }}>
      <CardMedia component='img' height='140' image={image_path} alt={title} />
      <CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePredictIMDb()}
          >
            Predict IMDb
          </Button>
        </CardActions>
        {predictedScores && (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">
              Predicted IMDb Score: {predictedScores?.toFixed(4)}
            </Typography>
          </Box>
        )}

        <Typography variant='h6' component='div'>
          {title.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          {subtitle}
        </Typography>
        <Typography variant='body2' color='text.primary'>
          {category}
        </Typography>
        <Button
          onClick={() => handleMovieClick(movie_id)}
          variant='outlined'
          size='small'
        >
          More Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
