import { useEffect } from "react";
import { fetchMovie } from "../../store/movies";
import { useDispatch, useSelector } from "react-redux";
import { getMovie } from "../../store/movies";



const LikedMovies = ({movieId}) => {
    const dispatch = useDispatch();
    const movie = useSelector(getMovie(movieId));
    const MOVIE_LINK = 'https://image.tmdb.org/t/p/original';
    

    useEffect(() => {
        dispatch(fetchMovie(movieId))

    }, [dispatch]);




    return (
        <>
            <h1>{movie?.title}</h1>
            <img src={movie?.posterPath ? `${MOVIE_LINK.concat(movie?.posterPath)}` : '/movie-poster.png'}/>
        </>
    )
}

export default LikedMovies;