import { useDispatch, useSelector } from "react-redux";
import "./UserProfile.scss"
import {useEffect, useState} from "react";
import LikedMovies from "./LikedMovies";
import {useGenreSlice, fetchGenres} from "../../store/genres";
import {Link} from "react-router-dom";



const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);


    const genres = useGenreSlice();

    useEffect(() => {
        dispatch(fetchGenres());
    }, [dispatch]);


    return (
        <div className="user-show-page-container">
            <h1>Users show page</h1>
            <h2>{user?.username}</h2>
            <h2>{user?.email}</h2>
            <h2>Your Events</h2>
            <div className='events-near'>
                <h3>Your Events</h3>
                <div className='events-card-box'>
                {
                    user?.events?.map(event =>
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
                        </Link>
                    )
                }
                    </div>
                </div>
            <h2>Your Genres</h2>
            {user?.genreIds.map((genre, index) => {
                return (
                    <div>
                        <h2>{genres?.[genre]?.name}</h2>
                    </div>
                )
            }
            )}
            <h2>Your Movies</h2>
            {user?.likedMovies.map((movieId, index) => {
                return (
                    <LikedMovies key={index} movieId={movieId}/>
                )
            }
            )}
        </div>
    )
}

export default UserProfile;