// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Stack,
//   Typography,
//   Button,
//   Chip,
//   IconButton,
// } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import Sidebar from "../Sidebar/Sidebar";
// import SearchForm from "../MoviesSection/SearchForm";
// import { movieData } from "../../utils/movieData";
// import api from "../../api/api";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// const MoviesDetail = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredMovies, setFilteredMovies] = useState(movieData);
//   const [movie, setMovie] = useState(null);
//   const [movieIsWishlisted, setMovieIsWishlisted] = useState(false);
//   const [movieIsWatched, setMovieIsWatched] = useState(false);
//   const [movieIsLiked, setMovieIsLiked] = useState(false);

//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");
//   let { movieId } = useParams();
//   movieId = Number(movieId); // Convert the movieId to a number

//   const loadUserFavorites = () => {
//     api
//       .get(`/userFavorites/${userId}`)
//       .then((response) => {
//         const userFavorites = response.data;
//         console.log(
//           "userFavorites",
//           userFavorites,
//           userFavorites.wishlist_films[0],
//           userFavorites.wishlist_films[0] === movieId
//         );
//         const movieIsWishlisted = userFavorites.wishlist_films.some(
//           (movie) => movie === movieId
//         );
//         console.log(movieIsWishlisted);
//         const movieIsWatched = userFavorites.watched_films.some(
//           (movie) => movie === movieId
//         );
//         const movieIsLiked = userFavorites.liked_movies.some(
//           (movie) => movie === movieId
//         );
//         setMovieIsWishlisted(movieIsWishlisted);
//         setMovieIsWatched(movieIsWatched);
//         setMovieIsLiked(movieIsLiked);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   useEffect(() => {
//     loadUserFavorites();
//   }, []);



//   const addMovieInteraction = (interaction) => {
//     api
//       .post("/userInteractions", {
//         user_id: localStorage.getItem("userId"),
//         movie_id: movieId,
//         interaction_date: new Date(),
//         interaction_type: interaction,
//       })
//       .then((response) => {
//         console.log("User response updated");
//       });
//   };

//   const addToUserFavorites = (listType) => {
//     api
//       .put(`/userFavorites/${userId}/addToList`, {
//         movie_id: movieId,
//         listType: listType,
//       })
//       .then((response) => {
//         console.log(response.data);
//       });
//   };



//   useEffect(() => {
//     addMovieInteraction("clicked");
//   });

//   useEffect(() => {
//     api.get(`/movie/${movieId}`).then((response) => {
//       console.log(response.data);
//       setMovie(response.data);
//     });
//   }, []);

//   if (!movie) {
//     return <Typography variant='h5'>Movie not found</Typography>;
//   }

//   return (
//     <Stack
//       direction='row'
//       justifyContent='center'
//       spacing={2}
//       sx={{ position: "relative", zIndex: 2, marginTop: 3, marginBottom: 5 }}
//     >
//       <Sidebar />

//       <Box
//         p={2}
//         sx={{
//           backgroundColor: "#121212",
//           color: "#ffffff",
//           minHeight: "100vh",
//           width: 1050,
//         }}
//       >


//         <Typography variant='h3' gutterBottom>
//           {movie.title}
//         </Typography>

//         <img
//           src={movie.image}
//           alt={movie.title}
//           style={{ width: "80%", maxHeight: "350px", objectFit: "cover" }}
//         />
//         <Typography variant='h6' gutterBottom>
//           {movie.movie_info}
//         </Typography>
//         <Typography variant='body1' gutterBottom>
//           {movie.description}
//         </Typography>
//         {movie.cast.split(",").map((cast) => (
//           <Chip sx={{ margin: 0.5 }} key={cast} label={cast} />
//         ))}
//         <Box mt={2} display='flex' flexDirection='row' gap={2}>
//           <Button
//             variant={movieIsWishlisted ? "contained" : "outlined"}
//             color='primary'
//             startIcon={
//               movieIsWishlisted ? <CheckCircleIcon /> : <AddCircleIcon />
//             }
//             onClick={handleAddToWishlist}
//           >
//             {movieIsWishlisted ? "Added to wishlist" : "Add to wishlist"}
//           </Button>
//           <Button
//             variant={movieIsWatched ? "contained" : "outlined"}
//             color='secondary'
//             startIcon={movieIsWatched ? <CheckCircleIcon /> : <AddCircleIcon />}
//             onClick={handleWatched}
//           >
//             {movieIsWatched ? "Watched" : "Mark as Watched"}
//           </Button>
//           <IconButton
//             variant={movieIsLiked ? "contained" : "outlined"}
//             color={movieIsLiked ? "primary" : "secondary"}
//             onClick={handleLiked}
//           >
//             {movieIsLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
//           </IconButton>
//         </Box>
//       </Box>
//     </Stack>
//   );
// };

// export default MoviesDetail;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Sidebar from "../Sidebar/Sidebar";
import SearchForm from "../MoviesSection/SearchForm";
import { movieData } from "../../utils/movieData";
import api from "../../api/api";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const MoviesDetail = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(movieData);
  const [movie, setMovie] = useState(null);
  const [movieIsWishlisted, setMovieIsWishlisted] = useState(false);
  const [movieIsWatched, setMovieIsWatched] = useState(false);
  const [movieIsLiked, setMovieIsLiked] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { movieId } = useParams(); // No need to manually convert movieId to Number, React Router ensures it's a string.


  // Fetch movie details based on the new movieId
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movie/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovie();
  }, [movieId]); // Add movieId as a dependency


  const loadUserFavorites = () => {
    api
      .get(`/userFavorites/${userId}`)
      .then((response) => {
        const userFavorites = response.data;
        console.log(
          "userFavorites",
          userFavorites,
          userFavorites.wishlist_films[0],
          userFavorites.wishlist_films[0] === movieId
        );
        const movieIsWishlisted = userFavorites.wishlist_films.some(
          (movie) => {
            return movie === Number(movieId);
          }
        );

        console.log(movieIsWishlisted);
        const movieIsWatched = userFavorites.watched_films.some(
          (movie) => {
            return movie === Number(movieId);
          }
        );
        const movieIsLiked = userFavorites.liked_movies.some(
          (movie) => {
            return movie === Number(movieId);
          }
        );
        setMovieIsWishlisted(movieIsWishlisted);
        setMovieIsWatched(movieIsWatched);
        setMovieIsLiked(movieIsLiked);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadUserFavorites();
  }, [movieId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const filtered = movieData.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const addMovieInteraction = (interaction) => {
    api
      .post("/userInteractions", {
        user_id: localStorage.getItem("userId"),
        movie_id:
          parseInt(movieId)
        ,
        interaction_date: new Date(),
        interaction_type: interaction,
      })
      .then((response) => {
        console.log("User response updated");
      });
  };

  const addToUserFavorites = (listType) => {
    api
      .put(`/userFavorites/${userId}/addToList`, {
        movie_id: movieId,
        listType: listType,
      })
      .then((response) => {
        console.log(response.data);
      });
  };


  const deleteFromUserFavorites = (listType) => {
    api
      .put(`/userFavorites/${userId}/removeFromList`, {
        movie_id: movieId,
        listType: listType,
      })
      .then((response) => {
        console.log(response.data);
      });
  };

  const handleAddToWishlist = () => {
    if (movieIsWishlisted) {
      setMovieIsWishlisted(false);
      addMovieInteraction("unwishlisted");
      deleteFromUserFavorites("wishlist");
    } else {
      setMovieIsWishlisted(true);
      addMovieInteraction("wishlisted");
      addToUserFavorites("wishlist");
    }
  };

  const handleWatched = () => {
    if (movieIsWatched) {
      setMovieIsWatched(false);
      addMovieInteraction("unwatched");
      deleteFromUserFavorites("watched");
    } else {
      setMovieIsWatched(true);
      addMovieInteraction("watched");
      addToUserFavorites("watched");
    }
  };


  const handleLiked = () => {
    if (movieIsLiked) {
      setMovieIsLiked(false);
      addMovieInteraction("unliked");
      deleteFromUserFavorites("liked");
    } else {
      setMovieIsLiked(true);
      addMovieInteraction("liked");
      addToUserFavorites("liked");
    }
  };

  useEffect(() => {
    addMovieInteraction("clicked");
  });

  // useEffect(() => {
  //   api.get(`/movie/${movieId}`).then((response) => {
  //     console.log(response.data);
  //     setMovie(response.data);
  //   });
  // }, []);

  if (!movie) {
    return <Typography variant="h5">Movie not found</Typography>;
  }

  return (
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 3, mb: 5 }}>
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
          handleSearch={handleSearch}
        />

        <Typography variant="h3" gutterBottom>
          {movie?.title.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}

        </Typography>

        <img
          src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
          alt={movie.title}
          style={{ width: "80%", maxHeight: "350px", objectFit: "cover" }}
        />
        <Typography variant="h6" gutterBottom>
          {movie.movie_info}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {movie.description}
        </Typography>
        {movie.cast.split(",").map((cast) => (
          <Chip key={cast} label={cast} sx={{ m: 0.5 }} />
        ))}

        <Box mt={2} display="flex" gap={2}>
          <Button
            variant={movieIsWishlisted ? "contained" : "outlined"}
            color="primary"
            startIcon={
              movieIsWishlisted ? <CheckCircleIcon /> : <AddCircleIcon />
            }
            onClick={handleAddToWishlist}
          >
            {movieIsWishlisted ? "Added to wishlist" : "Add to wishlist"}
          </Button>
          <Button
            variant={movieIsWatched ? "contained" : "outlined"}
            color="secondary"
            startIcon={
              movieIsWatched ? <CheckCircleIcon /> : <AddCircleIcon />
            }
            onClick={handleWatched}
          >
            {movieIsWatched ? "Watched" : "Mark as Watched"}
          </Button>
          <IconButton
            color={movieIsLiked ? "primary" : "secondary"}
            onClick={handleLiked}
          >
            {movieIsLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Box>
    </Stack>
  );
};

export default MoviesDetail;
