import { useDispatch, useSelector } from "react-redux";
import "./UserProfile.scss"
import {useEffect, useMemo, useState} from "react";
import LikedMovies from "./LikedMovies";
import {useGenreSlice, fetchGenres} from "../../store/genres";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userUpdateProfilePic } from "../../store/session";
import _ from "lodash";


const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const navigate = useNavigate();

    const genres = useGenreSlice();
    const userGenres = useMemo(() => (!_.isEmpty(user) && !_.isEmpty(genres)) ?
        Object.entries(user.genreMap)
            .sort((a, b) => b[1] - a[1])
            .map(entry => genres[entry[0]].name)
            .slice(0, 3)
    : [], [user, genres]);

    useEffect(() => {
        dispatch(fetchGenres());
    }, [dispatch]);

    const handleUpload = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            const formData = new FormData();
            formData.append('profilePic', e.target.files[0]);
            dispatch(userUpdateProfilePic(formData));
        }
    }

    return (
        <div className="user-show-page-container">
            <div className="user-show-page-user-details">
                <form className="user-show-profile-upload" onSubmit={handleUpload}>
                    <label htmlFor="user-profile-picture"><img className="user-show-page-user-picture" src={user?.photoUrl || '/scene-dark-logo-no-text.png'} alt="profile" id="profile-pic" /></label>
                    <input type="file" id="user-profile-picture" accept="image/*" style={{display: "none"}} onChange={handleUpload} />
                </form>
                <h2 className="user-show-page-username">{user?.username}</h2>
                <h2 className="user-show-page-email">{user?.email}</h2>
            </div> 
            <div className="user-show-page-user-genres">
                <h2>Your Genres:</h2>
                <div className="user-show-page-genres-container">
                    {
                        userGenres.map((genre, index) => {
                            return (
                                <div key={index}>
                                    <h3>{genre}</h3>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='events-near'>
                <h3>Your Events:</h3>
                <div className='events-card-box'>
                {
                    user?.events?.map(event =>
                        <div className='event-show-box' key={event._id} onClick={() => navigate(`/movie/${event.movie}/event/${event._id}`)}>
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
            <div className="user-show-page-user-movies">
                <h2>Your Movies:</h2>
                <div className="liked-movies-box">               
                    {
                        user?.likedMovies.map(movieId => 
                            movieId ? <LikedMovies key={movieId} movieId={movieId} /> : null
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default UserProfile;