import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import { createEvent } from '../../store/movies';
import { useNavigate, useParams } from 'react-router-dom';
import { clearEventErrors, receiveEventErrors } from '../../store/errors/eventErrors';
import { fetchTheaters, getTheaterSlice } from '../../store/theaters';
import EventMap from '../Events/EventsShow/map';


const EventForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    // const today = new Date();
    // const numberOfDaysToAdd = 0;
    // const day = today.setDate(today.getDate() + numberOfDaysToAdd); 
    // const defaultValue = new Date(day).toISOString().split('T')[0]
    const defaultValue = '';
    const [date, setDate] = useState(defaultValue);
    const [theater, setTheater] = useState({ name: '' });
    const {movieId} = useParams();
    const navigate = useNavigate();

    const theaters = useSelector(getTheaterSlice);
    const [filteredNames, setFilteredNames] = useState([]);

    const filteredTheaters = useMemo(() => filteredNames.length ? filteredNames.map(name => theaters[name]) : [], [theaters, filteredNames]);

    const [status, setStatus] = useState(true);
    const errors = useSelector(state => state.errors.event);

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createEvent({title, body, date}, movieId))
            .then((eventId) => {
                navigate(`/movie/${movieId}/event/${eventId}`)
            });
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
                    <form className='event-form' onSubmit={handleSubmit}>
                        <label>Event Title
                            <input type='text' placeholder='Event Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </label>
                        <label>Event Description
                            <input type='text' placeholder='Event Description' value={body} onChange={(e) => setBody(e.target.value)} />
                        </label>
                        <label>Event Date
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
                            </>
                        }
                        
                        <button className='event-submit-button' disabled={status}>Create</button>
                    </form>
                </div>
        </div>
    )
}

export default EventForm