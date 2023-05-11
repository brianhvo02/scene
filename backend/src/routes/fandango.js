import { Router } from 'express';
import Movie from '../models/Movie';
import { extractAllowedParams } from '../utils';
import { requireUser } from '../config';
const router = Router({ mergeParams: true });

const fetchFandango = (route, params) => fetch(`https://www.fandango.com/napi${route}?${params}`, { headers: { 'Referer': 'https://www.fandango.com' } }).then(res => res.json());
const theaterAllowedParams = [ 'name', 'fullAddress', 'geo' ];
const ticketAllowedParams = [ 'ticketingDate', 'date', 'ticketingJumpPageURL', 'amenities' ];

router.get('/', requireUser, async (req, res, next) => {
    const { movieId } = req.params;
    const query = new URLSearchParams({
        limit: 10,
        zipCode: req.user.zipCode,
        ...req.query
    });
    try {
        const [ { theaters: theatersRes }, movie ] = await Promise.all([
            fetchFandango('/theaterswithshowtimes', query.toString()), 
            Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId })
        ]);

        const theaters = Object.fromEntries(
            theatersRes.map(theater => {
                if (!theater.movies) return [];

                const m = theater.movies.find(m => {
                    if (m.title.includes(movie.title)) return true;
                    for (let title in movie.alternativeTitles) {
                        if (m.title.includes(movie.alternativeTitles[title])) return true;
                    }
                    return false;
                });

                if (!m) return [];

                return [
                    theater.name, {
                        ...extractAllowedParams(theaterAllowedParams, theater, false),
                        tickets: Object.fromEntries(
                            m.variants.map(variant => {
                                const amenityGroup = {}
                                variant.amenityGroups.forEach(
                                    group => {
                                        group.showtimes.forEach(showtime => {
                                            if (!showtime.expired && showtime.type === 'available') {
                                                const amenities = group.amenities.map(amenity => amenity.name);
                                                if (amenityGroup[amenities.join(', ')]) {
                                                    amenityGroup[amenities.join(', ')].push({
                                                        ...extractAllowedParams(ticketAllowedParams, showtime),
                                                        amenities
                                                    });
                                                } else {
                                                    amenityGroup[amenities.join(', ')] = [{
                                                        ...extractAllowedParams(ticketAllowedParams, showtime),
                                                        amenities
                                                    }];
                                                }
                                            }
                                        });
                                    }
                                )

                                return [
                                    variant.format, {
                                        type: variant.format,
                                        showtimes: amenityGroup
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