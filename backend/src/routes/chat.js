import { Router } from 'express';
import Movie from '../models/Movie';
import { palmAPIKey } from '../config';
import { GoogleAuth } from 'google-auth-library';
import { DiscussServiceClient } from '@google-ai/generativelanguage';
const router = Router({ mergeParams: true });

const MODEL_NAME = 'models/chat-bison-001';

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(palmAPIKey)
});

router.post('/', async (req, res, next) => {
    const { movieId } = req.params;
    const messages = req.body;
    
    const movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId });
    if (!movie) {
        const error = new Error('Movie not found');
        error.statusCode = 404;
        error.errors = { message: 'No movie found with that id' };
        return next(error);
    }

    const result = await client.generateMessage({
        model: MODEL_NAME,
        prompt: {
            context: `Respond to all questions as an inquiry about the movie ${movie.title}.`,
            messages
        }
    });

    res.status(200).json({
        content: result[0].candidates[0].content
    });
});

export default router;