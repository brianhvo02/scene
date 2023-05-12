import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRecommendedMovies, getMovies } from "../../store/movies";
import MoviePoster from "./MoviePoster";

const RecommendationsPopup = ({ movie }) => {
    const dispatch = useDispatch();
    const movies = useSelector(getMovies);

    useEffect(() => {
        dispatch(fetchRecommendedMovies(movie?.id));
    }, [dispatch])

    return(
        <div className="recommendations-container">
        {movies.map((movie, idx) => {
            return(
                <MoviePoster movie={movie} key={idx} className="recommendations-movie-poster"/>
            )
        })}
        </div>
    )
}

export default RecommendationsPopup