import { Router } from 'express';
import { requireUser, tmdbAPIKey } from '../config';
import { extractAllowedParams, snakeToCamel } from '../utils';

const router = Router();

export const fetchTMDB = (route, params) => fetch(`https://api.themoviedb.org/3${route}?api_key=${tmdbAPIKey}&${params}`).then(res => res.json());
export const allowedParams = ["id", "title", "overview", "poster_path", "backdrop_path", "genre_ids", "alternative_titles", "runtime", "tagline"];

router.get('/genres', async (req, res) => {
    const { genres } = await fetchTMDB('/genre/movie/list');
    res.status(200).json({ genres: Object.fromEntries(genres.map(genre => [genre.id, genre])) });
});

router.get('/discover', requireUser, async (req, res) => {
    const query = new URLSearchParams({
        with_genres: req.user.genreIds.join('|'),
        include_adult: false,
        certification_country: 'US',
        'certification.lte': 'R',
        ...req.query
    });
    const { results } = await fetchTMDB('/discover/movie', query.toString());
    const movies = Object.fromEntries(results.map((result) => [result.id, extractAllowedParams(allowedParams, result)]));
    res.status(200).json({ movies, results: results.map(result => result.id) });
});

router.get('/movies/now_playing', async (req, res) => {
    const query = new URLSearchParams(req.query);
    const [{ results: res1 }, { results: res2 }] = await Promise.all([
        fetchTMDB('/movie/now_playing', query.toString() + '&page=1'),
        fetchTMDB('/movie/now_playing', query.toString() + '&page=2')
    ]);
    const results = [...res1, ...res2];
    const movies = Object.fromEntries(results.map(result => [result.id, extractAllowedParams(allowedParams, result)]));
    res.status(200).json({ movies });
});

router.get('/movies/popular', async (req, res) => {
    const query = new URLSearchParams(req.query);
    const { results } = await fetchTMDB('/movie/popular', query.toString());
    const movies = Object.fromEntries(results.map(result => [result.id, extractAllowedParams(allowedParams, result)]));
    res.status(200).json({ movies });
});

router.get('/movies/:movieId/recommendations', async (req, res) => {
    const { movieId } = req.params;
    const { results } = await fetchTMDB(`/movie/${movieId}/recommendations`);
    const movies = results ? Object.fromEntries(results.map(result => [result.id, extractAllowedParams(allowedParams, result)])) : null;
    res.status(200).json({ movies });
});

export default router;