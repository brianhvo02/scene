import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovie, getMovie } from "../../store/movies";
import EventCreateForm from "../EventCreateForm";
import './index.scss'
import { useEffect } from "react";

const MovieShow = () => {
    const { movieId } = useParams();
    const movie = useSelector(getMovie(movieId));
    const MOVIE_LINK = "https://image.tmdb.org/t/p/original";
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMovie(movieId));
    }, [dispatch]);

    return(
        <>
            <img src={`${MOVIE_LINK.concat(movie?.backdropPath)}`} alt="" className="background-image"/>
            <div className="movie-info-container">
                <div className="movie-info-left">
                    <h2>{movie?.title}</h2>
                    <h3>Movie Description:</h3>
                    <p>{movie?.overview}</p>
                    <div className="movie-show-event-button">
                        <EventCreateForm />
                    </div>
                </div>
                
                <div className="movie-info-right">
                    <img src={`${MOVIE_LINK.concat(movie?.posterPath)}`} alt=""/>
                </div>
            </div>
            <div className="background-gradient"></div>
            <div className="comments">
                <p>Future Comments</p>
            </div>
            {/* <Comments /> */}
            {/* <Events /> */}
        </>
    )
}

export default MovieShow;