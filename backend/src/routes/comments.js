import { Router } from "express";
import validateCommentInput from "../validations/comment";
import { requireUser } from "../config";
import Movie from "../models/Movie";

const router = Router();


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
        const newComment = new Comment ({
            userId: req.user._id,
            body: req.body.body,
            childrenComment: req.body.childrenComment,
        });

        let comment = await newComment.save();
        let movie = await Movie.findById(req.params.movieId);
        movie.comments.push(comment);
        movie.save();
        comment = await comment.populate('userId', '_id username');
        return res.json(comment);
    }
    catch (err) {
        next(err);
    };
});

router.delete('/:id', requireUser, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
            if (!comment) {
                const error = new Error('Comment not found');
                error.statusCode = 404;
                error.errors = { message: 'No comment found with that id' };
                return next(error);
            }
            if (comment.userId.toString() !== req.user._id.toString()) {
                const error = new Error('Unauthorized');
                error.statusCode = 401;
                error.errors = { message: 'Unauthorized' };
                return next(error);
            }
            await Comment.findByIdAndDelete(req.params.id);
            return res.json(comment);
    }
    catch (err) {
        next(err);
    }
})

router.patch('/:id', requireUser, validateCommentInput, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            error.errors = { message: 'No comment found with that id' };
            return next(error);
        }
        if (comment.userId.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.errors = { message: 'Unauthorized' };
            return next(error);
        }
            await Comment.findByIdAndUpdate(req.params.id, {
            body: req.body.body,
        });
    }
    catch (err) {
        next(err);
    }
});

export default router;