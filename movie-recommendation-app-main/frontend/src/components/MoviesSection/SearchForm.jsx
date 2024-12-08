import React, { useState } from "react";
import { Paper, IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search query
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`); // Navigate to the search results page with query
    }
  };

  return (
    <Paper
      component='form'
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        mb: 4,
        backgroundColor: "#1E1E1E",
      }}
      onSubmit={handleSearch} // Call handleSearch on submit
    >
      <IconButton sx={{ p: "10px" }} aria-label='menu'>
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, color: "#ffffff" }}
        placeholder='Search New Arrivals...'
        inputProps={{ "aria-label": "search new arrivals" }}
        value={searchQuery}
        onChange={handleSearchChange} // Update search query state on input change
      />
      <IconButton type='submit' sx={{ p: "10px" }} aria-label='search'>
        <SearchIcon />
      </IconButton>
      <IconButton sx={{ p: "10px" }} aria-label='settings'>
        <SettingsIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchForm;
