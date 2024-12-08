export const getAllActors = (allMovies) => {
    const actors = []
    for (let i = 0; i < allMovies.length; i++) {
        if (allMovies[i].cast) {
            const movieActors = allMovies[i].cast.split(", ")
            for (let j = 0; j < movieActors.length; j++) {
                if (!actors.includes(movieActors[j])) {
                    actors.push(movieActors[j])
                }
            }
        }

    }
    console.log('actors in movieDataExtractor: ', actors)
    return actors
}

export const getAllGenres = (allMovies) => {
    const genres = []
    for (let i = 0; i < allMovies.length; i++) {
        if (allMovies[i].genres) {
            const movieGenres = allMovies[i].genres.split(", ")
            for (let j = 0; j < movieGenres.length; j++) {
                if (!genres.includes(movieGenres[j])) {
                    genres.push(movieGenres[j])
                }
            }
        }

    }
    return genres
}