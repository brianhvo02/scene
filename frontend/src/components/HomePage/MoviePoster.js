import { useDispatch, useSelector } from "react-redux"
import { getMovie } from "../../store/movies";

const MoviePoster = (movie) => {
    const dispatch = useDispatch();
    const movie = useSelector(getMovie(movie?.id));
    const MOVIE_LINK = "https://image.tmdb.org/t/p/original/"
    // add like/dislike
    //AiTwotoneLike
    //AiTwotoneDislike

    return(
        <div className="movie-poster-container">
            <div className="movie-poster">
                <img src={MOVIE_LINK + movie?.posterPath}/>
            </div>
            <div className="movie-title">
                <h2>{movie?.title}</h2>
            </div>
        </div>
    )

}

export default MoviePoster