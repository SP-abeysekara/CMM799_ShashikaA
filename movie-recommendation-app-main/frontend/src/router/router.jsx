import { createBrowserRouter } from "react-router-dom";
import GetStarted from "../components/GetStarted/GetStarted";
import Layout from "../pages/Layout";
import Register from "../components/Register/Register";
import Login from "../components/Login/Login";
import MoviesSection from "../components/MoviesSection/MoviesSection";
import MovieDetail from "../components/MoviesSection/MovieDetail";
import SearchResults from "../components/MoviesSection/SearchResults";
import NewestMovies from "../components/MoviesSection/NewestMovies";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <GetStarted /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/movies", element: <MoviesSection /> },
      { path: "/newestMovies", element: <NewestMovies /> },
      { path: "/movies/:movieId", element: <MovieDetail /> },
      { path: "/search", element: <SearchResults /> },
    ],
  },
]);

export default router;
