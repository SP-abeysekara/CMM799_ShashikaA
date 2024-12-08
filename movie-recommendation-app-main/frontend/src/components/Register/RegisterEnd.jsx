// import React from "react";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import { useNavigate } from 'react-router-dom';
// import { MovieCreation } from "@mui/icons-material";
// import api from '../../api/api'

// const RegisterEnd = (userDetails) => {

//   console.log(userDetails)

//   const navigate = useNavigate();

//   const user = {
//     firstName: userDetails.firstName,
//     lastName: userDetails.lastName,
//     email: userDetails.email,
//     password: userDetails.password,
//   }



//   const handleClick = () => {
//     console.log("reg user", userDetails)
//     api.post('/user', userDetails).then((response) => {
//       console.log(response);
//       if (response.status === 201) {
//         navigate('/movies'); // Replace '/movies' with the path to your Movies component
//       }
//     }).catch((error) => {
//       console.log(error.response?.data?.message || 'An error occurred');
//     });
//   };

//   return (
//     <>
//       <Typography variant="h4">
//         Let’s Discover Awesome Movies and Shows
//       </Typography>
//       <Button
//         startIcon={<MovieCreation />}
//         variant="contained"
//         color="primary"
//         onClick={handleClick}
//       >
//         Let's Go
//       </Button>
//     </>
//   );
// };

// export default RegisterEnd;


import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import { MovieCreation } from "@mui/icons-material";
import api from '../../api/api'

const RegisterEnd = ({ userDetails }) => {  // Changed to destructure userDetails prop

  const navigate = useNavigate();

  const handleClick = async () => {
    await api.post('/user', userDetails)  // Changed to '/users' to match your API endpoint
      .then((response) => {
        //save user id in local storage
        localStorage.setItem('userId', response.data._id)
        const userFav = {
          "user_id": response.data._id,
          "favorite_actors": userDetails.favoriteActors,
          "favorite_films": userDetails.favoriteMovies,
          "favorite_genres": userDetails.favoriteGenres,
        }
        api.post('/userFavorites', userFav)
          .then((response) => {
            if (response.status === 201) {
              navigate('/movies');
            }
          })
          .catch((e) => {
            console.error("error occured while posting  user favorites", e);
          })
      })
      .catch((error) => {
        console.log(error.response?.data?.message, 'An error occurred while user  registration');
      });
  };

  return (
    <>
      <Typography variant="h4">
        Let's Discover Awesome Movies and Shows
      </Typography>
      <Button
        startIcon={<MovieCreation />}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Let's Go
      </Button>
    </>
  );
};

export default RegisterEnd;