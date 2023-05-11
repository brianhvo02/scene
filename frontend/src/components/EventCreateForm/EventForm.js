import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { createEvent } from '../../store/movies'
import { useNavigate, useParams } from 'react-router-dom'


const EventForm = () => {

    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const today = new Date();
    const numberOfDaysToAdd = 0;
    const day = today.setDate(today.getDate() + numberOfDaysToAdd); 
    const defaultValue = new Date(day).toISOString().split('T')[0]
    const [date, setDate] = useState(defaultValue)
    const {movieId} = useParams()
    const navigate = useNavigate()
    console.log(movieId)

    console.log(date)


    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createEvent({title, body, date}, movieId))
        .then((eventId) => {
            navigate(`/movie/${movieId}/event/${eventId}`)
        })
    }


    return (
        <div className='event-form-container'>
            <div className='event-form-heading'>
                <h1>Create your new Event!</h1>
            </div>
                <div className='event-form-input'>
                    <form className='event-form' onSubmit={handleSubmit}>
                        <label>Event Title
                            <input type='text' placeholder='Event Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </label>
                        <label>Event Description
                            <input type='text' placeholder='Event Description' value={body} onChange={(e) => setBody(e.target.value)} />
                        </label>
                        <label>Event Date
                            <input type='date' placeholder='Event Date' value={date} onChange={(e) => setDate(e.target.value)} />
                        </label>
                        <button className='event-submit-button'>Create</button>
                    </form>
                </div>
        </div>
    )
}

export default EventForm