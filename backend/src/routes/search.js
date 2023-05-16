import { Router } from 'express';
import { tmdbAPIKey } from '../config';
import { extractAllowedParams, snakeToCamel } from '../utils';
import { fetchTMDB, allowedParams } from './tmdb';

const router = Router();

router.get('/', async (req, res, next) => {

    const query = new URLSearchParams({
        include_adult: false,
        language: "en-US",
        page: 1,
        ...req.query
    })
    const { results, total_pages: totalPages } = await fetchTMDB("/search/movie", query.toString())
    const movies = Object.fromEntries(results.map(result => [result.id, extractAllowedParams(allowedParams, result)]))
    res.status(200).json({movies, totalPages})
});

export default router;