import { Router } from "express";
const router = Router();
import Movie from "../models/Movie";
import validateMovieInput from "../validations/movie";
import eventRouter from "./events";
import commentRouter from "./comments";
import fandangoRouter from "./fandango";
import ratingRouter from "./ratings";


router.use("/:movieId/events", eventRouter);
router.use("/:movieId/comments", commentRouter);
router.use("/:movieId/theatres", fandangoRouter);
router.use("/:movieId/ratings", ratingRouter);


router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        let movie = await Movie.findOne({ [id.length !== 24 ? 'tmdbId' : '_id']: id });

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
