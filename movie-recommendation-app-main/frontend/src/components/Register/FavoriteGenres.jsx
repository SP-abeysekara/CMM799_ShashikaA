import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Pagination, // Import Pagination
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import api from "../../api/api";
import { getAllGenres } from "../../utils/movieDataExtractor";

const FavoriteGenres = ({ setRegisterStep, setUserDetails }) => {
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get(`/movie?page=${currentPage}`); // Adjust API endpoint for pagination
        if (response.data && response.data.movies) {
          setGenres(getAllGenres(response.data.movies));
          setTotalPages(response.data.totalPages); // Adjust based on your API response structure
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [currentPage]); // Fetch genres whenever currentPage changes

  const handleToggleGenre = (genre) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((item) => item !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const onNextClick = () => {
    setUserDetails((prev) => ({ ...prev, favoriteGenres }));
    setRegisterStep((prev) => prev + 1);
  };

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant='h4'>Tell us about your favorite genres</Typography>
      <Grid container spacing={2}>
        {genres.map((genre, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={favoriteGenres.includes(genre)}
                  onChange={() => handleToggleGenre(genre)}
                />
              }
              label={genre}
            />
          </Grid>
        ))}
      </Grid>
      {/* Add Pagination Component */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)} // Update current page on change
        variant='outlined'
        shape='rounded'
        sx={{ mt: 2 }} // Add some margin to the top
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

export default FavoriteGenres;
