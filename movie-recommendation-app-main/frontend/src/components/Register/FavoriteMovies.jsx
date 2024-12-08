import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Autocomplete,
  Pagination,
} from "@mui/material";
import { ArrowForward, Close } from "@mui/icons-material";
import api from "../../api/api";

const FavoriteMovies = ({ setRegisterStep, setUserDetails }) => {
  const [preferredMovies, setPreferredMovies] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalMovies, setTotalMovies] = useState(0);

  const fetchMovies = async (page) => {
    try {
      const response = await api.get(
        `/movie?page=${page}&limit=${rowsPerPage}`
      ); // Adjust your API as necessary
      console.log(response.data);
      if (Array.isArray(response.data.movies)) {
        setMovies(response.data.movies);
        setTotalMovies(response.data.totalMovies);
      } else {
        console.error("API response is not an array", response.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const handleAddMovie = (event, value) => {
    if (
      value &&
      !preferredMovies.some((movie) => movie.movie_id === value.movie_id)
    ) {
      setPreferredMovies([...preferredMovies, value]);
      setSearchValue(null);
    }
  };

  const handleRemoveMovie = (movie_id) => {
    setPreferredMovies(
      preferredMovies.filter((movie) => movie.movie_id !== movie_id)
    );
  };

  const onNextClick = () => {
    // Assuming preferredMovies is an array of movie objects
    const movieIds = preferredMovies.map((movie) => movie.movie_id); // Extracting movie_ids
    setUserDetails((prev) => ({ ...prev, favoriteMovies: movieIds })); // Setting only movie_ids
    setRegisterStep((prev) => prev + 1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Stack spacing={2} padding={2}>
      <Typography align='center' variant='h4'>
        Tell us about your preferred movies and shows
      </Typography>
      {movies && (
        <Autocomplete
          options={movies}
          getOptionLabel={(option) => option.title}
          value={searchValue}
          onChange={handleAddMovie}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Search for a movie'
              variant='outlined'
              onChange={(e) => setSearchValue(e.target.value)}
            />
          )}
        />
      )}
      <Stack spacing={2}>
        {preferredMovies.map((movie, index) => (
          <Card
            key={index}
            sx={{ display: "flex", alignItems: "center", padding: 1 }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant='h6'>{movie.title}</Typography>
              <Typography variant='body2' color='textSecondary'>
                {movie.year}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleRemoveMovie(movie.movie_id)}>
                <Close />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Stack>
      <Pagination
        count={Math.ceil(totalMovies / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        variant='outlined'
        shape='rounded'
      />
      <Button
        onClick={onNextClick}
        variant='contained'
        color='primary'
        endIcon={<ArrowForward />}
      >
        Next
      </Button>
    </Stack>
  );
};

export default FavoriteMovies;
