import { Router } from 'express';
import { tmdbAPIKey } from '../config';
const router = Router();

const fetchTMDB = (route, params) => fetch(`https://api.themoviedb.org/3${route}?api_key=${tmdbAPIKey}&${params}`).then(res => res.json());

router.get('/genres', async (req, res) => {
    const data = await fetchTMDB('/genre/movie/list')
    res.status(200).json(data);
});

router.get('/discover', async (req, res) => {
    const query = new URLSearchParams(req.query);
    const { results } = await fetchTMDB('/discover/movie', query.toString());
    const movies = Object.fromEntries(results.map(result => [result.id, result]));
    res.status(200).json({ movies });
});

router.get('/movies/:movieId/recommendations', async (req, res) => {
    const { movieId } = req.params;
    const { results } = await fetchTMDB(`/movie/${movieId}/recommendations`);
    const movies = Object.fromEntries(results.map(result => [result.id, result]));
    res.status(200).json({ movies });
});

router



export default router;