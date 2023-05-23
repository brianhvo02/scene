import { useEffect } from "react";
import { fetchMovie } from "../../store/movies";
import { useDispatch, useSelector } from "react-redux";
import { getMovie } from "../../store/movies";
import { useNavigate } from "react-router-dom";

const LikedMovies = ({movieId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const movie = useSelector(getMovie(movieId));
    const MOVIE_LINK = 'https://image.tmdb.org/t/p/original';
    
    useEffect(() => {
        dispatch(fetchMovie(movieId));
    }, [dispatch]);

    return (
        <div className="liked-movie-container">
            <h1>{movie?.title}</h1>
            <img 
                src={
                    movie?.posterPath 
                        ? `${MOVIE_LINK.concat(movie?.posterPath)}` 
                        : '/movie-poster.png'
                }
                onClick={
                    () => navigate(`/movie/${movieId}`)
                }
            />
        </div>
    )
}

export default LikedMovies;