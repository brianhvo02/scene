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
    const [rsvp, setRSVP] = useState(false);

    const movie = useSelector(getMovie(movieId));
    const event = movie?.events.find(e => e._id === eventId);
    const eventDate = useMemo(() => new Date(event?.date), [event]);
    const eventCreatedDate = useMemo(() => new Date(event?.createdAt), [event]);

    const MOVIE_LINK = "https://image.tmdb.org/t/p/original";

    const handleEventRSVPSubmit = (e) => {
        e.preventDefault();
        if(rsvp){
            dispatch(addEventAttendee(movieId, eventId));
        } else {
            dispatch(removeEventAttendee(movieId, eventId));
        }
    }

    useEffect(() => {
        if (movieId) dispatch(fetchMovie(movieId));
    }, [dispatch]);

    return(
        <div className="event-show-page-container">
            <div className="event-show-page-left">
                <div className="event-show-page-movie-poster">
                    <h1>{event?.title}</h1>
                    <img src={`${MOVIE_LINK.concat(movie?.posterPath)}`} alt={`${movie?.title} movie poster`}/>
                    <h2>{movie?.title}</h2>
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
                        <h2>Amenities</h2>
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
                    <p>{eventDate.toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                    <p>Please RSVP Below</p>
                    <form className="event-rsvp-form" onSubmit={(e) => handleEventRSVPSubmit(e)}>
                        <input  type="radio" name="rsvp" id="rsvp-yes" value={true}></input>
                        <label htmlFor="rsvp-yes" onClick={() => setRSVP(true)}>I'm coming!</label>
                        <input  type="radio" name="rsvp" id="rsvp-no" value={false}></input>
                        <label htmlFor="rsvp-no" onClick={() => setRSVP(false)}>I'm not coming!</label>
                        <button>RSVP!</button>
                    </form>
                    {rsvp ? <p>See you there!</p> : <p>Sorry you're not coming!</p>}
                </div>
                <div className="event-show-page-maps-container">
                    <h3>{event?.theater}</h3>
                    <p>Ticket Type: {event?.ticketType}</p>
                    <a href={event?.ticketUrl} target='_blank' rel='noreferrer'>Get a ticket</a>
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
    )
}

export default EventShow;