import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import { createEvent } from '../../store/movies';
import { useNavigate, useParams } from 'react-router-dom';
import { clearEventErrors, receiveEventErrors, useClearEventErrors } from '../../store/errors/eventErrors';
import { fetchTheaters, getTheaterSlice } from '../../store/theaters';
import EventMap from '../Events/EventsShow/map';
import "./index.scss"

const EventForm = () => {
    useClearEventErrors();
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    // const today = new Date();
    // const numberOfDaysToAdd = 0;
    // const day = today.setDate(today.getDate() + numberOfDaysToAdd); 
    // const defaultValue = new Date(day).toISOString().split('T')[0]
    const [date, setDate] = useState('');
    const [info, setInfo] = useState({});
    const [theater, setTheater] = useState({ name: '' });
    const {movieId} = useParams();
    const navigate = useNavigate();

    const theaters = useSelector(getTheaterSlice);
    const [filteredNames, setFilteredNames] = useState([]);

    const filteredTheaters = useMemo(() => filteredNames.length ? filteredNames.map(name => theaters[name]) : [], [theaters, filteredNames]);

    const [status, setStatus] = useState(false);
    const errors = useSelector(state => state.errors.event);

    const handleSubmit = () => {
        const errors = [];

        if (title < 10) errors.push('Provide a minimum length of 10 characters title for your event.');
        if (title > 50) errors.push('Provide no more than 50 characters for your event title.');
        if (body < 10) errors.push('Provide a minimum length of 15 characters body for your event.');
        if (body > 50) errors.push('Provide no more than 500 characters for your event body.');

        if (errors.length) {
            return dispatch(receiveEventErrors({ errors }));
        }

        if (status) {
            dispatch(createEvent({title, body, ...info}, movieId))
                .then((eventId) => {
                    navigate(`/movie/${movieId}/event/${eventId}`)
                });
        }
    }

    return (
        <div className='event-form-container'>
            <div className='event-form-heading'>
                <h1>Create your new Event!</h1>
            </div>
                {
                    errors.map((error, i) => 
                        <p key={`error_${i}`}>{error}</p>
                    )
                }
                <div className='event-form-input'>
                    <form className='event-form' onSubmit={e => e.preventDefault()}>
                        <label className='input-label'>
                            <div className='input-label-text'>Event Title</div>
                            <input type='text' placeholder='Event Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </label>
                     <label className='input-label description'>
                        <div className='input-label-text'>Event Description</div>
                            <input id="input-description" type='text' placeholder='Event Description' value={body} onChange={(e) => setBody(e.target.value)} />
                        </label>
                    <label className='input-label'>
                        <div className='input-label-text'>Event Date</div>
                            <input type='date' placeholder='Event Date' value={date} onChange={e => {
                                if (new Date(`${e.target.value} 00:`) < new Date(new Date().toLocaleDateString())) {
                                    dispatch(receiveEventErrors({
                                        errors: ['Date needs to be on or after today']
                                    }));
                                } else {
                                    dispatch(clearEventErrors());
                                    dispatch(fetchTheaters(movieId, e.target.value))
                                        .then(({theaters}) => 
                                            Object.keys(theaters).length
                                                ? setFilteredNames(Object.keys(theaters))
                                                : dispatch(receiveEventErrors({
                                                    errors: ['No theaters near you are showing this movie']
                                                }))
                                        );
                                    setDate(e.target.value);
                                }
                            }} />
                        </label>
                        {
                            !!filteredTheaters.length &&
                            <>
                                <select onChange={e => 
                                    setTheater(theaters[e.target.value])
                                } value={theater.name} >
                                    <option value={''} disabled>Select a theater</option>
                                    {
                                        filteredTheaters.map(theater => 
                                            <option key={theater.name} value={theater.name}>{theater.name}</option>
                                        )
                                    }
                                </select>
                                <EventMap theaters={filteredTheaters} selected={theater.name} setSelected={setTheater} />

                                {
                                    !!theater.name.length &&
                                    <div>
                                        <h2>{theater.name}</h2>
                                        <p>{theater.fullAddress}</p>
                                        {
                                            Object.keys(theater.tickets).map(type => 
                                                <div key={type}>
                                                    <h3>{type}</h3>
                                                    {
                                                        Object.keys(theater.tickets[type].showtimes)
                                                            .map(amenities =>
                                                                <div key={type + amenities}>
                                                                    <h4>{amenities}</h4>
                                                                    {
                                                                        theater.tickets[type].showtimes[amenities].map(ticket => 
                                                                            <button 
                                                                                key={type + amenities + ticket.date}
                                                                                onClick={() => {
                                                                                    setInfo({
                                                                                        theater: theater.name,
                                                                                        coordinates: theater.geo,
                                                                                        address: theater.fullAddress, 
                                                                                        ...ticket, 
                                                                                        type});
                                                                                    setStatus(true);
                                                                                }}
                                                                                style={{
                                                                                    color: (
                                                                                        info.date === ticket.date
                                                                                            &&
                                                                                        info.amenities.join(', ') === amenities
                                                                                    )
                                                                                        ? 'blue'
                                                                                        : 'red'
                                                                                }}
                                                                            >{ticket.date}</button>
                                                                        )
                                                                    }
                                                                </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                }
                            </>
                        }
                        <button className='event-submit-button' onClick={handleSubmit} disabled={!status}>Create</button>
                    </form>
                </div>
        </div>
    )
}

export default EventForm