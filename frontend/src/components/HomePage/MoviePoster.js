import { useDispatch, useSelector } from "react-redux"
import { getMovie } from "../../store/movies";
import { FontAwesomeIcon } from '@fortawesome/free-solid-svg-icons'
import './index.scss'


const MoviePoster = ({ movie }) => {
    const MOVIE_LINK = "https://image.tmdb.org/t/p/original";

    return(
        <div className="movie-poster-container">
            <div className="movie-poster">
                <img src={`${MOVIE_LINK.concat(movie?.posterPath)}`}/>
            </div>
            <div className="movie-title">
                <h2>{movie?.title}</h2>
            </div>
        </div>
    )

}

export default MoviePoster