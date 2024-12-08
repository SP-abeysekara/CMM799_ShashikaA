import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Grid,
  Autocomplete,
  Pagination, // Import Pagination
} from "@mui/material";
import { ArrowForward, Close } from "@mui/icons-material";
import { getAllActors } from "../../utils/movieDataExtractor";
import api from "../../api/api";

const FavoriteActors = ({ setRegisterStep, setUserDetails }) => {
  const [favoriteActors, setFavoriteActors] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [actors, setActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await api.get(`/movie?page=${currentPage}`); // Adjust API endpoint for pagination
        if (response.data && response.data.movies) {
          setActors(getAllActors(response.data.movies));
          setTotalPages(response.data.totalPages); // Adjust based on your API response structure
        }
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    fetchActors();
  }, [currentPage]); // Fetch actors whenever currentPage changes

  const handleAddActor = (event, value) => {
    if (value && !favoriteActors.includes(value)) {
      setFavoriteActors([...favoriteActors, value]);
      setSearchValue(""); // Reset search value after adding actor
    }
  };

  const handleRemoveActor = (name) => {
    setFavoriteActors(favoriteActors.filter((actor) => actor !== name));
  };

  const onNextClick = () => {
    setUserDetails((prev) => ({ ...prev, favoriteActors }));
    setRegisterStep((prev) => prev + 1);
  };

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant='h4'>Tell us about your favorite actors</Typography>
      <Autocomplete
        options={actors}
        getOptionLabel={(option) => option}
        value={searchValue}
        onChange={handleAddActor}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Search for an actor'
            variant='outlined'
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
      />
      <Grid container spacing={2}>
        {favoriteActors.map((actor, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <Stack
                direction='column'
                alignItems='center'
                spacing={1}
                padding={2}
              >
                <Avatar>{actor[0]}</Avatar>
                <CardContent>
                  <Typography variant='h6'>{actor}</Typography>
                </CardContent>
                <IconButton onClick={() => handleRemoveActor(actor)}>
                  <Close />
                </IconButton>
              </Stack>
            </Card>
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

export default FavoriteActors;
