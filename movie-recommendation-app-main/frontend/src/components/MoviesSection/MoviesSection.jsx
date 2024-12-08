
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Stack, Button } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import SearchForm from "../MoviesSection/SearchForm";
import Movies from "../MoviesSection/Movies";
import api from "../../api/api";
import recendpoint from "../../api/recommendation_api.js";
import { useCallback } from "react";


const MoviesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filteredAllMovies, setFilteredAllMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAllPage, setCurrentAllPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAllPages, setTotalAllPages] = useState(0);
  const [moviesPerPage] = useState(10);

  const location = useLocation(); // Get the query params from URL
  const navigate = useNavigate();

  // Extract actor or genre from query params
  const queryParams = new URLSearchParams(location.search);
  const actor = queryParams.get("actor");
  const genre = queryParams.get("genre");

  const fetchAllMovies = useCallback(async () => {
    console.log("Fetching movies for page:", currentAllPage);
    try {
      const response = await api.get(`/movie`, {
        params: {
          page: currentAllPage,
          limit: moviesPerPage,
        },
      });
      console.log("API Response:", response.data);
      setFilteredAllMovies(response.data.movies);
      setTotalAllPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, [currentAllPage]);

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let response;

        if (actor) {
          response = await api.get(`/moviesByActor?actor=${actor}&page=${currentPage}&limit=${moviesPerPage}`);
          setFilteredMovies(response.data.movies);
          setTotalPages(response.data.totalPages);
        } else if (genre) {
          response = await api.get(`/moviesByGenre?genre=${genre}&page=${currentPage}&limit=${moviesPerPage}`);
          setFilteredMovies(response.data.movies);
          setTotalPages(response.data.totalPages);
        } else {
          let movieData = {
            user_id: localStorage.getItem("userId"),
            top_n: 10
          }
          response = await recendpoint.post('', movieData);
          setFilteredMovies(response.data.recommendations);

        }


      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [actor, genre, currentPage, moviesPerPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextAllPage = () => {
    if (currentAllPage < totalAllPages) {
      setCurrentAllPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevAllPage = () => {
    if (currentAllPage > 1) {
      setCurrentAllPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Stack
      direction='row'
      justifyContent='center'
      spacing={2}
      sx={{ position: "relative", zIndex: 2, marginTop: 3, marginBottom: 5 }}
    >
      <Sidebar />
      <Box
        p={2}
        sx={{
          backgroundColor: "#121212",
          color: "#ffffff",
          minHeight: "100vh",
          width: 1050,
        }}
      >
        <SearchForm
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />

        {filteredMovies && (
          <>
            <Movies title='Filtered Movies' movies={filteredMovies} isNewest={false} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Box>
          </>
        )}
        <Button onClick={fetchAllMovies} variant='contained' color='primary'>
          Explore All Movies
        </Button>
        {filteredAllMovies && (
          <>
            <Movies title='Filtered All Movies' movies={filteredAllMovies} isNewest={false} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Button onClick={handlePrevAllPage} disabled={currentAllPage === 1}>
                Previous
              </Button>
              <Button
                onClick={handleNextAllPage}
                disabled={currentAllPage === totalAllPages}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default MoviesSection;
