import React, { useState } from "react";
import logo from "../../assets/logo.png";
import FilmBackground from "../FilmBackground/FilmBackground";
import FavoriteActors from "./FavoriteActors";
import FavoriteGenres from "./FavoriteGenres";
import FavoriteMovies from "./FavoriteMovies";
import RegisterEnd from "./RegisterEnd";
import RegisterHome from "./RegisterHome";

const Register = () => {
  const [registerStep, setRegisterStep] = useState(0);
  const [userDetails, setUserDetails] = useState({});

  console.log("user details", userDetails);

  const getView = (step) => {
    switch (step) {
      case 0:
        return (
          <RegisterHome
            setRegisterStep={setRegisterStep}
            setUserDetails={setUserDetails}
          />
        );
      case 1:
        return (
          <FavoriteMovies
            setRegisterStep={setRegisterStep}
            setUserDetails={setUserDetails}
          />
        );
      case 2:
        return (
          <FavoriteActors
            setRegisterStep={setRegisterStep}
            setUserDetails={setUserDetails}
          />
        );
      case 3:
        return (
          <FavoriteGenres
            setRegisterStep={setRegisterStep}
            setUserDetails={setUserDetails}
          />
        );
      case 4:
        return <RegisterEnd userDetails={userDetails} />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <FilmBackground>
        <img width={400} src={logo} alt='' srcset='' />
        {getView(registerStep)}
      </FilmBackground>
    </>
  );
};

export default Register;
