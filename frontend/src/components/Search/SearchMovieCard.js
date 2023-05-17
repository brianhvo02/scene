import { useNavigate } from "react-router-dom";

const SearchMovieCard = ({ movie }) => {
    const MOVIE_LINK = "https://image.tmdb.org/t/p/original";
    const navigate = useNavigate();

    return(
        <div className="movie-card-container" onClick={() => navigate(`/movie/${movie.id}`)}>
            <div className="movie-card-container-left">
                <img src={movie?.posterPath ? `${MOVIE_LINK.concat(movie.posterPath)}` : '/movie-poster.png'} alt={`${movie?.title} movie poster`} />
            </div>
            <div className="movie-card-container-right">
                <h1>{movie.title}</h1>
                <p>{movie.overview ? movie.overview : "This movie does not have description yet, please come back later!"}</p>
            </div>
        </div>

    )
}

export default SearchMovieCard;