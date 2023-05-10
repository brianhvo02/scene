import { Router } from 'express';
const router = Router({ mergeParams: true });
import Rating from "../models/Rating";
import { requireUser } from "../config";
import Movie from "../models/Movie";


router.post('/', requireUser, validateRatingInput, async(req, res, next) => {
    try {
        const newRating = new Rating({
            rating: req.body.rating,
            rater: req.user._id
        });

        let rating = await newRate.save();
        let movie = await Movie.findById(req.params.movieId);

        movie.ratings.push(rating);
        movie.save();
        rating = await rating.populate('rater','_id username')
        return res.json(rating);
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
        error.statusCode= 404;
        error.errors = { message: 'No rating found with that id' };
        return next(error);
    }
});

router.delete('/:id', requireUser, async(req, res, next) => {
    try {
        const rating = await Rating.findById(req.params.id);
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
        return res.json(rating);
    }
    catch (err) {
        next(err);
    }
});

export default router;