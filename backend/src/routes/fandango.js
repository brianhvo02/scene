import { Router } from 'express';
import Movie from '../models/Movie';

const router = Router({ mergeParams: true });

const fetchFandango = (route, params) => fetch(`https://www.fandango.com/napi${route}?${params}`, { headers: { 'Referer': 'https://www.fandango.com' } }).then(res => res.json());
const theatreAllowedParams = [ 'name', 'fullAddress', 'geo' ];
const ticketAllowedParams = [ 'ticketingDate', 'type', 'date', 'expired', 'ticketingJumpPageURL', 'amenities' ];

const extractAllowedParams = (allowedParams, result) => Object.fromEntries(allowedParams.map(key => [key, result[key]]))

router.get('/', async (req, res, next) => {
    const { movieId } = req.params;
    const query = new URLSearchParams({
        limit: 10,
        ...req.query
    });
    try {
        const [ { theaters: theatersRes }, movie ] = await Promise.all([
            fetchFandango('/theaterswithshowtimes', query.toString()), 
            Movie.findOne({ [movieId.length !== 24 ? 'tmdbId' : '_id']: movieId })
        ]);

        const theaters = Object.fromEntries(
            theatersRes.map(theater => {
                if (!theater.movies) return [];

                const m = theater.movies.find(m => {
                    return m.title.includes(movie.title) || movie.alternativeTitles.includes(m.title);
                });

                if (!m) return [];

                return [
                    theater.name, {
                        ...extractAllowedParams(theatreAllowedParams, theater),
                        tickets: Object.fromEntries(
                            m.variants.map(variant => {
                                const showtimes = Object.fromEntries(variant.amenityGroups.map(
                                    group => group.showtimes.map(showtime => [
                                        [showtime.ticketingDate], {
                                            ...extractAllowedParams(ticketAllowedParams, showtime),
                                            amenities: group.amenities.map(amenity => amenity.name)
                                        }
                                    ])
                                ).flat());

                                return [
                                    variant.format, {
                                        type: variant.format,
                                        showtimes
                                    }
                                ];
                            })
                        )
                    }
                ];
            })
        );

        res.status(200).json({ theaters });
    } catch(e) {
        const error = new Error('Something went wrong!');
        error.statusCode = 422;
        error.errors = { message: e.message };
        return next(error);
    } 
});

export default router;