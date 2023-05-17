import { useDispatch, useSelector } from "react-redux";
import "./UserProfile.scss"
import {useEffect, useState} from "react";
import LikedMovies from "./LikedMovies";
import {useGenreSlice, fetchGenres} from "../../store/genres";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";


const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const navigate = useNavigate();

    const genres = useGenreSlice();

    useEffect(() => {
        dispatch(fetchGenres());
    }, [dispatch]);


    return (
        <div className="user-show-page-container">
            <div className="user-show-page-user-details">
                <h1>Users show page</h1>
                <h2>{user?.username}</h2>
                <h2>{user?.email}</h2>
            </div>
            <div className='events-near'>
                <h3>Your Events</h3>
                <div className='events-card-box'>
                {
                    user?.events?.map(event =>
                        <div className='event-show-box' key={event._id} onClick={() => navigate(`/movie/${event.tmdb}/event/${event._id}`)}>
                            {console.log(event.tmdb)}
                            <div className='event-show-title'>{event.title}</div>
                            <div className='event-show-date'>{new Date(event.date).toLocaleString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </div>
                            <div className='event-show-theater'>{event.theater}</div>
                        </div>
                    )
                }
                </div>
            </div>
            <div className="user-show-page-user-genres">
                <h2>Your Genres</h2>
                {user?.genreIds.map((genre, index) => {
                    return (
                        <div key={index}>
                            <h2>{genres?.[genre]?.name}</h2>
                        </div>
                    )
                }
                )}
            </div>
            <div className="user-show-page-user-movies">
                <h2>Your Movies</h2>
                {user?.likedMovies.map((movieId, index) => {
                    return (
                        <LikedMovies key={index} movieId={movieId}/>
                    )
                }
                )}
            </div>
        </div>
    )
}

export default UserProfile;