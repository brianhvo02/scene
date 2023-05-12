import { Router } from 'express';
const router = Router({ mergeParams: true });
import Rating from "../models/Rating";
import { requireUser } from "../config";
import Movie from "../models/Movie";
import { sendMovie } from './movies';
import validateRatingInput from '../validations/rating';


router.post('/', requireUser, validateRatingInput, async(req, res, next) => {
    try {
        const { movieId } = req.params;

        const newRating = new Rating({
            rating: req.body.rating,
            rater: req.user._id
        });

        let rating = await newRating.save();
        let movie = await Movie.findOne({ [movieId.length !== 24 ? 'tmdbId' : '_id']: movieId });

        movie.ratings.push(rating);
        movie = await movie.save();
        sendMovie(movie, res);
    }
    catch(err) {
        next(err);
    }
});

router.get('/:id', async (req,res, next) => {
    try {
        const rating = await Rating.findById(req.params.id);
        return res.json(rating);
    }
    catch(err) {
        const error = new Error('Rating not found');
        error.statusCode = 404;
        error.errors = { message: 'No rating found with that id' };
        return next(error);
    }
});

router.patch('/:ratingId', requireUser, validateRatingInput, async(req, res, next) => {
    try{
        const { movieId, ratingId } = req.params;
        let rating = await Rating.findById(ratingId);
        if (!rating) {
            const error = new Error('Rating not found');
            error.statusCode = 404;
            error.errors = { message: 'No rating found with that id' };
            return next(error);
        }
        if (rating.rater.toString() !== req.user._id.toString()) {
            const error = new Error ('Unauthorized');
            error.statusCode = 401;
            error.errors = { message: 'Unauthorized' };
            return next(error);
        }
        rating = await Rating.findByIdAndUpdate(ratingId,{
            rating: req.body.rating,
        }, { new: true });
        const movie = await Movie.findOne({ [movieId.length !== 24 ? 'tmdbId' : '_id']: movieId });
        sendMovie(movie, res);
    }
    catch(err) {
        next(err);
    }
});

router.delete('/:ratingId', requireUser, async(req, res, next) => {
    try {
        const { movieId, ratingId } = req.params 
        const rating = await Rating.findById(ratingId);
        if (!rating) {
            const error = new Error('Rating not found');
            error.statusCode= 404;
            error.errors = { message: 'No rating found with that id' };
            return new(error);
        }
        if (rating.rater.toString() !== req.user._id.toString()) {
            const error = new Error ('Unauthorized');
            error.statusCode = 401;
            error.errors = { message: 'You are not authorzied to delete this rating' };
            return next(error);
        }
        await Rating.findByIdAndDelete(req.params.id);
        let movie = await Movie.findOne({ [movieId.length !== 24 ? 'tmdbId' : '_id']: movieId });
        await movie.ratings.remove(req.params.id);
        await movie.save();
        sendMovie(movie, res);
    }
    catch (err) {
        next(err);
    }
});

export default router;