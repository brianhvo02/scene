import { Router } from 'express';
import { tmdbAPIKey } from '../config';
import { snakeToCamel } from '../utils';

const router = Router();

const fetchTMDB = (route, params) => fetch(`https://api.themoviedb.org/3${route}?api_key=${tmdbAPIKey}&${params}`).then(res => res.json());
const allowedParams = ["id", "title", "overview", "poster_path", "backdrop_path", "genre_ids"]

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

router.get('/movies/now_playing', async (req, res) => {
    const { results }  = await fetchTMDB('/movie/now_playing');
    const movies = Object.fromEntries(results.map(result => [result.id, result]));
    res.status(200).json( {movies} )
})


router.get('/movies/:movieId', async (req, res) => {
    const { movieId } = req.params;
    const data = await fetchTMDB(`/movie/${movieId}`);
    const movie = { [data.id]: data };
    res.status(200).json(movie);
});



export default router;