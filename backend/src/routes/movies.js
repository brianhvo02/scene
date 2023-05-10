import { Router } from "express";
const router = Router();
import Movie from "../models/Movie";
import validateMovieInput from "../validations/movie";
import eventRouter from "./events";
import fandangoRouter from "./fandango";

router.use("/:movieId/events", eventRouter);
router.use("/:movieId/theatres", fandangoRouter);

router.get('/:movieId', async (req, res, next) => {
    try {
        const { movieId } = req.params;

        let movie = await Movie.findOne({ [movieId.length !== 24 ? 'tmdbId' : '_id']: movieId });

        movie = await movie.populate('events');

        return res.json(movie);
    }
    catch(err) {
        const error = new Error('Movie not found');
        error.statusCode = 404;
        error.errors = { message: 'No movie found with that id' };
        return next(error);
    }
});


router.post('/', validateMovieInput, async (req, res, next) => {
    try {
        const newMovie = new Movie({
            tmdbId: req.body.tmdbId,
            title: req.body.title,
            overview: req.body.overview,
            posterPath: req.body.posterPath,
            backdropPath: req.body.backdropPath,
            genreIds: req.body.genreIds,
            ratings: req.body.ratings,
            comments: req.body.comments,
            events: req.body.events
        });
        let movie = await newMovie.save();
        return res.json(movie);
    }
    catch(err) {
        next(err);
    };
});

export default router;
