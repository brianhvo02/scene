import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useClearMovieErrors } from "../../../store/errors/movieErrors";
import { addEventAttendee, getMovie, removeEventAttendee } from "../../../store/movies";

const EventShow = () => {
    
    useClearMovieErrors();
    const { movieId, eventId} = useParams();
    console.log(movieId, 'mid')
    console.log(eventId, 'eid')

    const dispatch = useDispatch();
    const [rsvp, setRSVP] = useState(false);

    const movie = useSelector(getMovie(502356))
    console.log(movie, "movie")

    const event = movie?.events.find(() => event._id === eventId);
    console.log(event, "event")

    const MOVIE_LINK = "https://image.tmdb.org/t/p/original";

    const handleEventRSVPSubmit = (e) => {
        e.preventDefault();
        if(rsvp){
            dispatch(addEventAttendee(movieId, eventId));
        } else {
            dispatch(removeEventAttendee(movieId, eventId));
        }
    }

    return(
        <div className="event-show-page-container">
            <div className="event-show-page-left">
                <div className="event-show-page-movie-poster">
                    <h1>{event?.title}</h1>
                    <img src={`${MOVIE_LINK.concat(movie?.posterPath)}`} alt={`${movie?.title} movie poster`}/>
                </div>
                <div className="event-show-page-description">
                    <p>Host: {event?.host}</p>
                    <p>{event?.body}</p>
                </div>
            </div>
            <div className="event-show-page-right">
                <div className="event-show-page-time-date-rsvp">
                    <p>{event?.date}</p>
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
                    {/* GOOGLE MAPS API IMPLEMENTATION */}
                </div>
            </div>
        </div>
    )
}

export default EventShow;