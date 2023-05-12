import { Router } from "express";
import validateCommentInput from "../validations/comment";
import { requireUser } from "../config";
import Movie from "../models/Movie";
import Comment from "../models/Comment";
const router = Router({ mergeParams: true });


router.get('/:id', async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        return res.json(comment);
    }
    catch (err) {
        const error = new Error('Comment not found');
        error.statusCode = 404;
        error.errors = { message: 'No comment found with that id' };
        return next(error);
    }
});

router.post('/', requireUser, validateCommentInput, async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const newComment = new Comment ({
            user: req.user._id,
            body: req.body.body,
            childrenComment: []
        });

        let comment = await newComment.save();
        let movie = await Movie.findOne({ [movieId.length == 24 ? '_id' : 'tmdbId']: movieId });
        movie.comments.push(comment);
        await movie.save();
        sendMovie(movie, res);
    }
    catch (err) {
        next(err);
    };
});

router.delete('/:id', requireUser, async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const comment = await Comment.findById(req.params.id);
            if (!comment) {
                const error = new Error('Comment not found');
                error.statusCode = 404;
                error.errors = { message: 'No comment found with that id' };
                return next(error);
            }
            if (comment.user.toString() !== req.user._id.toString()) {
                const error = new Error('Unauthorized');
                error.statusCode = 401;
                error.errors = { message: 'Unauthorized' };
                return next(error);
            }
            await Comment.findByIdAndDelete(req.params.id);
            let movie = await Movie.findOne({ [movieId.length !== 24 ? 'tmdbId' : '_id']: movieId });
            await movie.comments.remove(req.params.id);
            await movie.save();
            sendMovie(movie, res);
    }
    catch (err) {
        next(err);
    }
})

router.patch('/:id', requireUser, validateCommentInput, async (req, res, next) => {
    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            error.errors = { message: 'No comment found with that id' };
            return next(error);
        }
        if (comment.user.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.errors = { message: 'Unauthorized' };
            return next(error);
        }
        comment = await Comment.findByIdAndUpdate(req.params.id, {
            body: req.body.body,
        }, {new: true});
        return res.json(comment);
    }
    catch (err) {
        next(err);
    }
});

export default router;