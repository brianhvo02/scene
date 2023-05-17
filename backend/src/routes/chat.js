import { Router } from 'express';
import Movie from '../models/Movie';
import { extractAllowedParams } from '../utils';
import { bardAPIKey, requireUser } from '../config';
import BardAPI, { Configuration } from 'bard-node';
const router = Router({ mergeParams: true });

const config = new Configuration({
    apiKey: bardAPIKey
})

router.get('/', async (req, res, next) => {
    const { movieId } = req.params;
    const { query, c, r, rc } = req.query;

    const bard = new BardAPI(config);
    bard.previousQuery = { 
        c: c || '', 
        r: r || '', 
        rc: rc || '' 
    };
    const movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId });
    if (!movie) {
        const error = new Error('Movie not found');
        error.statusCode = 404;
        error.errors = { message: 'No movie found with that id' };
        return next(error);
    }

    const bardRes = await bard.generateQuery(`${query} - movie: ${movie.title}`);

    res.status(200).json({
        previousQuery: bard.previousQuery,
        response: bardRes
    });
});

export default router;