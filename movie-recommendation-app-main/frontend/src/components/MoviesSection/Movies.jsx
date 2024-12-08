import React from "react";
import { Grid, Typography } from "@mui/material";
import MovieCard from "../Card/MovieCard";

const Movies = ({ title, movies, isNewest }) => {
  return (
    <>
      <Typography variant='h5' gutterBottom>
        {title}
      </Typography>
      {movies.length > 0 ? (
        <Grid container spacing={2}>
          {movies.map((movie, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <MovieCard {...movie} movie={movie} isNewest={isNewest} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant='body1'>No movies found</Typography>
      )}
    </>
  );
};

export default Movies;
