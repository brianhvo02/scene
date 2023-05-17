import { Router } from "express";
import validateCommentInput from "../validations/comment";
import { requireUser } from "../config";
import Movie from "../models/Movie";
import Comment from "../models/Comment";
import { sendMovie } from './movies';
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
            author: req.user._id,
            body: req.body.body,
            parentComment: req.body.parentComment,
            childrenComment: []
        });
        let comment = await newComment.save();

        let movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId });

        if (req.body.parentComment) {
            let parentComment = await Comment.findOne({ _id: req.body.parentComment });
            parentComment.childrenComments.push(comment);
            await parentComment.save();
        } else {
            movie.comments.push(comment);
            await movie.save();
        }
        sendMovie({movie}, res);
    }
    catch (err) {
        next(err);
    };
});

// router.delete('/:commentId', requireUser, async (req, res, next) => {
//     try {
//         const { movieId, commentId } = req.params;
//         const comment = await Comment.findById(commentId);
//             if (!comment) {
//                 const error = new Error('Comment not found');
//                 error.statusCode = 404;
//                 error.errors = { message: 'No comment found with that id' };
//                 return next(error);
//             }
//             if (comment.author._id.toString() !== req.user._id.toString()) {
//                 const error = new Error('Unauthorized');
//                 error.statusCode = 401;
//                 error.errors = { message: 'Unauthorized' };
//                 return next(error);
//             }
//             await Comment.findByIdAndDelete(commentId);
//             let movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId });
//             await movie.comments.remove(req.params.id);
//             await movie.save();
//             sendMovie({movie}, res);
//     }
//     catch (err) {
//         next(err);
//     }
// });

router.patch('/:commentId', requireUser, validateCommentInput, async (req, res, next) => {
    try {
        const { movieId, commentId } = req.params;
        let comment = await Comment.findById(commentId);
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            error.errors = { message: 'No comment found with that id' };
            return next(error);
        }
        if (comment.author._id.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.errors = { message: 'Unauthorized' };
            return next(error);
        }

        comment = await Comment.findByIdAndUpdate(commentId, {
            body: req.body.body,
        }, {new: true});
        
        const movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId });
        sendMovie({movie}, res);
    }
    catch (err) {
        next(err);
    }
});

export default router;