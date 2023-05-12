import './index.scss';
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useClearMovieErrors } from "../../../store/errors/movieErrors";
import { addEventAttendee, fetchMovie, getMovie, removeEventAttendee } from "../../../store/movies";
import EventMap from "./map";

const EventShow = () => {
    
    useClearMovieErrors();
    const { movieId, eventId } = useParams();

    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const movie = useSelector(getMovie(movieId));
    const event = useMemo(() => movie?.events.find(e => e._id === eventId), [movie]);
    const eventDate = useMemo(() => new Date(event?.date), [event]);
    const eventCreatedDate = useMemo(() => new Date(event?.createdAt), [event]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }, []);

    const MOVIE_LINK = "https://image.tmdb.org/t/p/original";

    const going = useMemo(() => !!event?.attendees.find(attendee => attendee._id === sessionUser._id), [event, sessionUser]);

    const handleEventRSVPClick = () => 
        dispatch(
            going
                ? removeEventAttendee(eventId, movieId)
                : addEventAttendee(eventId, movieId)
        );

    useEffect(() => {
        if (movieId) dispatch(fetchMovie(movieId));
    }, [dispatch]);

    return(
        <>
            <img src={movie ? `${MOVIE_LINK.concat(movie.backdropPath)}` : ''} alt={`${movie?.title} movie backdrop`} className="background-image"/>       
            <h1 className="event-title">{event?.title}</h1>
            <div className="event-show-page-container">
                <div className="event-show-page-left">
                    <div className="event-show-page-movie-poster">
                        <img src={movie ? `${MOVIE_LINK.concat(movie.posterPath)}` : ''} alt={`${movie?.title} movie poster`}/>
                        <h2 className="event-title-movie-title">{movie?.title}</h2>
                    </div>
                    <div className="event-show-page-description">
                        <p>Host: {event?.host.username}</p>
                        <p>Created: {eventCreatedDate.toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                        <p>{event?.body}</p>
                        <div className='amenities-box'>
                            <h3>Amenities</h3>
                            <ul>
                                {
                                    event?.amenities.map((amenity, i) =>
                                        <li className='amenities-list' key={'amenity_' + i}>{amenity}</li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                    
                </div>
                <div className="event-show-page-right">
                    <div className="event-show-page-time-date-rsvp">
                        <p id="date">{eventDate.toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                        <p>Please RSVP Below: </p>
                        {
                            sessionUser && movie && 
                            <button className="rsvp-button" onClick={handleEventRSVPClick}>{ going ? "UnRSVP" : "RSVP"}</button>
                        }
                        {going ? <p>See you there!</p> : <p>Sorry you're not coming!</p>}                
                    </div>
                    <div className="event-show-page-maps-container">
                        <h3>{event?.theater}</h3>
                        <p>Ticket Type: {event?.ticketType}</p>
                        <a href={event?.ticketUrl} target='_blank' rel='noreferrer'>Get a ticket</a>
                        <div className="map">
                            {
                                event &&
                                <EventMap theaters={[{
                                    name: event.theater,
                                    geo: event.coordinates
                                }]} selected={event.theater} canSelect={false} />
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}

export default EventShow;