import './index.scss';
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useClearMovieErrors } from "../../../store/errors/movieErrors";
import { addEventAttendee, fetchMovie, getMovie, removeEventAttendee, deleteEvent } from "../../../store/movies";
import EventMap from "./map";
import Loading from '../../Loading/Loading';

const EventShow = () => {
    useClearMovieErrors();
    const { movieId, eventId } = useParams();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const movie = useSelector(getMovie(movieId));
    const event = useMemo(() => movie?.events.find(e => e._id === eventId), [movie]);
    const eventDate = useMemo(() => new Date(event?.date), [event]);
    const eventCreatedDate = useMemo(() => new Date(event?.createdAt), [event]);
    const [loading, setLoading] = useState(true);

    const isOwner = useMemo(() => event?.host._id === sessionUser?._id, [event, sessionUser]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
        if (movieId) dispatch(fetchMovie(movieId))
            .finally(() => (setLoading(false)))

    }, [dispatch]);

    const handleDeleteEventButton = () => {
        dispatch(deleteEvent(event?._id, movie?._id))
            .then(() => navigate(-1))
    }

    const content = () => {
        return(
            <>
                <img src={movie?.backdropPath ? `${MOVIE_LINK.concat(movie.backdropPath)}` : ''} alt={`${movie?.title} movie backdrop`} className="background-image"/>       
                <h1 className="event-title">{event?.title}</h1>
                <div className="event-show-page-container">
                    <div className="event-show-page-left">
                        <div className="event-show-page-movie-poster">
                            <img src={movie?.posterPath ? `${MOVIE_LINK.concat(movie.posterPath)}` : ''} alt={`${movie?.title} movie poster`}/>
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
                            <div>
                                <h3>Amenities</h3>
                                <ul>
                                    {
                                        event?.amenities.map((amenity, i) =>
                                            <li key={'amenity_' + i}>{amenity}</li>
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
                                <button className="rsvp-button" onClick={handleEventRSVPClick} disabled={isOwner}>{isOwner ? 'You\'re hosting!' : going ? "UnRSVP" : "RSVP"}</button>
                            }
                            {isOwner ? '' : going ? <p>See you there!</p> : <p>Sorry you're not coming!</p>}  
                            <div className='attendees-count'>You can make <strong >{event?.attendees.length}</strong> new friends at this event!</div>               
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
                                    }]} selected={event?.theater} canSelect={false} />
                                }
                            </div>
                            <div className="button-container">
                                {event?.host._id === sessionUser?._id ? <button id="delete-event-button" onClick={() => handleDeleteEventButton(event, movie)}>Delete Event</button> : null }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return loading ? <Loading /> : content()
}

export default EventShow;