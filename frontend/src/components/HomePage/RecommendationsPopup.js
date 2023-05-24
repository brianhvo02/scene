import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRecommendedMovies, getMovieSlice, getMovies } from "../../store/movies";
import MoviePoster from "./MoviePoster";

const RecommendationsPopup = ({ movie }) => {
    const dispatch = useDispatch();
    const movieSlice = useSelector(getMovieSlice);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        dispatch(fetchRecommendedMovies(movie.id || movie.tmdbId || movie._id))
            .then(({results}) => setMovies(prev => [
                ...new Set([ ...prev, ...results ])
            ]))
    }, [movie])

    return(
        <div className="recommendations-container">
        {movies.map(movieId => {
            return(
                <MoviePoster movie={movieSlice[movieId]} key={movieId} className="recommendations-movie-poster"/>
            )
        })}
        </div>
    )
}

export default RecommendationsPopup