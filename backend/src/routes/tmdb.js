import { Router } from 'express';
import { tmdbAPIKey } from '../config';
import { extractAllowedParams, snakeToCamel } from '../utils';

const router = Router();

export const fetchTMDB = (route, params) => fetch(`https://api.themoviedb.org/3${route}?api_key=${tmdbAPIKey}&${params}`).then(res => res.json());
const allowedParams = ["id", "title", "overview", "poster_path", "backdrop_path", "genre_ids", "alternative_titles", "runtime", "tagline"];

router.get('/genres', async (req, res) => {
    const { genres } = await fetchTMDB('/genre/movie/list');
    res.status(200).json({ genres: Object.fromEntries(genres.map(genre => [genre.id, genre])) });
});

router.get('/discover', async (req, res) => {
    const query = new URLSearchParams(req.query);
    const { results } = await fetchTMDB('/discover/movie', query.toString() + "&include_adult=false");
    const movies = Object.fromEntries(results.map(result => [result.id, extractAllowedParams(allowedParams, result)]));
    res.status(200).json({ movies });
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
    const movies = Object.fromEntries(results?.map(result => [result.id, extractAllowedParams(allowedParams, result)]));
    res.status(200).json({ movies });
});

export default router;