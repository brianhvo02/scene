import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import movies, { createComment, deleteComment, editComment, fetchMovie, getMovie } from '../../store/movies';
import EventCreateForm from '../EventCreateForm';
import { GiPopcorn } from 'react-icons/gi';
import './index.scss'
import { useEffect, useMemo, useState } from 'react';
import RatingsComponent from '../Ratings';
import Loading from '../Loading/Loading';
import { fetchGenres, useGenreSlice } from '../../store/genres';
import Chat from './Chat';
import { calculateDistance } from '../../util/function';
import { current } from '@reduxjs/toolkit';
import CommentBox from './Comment';

const MovieShow = () => {
    const currentUser = useSelector(state => state.session.user);
    const { movieId } = useParams();
    const [realMovieId, setRealMovieId] = useState(movieId);
    const movie = useSelector(getMovie(realMovieId));
    const genres = useGenreSlice();
    const MOVIE_LINK = 'https://image.tmdb.org/t/p/original';
    const dispatch = useDispatch();
    const [averageRating, setAverageRating] = useState(0);

    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        dispatch(fetchMovie(movieId))
            .then(({movies}) => setRealMovieId(Object.keys(movies)[0]))
            .finally(()=>(setLoading(false)));
        dispatch(fetchGenres());
    }, [dispatch,movieId]);

    useEffect(() => {
        let total = 0;
        movie?.ratings?.map(rating => {
            total += rating?.rating
        });
        setAverageRating((((Math.floor(total / movie?.ratings?.length))/ 5)) * 100)
    }, [movie]);

    const content = () =>{
        return (
        <>
            <img src={movie?.backdropPath ? `${MOVIE_LINK.concat(movie?.backdropPath)}` : '/backdrop.png'} alt='' className='background-image'/>
            <div className='movie-info-container'>
                <div className='movie-info-left'>
                    <h2>{movie?.title}</h2>
                    <div className="genre-container">
                        {movie?.genreIds.map((genreId, idx) => {
                            return <span key={`genre_${genreId}`} className="genre">{genres?.[genreId]?.name} <span> {idx === movie?.genreIds.length - 1 ? "" : "|"} </span> </span> 
                        })}
                    </div>
                    <p id="tagline">{movie?.tagline}</p>
                    { averageRating > 0 ?  <p id="popcorn-score-container">Popcorn Score: <img src="/popcorn-svgrepo-com.svg" alt="popcorn svg"/> <span className="popcorn-score">{averageRating}%</span> | <span className="certification">{movie?.certification}</span> | <span className="runtime">{movie?.runtime} mins</span></p>
                    :
                    <p id="popcorn-score-container">Popcorn Score: <img src="/popcorn-svgrepo-com.svg" alt="popcorn svg"/> <span className="popcorn-score">No Rating</span> | <span className="certification">{movie?.certification ? movie?.certification : "NR"}</span> | <span className="runtime">{movie?.runtime} mins</span></p>    
                    }
                    <h3>Movie Description:</h3>
                    <p>{movie?.overview}</p>
                    <RatingsComponent movie={movie} />
                    <div className='events-near'>
                        <h3>Events near you:</h3>
                        <div className='events-card-box'>
                        {
                            movie?.events?.map(event =>{
                                const distance = calculateDistance(
                                    event.coordinates.latitude, 
                                    event.coordinates.longitude, 
                                    currentUser?.coordinates?.latitude, 
                                    currentUser?.coordinates?.longitude
                                );
                                if (distance <= 20) {
                                    return (
                                        <Link className='event-show-box' key={event._id} to={`./event/${event._id}`}>
                                            <div className='event-show-title'>{event.title}</div>
                                            <div className='event-show-date'>{new Date(event.date).toLocaleString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</div>
                                            <div className='event-show-theater'>{event.theater}</div>
                                            {/* <div className='event-show-host'>{event.host.username}</div> */}
                                        </Link>
                                    )
                                }
                            }
                            )
                        }
                        </div>
                    </div>
                    <div className='movie-show-event-button'>
                        <EventCreateForm />
                    </div>
                </div>
                <div className='movie-info-right'>
                    <img src={movie?.posterPath ? `${MOVIE_LINK.concat(movie.posterPath)}` : ''} alt=''/>
                </div>
            </div>
            <div className='background-gradient'></div>
            <CommentBox comments={movie ? movie.comments : []} movieId={movie?.tmdbId} userId={currentUser?._id} />
            <Chat movieId={movieId} />
        </>
    )  
    }

    return loading ? <Loading /> : content()
}

export default MovieShow;