import { Router } from "express";
const router = Router();
import Movie from "../models/Movie";
import validateMovieInput from "../validations/movie";
import eventRouter from "./events";
import commentRouter from "./comments";
import fandangoRouter from "./fandango";
import ratingRouter from "./ratings";
import { fetchTMDB } from "./tmdb";
import { extractAllowedParams } from "../utils";


router.use("/:movieId/events", eventRouter);
router.use("/:movieId/comments", commentRouter);
router.use("/:movieId/theatres", fandangoRouter);
router.use("/:movieId/ratings", ratingRouter);

router.get('/:movieId', async (req, res, next) => {
    const { movieId } = req.params;
    let movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId });
    if (!movie && movieId.length === 24) {
        const error = new Error('Movie not found');
        error.statusCode = 404;
        error.errors = { message: 'No movie found with that id' };
        return next(error);
    } else if (!movie) {
        const allowedParams = ["tmdb_id", "title", "overview", "poster_path", "backdrop_path", "genre_ids", "alternative_titles", "runtime", "tagline", "certification"];
        const movieRes = await fetchTMDB(`/movie/${movieId}`, 'append_to_response=alternative_titles,release_dates');
        movieRes.tmdb_id = movieRes.id;
        movieRes.genre_ids = movieRes.genres.map(genre => genre.id);
        movieRes.certification = movieRes.release_dates.results
            .find(result => result['iso_3166_1'] === 'US').release_dates
            .map(({ certification }) => certification)
            .find(cert => cert.length > 0);
        movieRes.alternative_titles = movieRes.alternative_titles.titles
            .filter(title => title['iso_3166_1'] === 'US')
            .map(({ title }) => title);
        movie = new Movie(extractAllowedParams(allowedParams, movieRes));
        movie = await movie.save();
    }

    movie = await movie.populate('events');
    movie = await movie.populate('comments');
    
    return res.json({
        movies: {
            [movie.tmdbId]: movie
        }
    });
});

export default router;
