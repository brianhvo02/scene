import MoviePoster from "./MoviePoster";
import { getMovies, fetchDiscoverMovies, useMovieSlice } from "../../store/movies";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './index.scss';
import { userDislikedMovie, userLikedMovie, userUndislikedMovie, userUnlikedMovie } from "../../store/session";
import { addMovies, incrementPage, useCarousel } from "../../store/carousel";
import { fetchGenres, useGenreSlice } from "../../store/genres";
import _ from 'lodash';

const DiscoverCarousel = ({ setSelectedMovie }) => {
    const dispatch = useDispatch();
    const movieSlice = useMovieSlice();

    const sessionUser = useSelector(state => state.session.user);
    const { movies, currentIndex, increment, decrement, currentPage } = useCarousel();
    const currentMovie = useMemo(() => movieSlice[movies[currentIndex]], [movieSlice, movies, currentIndex]);
    const currentMovieLiked = useMemo(() => {
        if (!currentMovie || !sessionUser || _.isEmpty(sessionUser)) return false;
        return ![currentMovie._id, currentMovie.tmdbId, currentMovie.id].every(id => !sessionUser.likedMovies.includes(id));
    }, [currentMovie, sessionUser]);
    const currentMovieDisliked = useMemo(() => {
        if (!currentMovie || !sessionUser || _.isEmpty(sessionUser)) return false;
        return ![currentMovie._id, currentMovie.tmdbId, currentMovie.id].every(id => !sessionUser.dislikedMovies.includes(id));
    }, [currentMovie, sessionUser]);

    useEffect(() => {
        if (sessionUser) {
            dispatch(fetchDiscoverMovies(currentPage))
                .then(
                    ({ results }) => 
                        dispatch(addMovies({
                            results,
                            movies: sessionUser.dislikedMovies.concat(sessionUser.likedMovies)
                        }))
                );
        }
    }, [dispatch, currentPage, sessionUser]);

    const handlePrevClick = () => {
        decrement();
        setSelectedMovie();
    }

    const handleNextClick = () => {
        if (movies.length - currentIndex < 5) {
            dispatch(incrementPage());
        }
        increment();
        setSelectedMovie();
    }

    const handleDislikeButtonClick = () => {
        dispatch((currentMovieDisliked ? userUndislikedMovie : userDislikedMovie)(currentMovie));
        setSelectedMovie();
        if (!currentMovieDisliked) handleNextClick();
    }

    const handleLikeButtonClick = () => {
        dispatch((currentMovieLiked ? userUnlikedMovie : userLikedMovie)(currentMovie));
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
                    <FontAwesomeIcon icon={faThumbsDown} className={`thumb-down ${currentMovieDisliked ? 'active' : null}`} onClick={handleDislikeButtonClick}/>
                    <FontAwesomeIcon icon={faThumbsUp} className={`thumb-up ${currentMovieLiked ? 'active' : undefined}`} onClick={handleLikeButtonClick}/>
                </div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} onClick={handleNextClick} className="arrow" visibility={currentIndex === movies.length - 1 ? 'hidden' : 'visible'} />
        </>
    )
}

export default DiscoverCarousel