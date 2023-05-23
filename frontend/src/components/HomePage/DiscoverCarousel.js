import MoviePoster from "./MoviePoster";
import { getMovies, fetchDiscoverMovies, useMovieSlice } from "../../store/movies";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './index.scss';
import { userLikedMovie, userUnlikedMovie } from "../../store/session";
import { useCarousel } from "../../store/carousel";

const DiscoverCarousel = ({ setSelectedMovie }) => {
    const dispatch = useDispatch();
    const movieSlice = useMovieSlice();
    const [movies, setMovies] = useState([])
    const sessionUser = useSelector(state => state.session.user);
    const { currentIndex, increment, decrement } = useCarousel();
    const currentMovie = useMemo(() => movieSlice[movies[currentIndex]], [movieSlice, movies, currentIndex]);
    const currentMovieLiked = useMemo(() => {
        if (!currentMovie || !sessionUser) return false;
        for (let i in sessionUser.likedMovies) {
            const likedMovieId = sessionUser.likedMovies[i];
            if ([currentMovie._id, currentMovie.tmdbId, currentMovie.id].includes(likedMovieId)) {
                setSelectedMovie(currentMovie);
                return true;
            }
        }
        return false;
    }, [currentMovie, sessionUser]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchDiscoverMovies(currentPage))
            .then(({ results }) => setMovies(prev => [...new Set([...prev, ...results])]));
    }, [dispatch, currentPage]);

    useEffect(() => {
        console.log(movies)
    }, [movies]);

    const handlePrevClick = () => {
        decrement();
        setSelectedMovie();
    }

    const handleNextClick = () => {
        if (movies.length - currentIndex < 5)
            setCurrentPage(prev => prev + 1);
        increment();
        setSelectedMovie();
    }

    const handleDislikeButtonClick = () => {
        dispatch(userUnlikedMovie(currentMovie.id || currentMovie._id || currentMovie.tmdbId));
        setSelectedMovie();
        handleNextClick();
    }

    const handleLikeButtonClick = () => {
        dispatch((currentMovieLiked ? userUnlikedMovie : userLikedMovie)(currentMovie.id || currentMovie._id || currentMovie.tmdbId));
        setSelectedMovie(currentMovie);
    }

    const MOVIE_LINK = "https://image.tmdb.org/t/p/original";

    return(
        <>
            <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrevClick} className="arrow" visibility={currentIndex === 0 ? 'hidden' : 'visible'} />
            <img src={currentMovie?.backdropPath ? MOVIE_LINK.concat(currentMovie?.backdropPath) : '/backdrop.png'} className="background-image"/>
            <div className="movie-poster-container">
                <MoviePoster movie={currentMovie} className="movie-poster-component" />
                <div className="like-options">
                    <FontAwesomeIcon icon={faThumbsDown} className={`thumb-down ${false ? 'active' : null}`} onClick={handleDislikeButtonClick}/>
                    <FontAwesomeIcon icon={faThumbsUp} className={`thumb-up ${currentMovieLiked ? 'active' : undefined}`} onClick={handleLikeButtonClick}/>
                </div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} onClick={handleNextClick} className="arrow" visibility={currentIndex === movies.length - 1 ? 'hidden' : 'visible'} />
        </>
    )
}

export default DiscoverCarousel