import MoviePoster from "./MoviePoster";
import { getMovies, fetchDiscoverMovies } from "../../store/movies";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './index.scss';
import { userLikedMovie, userUnlikedMovie } from "../../store/session";

const DiscoverCarousel = ({ setSelectedMovie }) => {
    const dispatch = useDispatch();
    const [movies, setMovies] = useState([])
    const sessionUser = useSelector(state => state.session.user);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentMovie = useMemo(() => movies[currentIndex], [movies, currentIndex]);
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
    }, [currentMovie, sessionUser])

    useEffect(()=> {
        dispatch(fetchDiscoverMovies())
            .then(({ movies, results }) => setMovies(prev => prev.concat(results.map(result => movies[result]))));
    }, [dispatch]);

    const handlePrevClick = () => {
        setCurrentIndex(prev => prev === 0 ? prev : prev - 1);
        setSelectedMovie();
    }

    const handleNextClick = () => {
        setCurrentIndex(prev => prev + 1);
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
            <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrevClick} className="arrow"/>
            <img src={currentMovie?.backdropPath ? MOVIE_LINK.concat(currentMovie?.backdropPath) : '/backdrop.png'} className="background-image"/>
            <div className="movie-poster-container">
                <MoviePoster movie={currentMovie} className="movie-poster-component" />
                <div className="like-options">
                    <FontAwesomeIcon icon={faThumbsDown} className={`thumb-down ${false ? 'active' : null}`} onClick={handleDislikeButtonClick}/>
                    <FontAwesomeIcon icon={faThumbsUp} className={`thumb-up ${currentMovieLiked ? 'active' : undefined}`}  onClick={handleLikeButtonClick}/>
                </div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} onClick={handleNextClick} className="arrow"/>
        </>
    )
}

export default DiscoverCarousel