import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import logo from "../../assets/logo.png";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  CircularProgress,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NewestMovies from "../MoviesSection/NewestMovies"; // adjust import path if necessary

export default function Sidebar() {
  const [favorites, setFavorites] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("movies");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/userFavorites/${userId}`);
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to fetch favorites. Please try again later.");
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // const handleItemClick = async (item) => {
  //   try {
  //     let response;
  //     if (activeCategory === 'actors') {
  //       response = await api.get(`/moviesByActor?actor=${item}`);
  //     } else if (activeCategory === 'genres') {
  //       response = await api.get(`/moviesByGenre?genre=${item}`);
  //     } else {
  //       navigate(`/movies/${item}`); // For movies, navigate directly
  //       return;
  //     }

  //     if (response.data.length > 0) {
  //       console.log('Movies:', response.data); // Display movies in the console (for testing)
  //       // Optionally, navigate to a new route or display results within the sidebar
  //     } else {
  //       alert('No movies found.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching movies:', error);
  //     alert('Failed to fetch movies. Please try again.');
  //   }
  // };
  const handleItemClick = async (item) => {
    let path;
    if (activeCategory === "actors") {
      path = `/movies?actor=${item}`;
    } else if (activeCategory === "genres") {
      path = `/movies?genre=${item}`;
    } else {
      path = `/movies/${item}`; // Default for movies
    }
    navigate(path); // Navigate to MoviesSection with the relevant query
  };

  const [showNewestMovies, setShowNewestMovies] = useState(false);
  const [newstMovies, setNewestMovies] = useState([]);

  const handleShowNewestMovies = () => {
    setShowNewestMovies(true);
    navigate("/newestMovies");
  };

  const handleNewestMovies = () => {

  };

  const renderFavoritesList = () => {
    if (!favorites) return null;

    switch (activeCategory) {
      case "movies":
        return favorites.favorite_films?.map((film) => (
          <ListItem
            button
            key={film.id}
            onClick={() => handleItemClick(film.movie_id)}
            sx={{
              color: "#ffffff",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {film?.title?.charAt(0).toUpperCase() + film?.title?.slice(1)}
            {/* {{ film.title.charAt(0).toUpperCase() + film.title.slice(1) }} */}
          </ListItem>
        ));
      case "actors":
        return favorites.favorite_actors?.map((actor, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleItemClick(actor, "actors")}
            sx={{
              color: "#ffffff",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {actor?.charAt(0).toUpperCase() + actor?.slice(1)}
          </ListItem>
        ));
      case "genres":
        return favorites.favorite_genres?.map((genre, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleItemClick(genre, "genres")}
            sx={{
              color: "#ffffff",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {genre?.charAt(0).toUpperCase() + genre?.slice(1)}
          </ListItem>
        ));
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: 380,
        backgroundColor: "#121212",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "6px",
      }}
    >
      <img width={350} src={logo} alt="Logo"
        onClick={() => navigate("/movies")}
      />
      <Box
        sx={{
          p: "20px",
          mb: 4,
          mt: 3,
          backgroundColor: "#1E1E1E",
          borderRadius: 0.3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LibraryBooksIcon sx={{ color: "#ffffff", mr: 1 }} />
          <Typography variant="h6" sx={{ color: "#ffffff" }}>
            Your Library
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          {["movies", "actors", "genres"].map((category) => (
            <Button
              key={category}
              variant="contained"
              sx={{
                color: "#FFFFFF",
                textTransform: "none",
                backgroundColor:
                  activeCategory === category ? "#333" : "#1E1E1E",
              }}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </Box>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List sx={{ backgroundColor: "#1E1E1E", borderRadius: "8px" }}>
            {renderFavoritesList()}
          </List>
        )}
      </Box>

      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowNewestMovies}
        >
          Newest Movies
        </Button>

        {/* {showNewestMovies && (
          <Box mt={3}>
            <NewestMovies />
          </Box>
        )} */}
      </Box>
    </Box>
  );
}
