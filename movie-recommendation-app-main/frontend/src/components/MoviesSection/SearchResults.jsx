import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // For accessing query params
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import api from "../../api/api";
import Sidebar from "../Sidebar/Sidebar";
import SearchForm from "./SearchForm";
import Movies from "./Movies";

const SearchResults = () => {
  const location = useLocation(); // Get current location to access search query
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("q"); // Extract 'q' param from URL

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) return; // Don't fetch if no query

      try {
        setIsLoading(true);
        const response = await api.get(
          `/movieSearch?q=${encodeURIComponent(query)}`
        );
        setSearchedMovies(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (searchedMovies.length === 0) {
    return <Typography>No results found for "{query}".</Typography>;
  }

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
        <SearchForm />
        <>
          <Movies title='Search Results' movies={searchedMovies} isNewest={false} />
          <Button
            onClick={() => setSearched(false)}
            sx={{ marginTop: 2 }}
            variant='outlined'
          >
            Clear Search
          </Button>
        </>
      </Box>
    </Stack>
  );
};

export default SearchResults;
