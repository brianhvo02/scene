import MoviePoster from "./MoviePoster"
import { getMovies, fetchDiscoverMovies } from "../../store/movies"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import './index.scss'

const DiscoverCarousel = ({ setSelectedMovie }) => {
    const dispatch = useDispatch();
    const movies = useSelector(getMovies);
    const sessionUser = useSelector(state => state.session.user);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(()=> {
        dispatch(fetchDiscoverMovies(sessionUser));
    }, [dispatch])

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies?.length - 1 : prevIndex - 1));
        setSelectedMovie()
    }

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === movies?.length - 1 ? 0 : prevIndex + 1));
        setSelectedMovie()
    }

    const handleDislikeButtonClick = (movie) => {
        setSelectedMovie()
    }

    const handleLikeButtonClick = (movie) => {
        sessionUser?.likedMovies?.push(movie?._id)
        setSelectedMovie(movie)
    }

    return(
        <>
            <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrevClick} className="arrow"/>
            <div className="movie-poster-container">
                <MoviePoster movie={movies[currentIndex]} className="movie-poster-component" />
                <div className="like-options">
                    <FontAwesomeIcon icon={faThumbsDown} className="thumb-down" onClick={() => handleDislikeButtonClick(movies[currentIndex])}/>
                    <FontAwesomeIcon icon={faThumbsUp} className="thumb-up" onClick={() => handleLikeButtonClick(movies[currentIndex])}/>
                </div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} onClick={handleNextClick} className="arrow"/>
        </>
    )
}

export default DiscoverCarousel