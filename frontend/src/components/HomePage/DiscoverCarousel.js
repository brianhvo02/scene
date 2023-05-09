import MoviePoster from "./MoviePoster"
import { getMovies, fetchDiscoverMovies } from "../../store/movies"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

const DiscoverCarousel = () => {
    const dispatch = useDispatch();
    const movies = useSelector(getMovies);
    const movieLength = movies.length;
    const sessionUser = useSelector(state => state.session.user);

    const [index, setIndex] = useState(0);

    useEffect(()=> {
        dispatch(fetchDiscoverMovies(sessionUser));
    }, [dispatch])

    return(
        <div className="discover component">
            <div className="movie-poster-container">
                {movies?.map((movie,idx) => {
                    return(
                        <>
                            <MoviePoster key={idx} movie={movie} className="movie-poster-component"/>
                            <h2>{movie?.title}</h2>
                        </>
                    )

                })}
                <div className="like-options">
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <FontAwesomeIcon icon={faThumbsUp}/>
                </div>
            </div>
            <div className="arrows">
                <FontAwesomeIcon icon={faChevronLeft}/>
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
        </div>
    )
}

export default DiscoverCarousel