import { useDispatch, useSelector } from "react-redux"
import { getMovie } from "../../store/movies";
import { useNavigate } from "react-router-dom";
import './index.scss'


const MoviePoster = ({ movie }) => {
    const navigate = useNavigate();
    const MOVIE_LINK = "https://image.tmdb.org/t/p/";

    const handleMoviePosterClick = (movie) => {
        navigate(`/movie/${movie.id}`)
    }

    return(
        <div className="movie-poster-container">
            <div className="movie-poster">
                <img src={movie?.posterPath ? `${MOVIE_LINK.concat(movie?.posterPath)}` : '/movie-poster.png'} onClick={() => handleMoviePosterClick(movie)}/>
            </div>
            <div >
                <h2 id="movie-title">{movie?.title}</h2>
            </div>
        </div>
    )

}

export default MoviePoster