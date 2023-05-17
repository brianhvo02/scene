import { Router } from "express";
const router = Router();
import Movie from "../models/Movie";
import validateMovieInput from "../validations/movie";
import eventRouter from "./events";
import commentRouter from "./comments";
import fandangoRouter from "./fandango";
import ratingRouter from "./ratings";
import chatRouter from "./chat";
import { fetchTMDB } from "./tmdb";
import { extractAllowedParams } from "../utils";


router.use("/:movieId/events", eventRouter);
router.use("/:movieId/comments", commentRouter);
router.use("/:movieId/theaters", fandangoRouter);
router.use("/:movieId/ratings", ratingRouter);
router.use("/:movieId/chat", chatRouter);

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
        // return res.json(movieRes);
        movieRes.tmdb_id = movieRes.id;
        movieRes.genre_ids = movieRes.genres.map(genre => genre.id);
        movieRes.certification = movieRes.release_dates.results
            .find(result => result['iso_3166_1'] === 'US')?.release_dates
            .map(({ certification }) => certification)
            .find(cert => cert.length > 0);
        movieRes.alternative_titles = movieRes.alternative_titles.titles
            .filter(title => title['iso_3166_1'] === 'US')
            ?.map(({ title }) => title);
        movie = new Movie(extractAllowedParams(allowedParams, movieRes));
        movie = await movie.save();
    }
    sendMovie({movie}, res);
});

export const sendMovie = async ({movie, user}, res, eventId) => {
    movie = await movie.populate([{
        path: 'events',
        populate: [
            {
                path: 'host',
                model: 'User',
                select: '_id username email'
            },
            {
                path: 'attendees',
                model: 'User',
                select: '_id username email'
            }
        ]
    }, {
        path: 'ratings',
        populate: {
            path: 'rater',
            model: 'User',
            select: '_id username email'
        }
    }, 'comments']);

    const populateChildren = async comment => {
        await comment.populate([
            {
                path: 'author',
                select: '_id username email'
            },
            {
                path: 'childrenComments'
            }
        ]);

        if (comment.childrenComments.length) return Promise.all(comment.childrenComments.map(populateChildren));
    }
    
    await Promise.all(movie.comments.map(comment => 
        (comment.childrenComments.length) 
            ? populateChildren(comment)
            : comment.populate([
                {
                    path: 'author',
                    select: '_id username email'
                },
                {
                    path: 'childrenComments'
                }
            ])
    ));

    const userInfo = user ? {
        _id: user._id,
        username: user.username,
        email: user.email,
        genreIds: user.genreIds,
        likedMovies: user.likedMovies,
        events: user.events,
        photoUrl: user.hasProfilePic ? await getSignedUrl(client, command, {expiresIn: 3600}) : null
    } : null;
    
    return res.json({
        eventId,
        movies: {
            [movie.tmdbId]: movie
        },
        session: {
            user: userInfo
        }
    });
}

export default router;
