import Modal from "../Modal";
import EventForm from "./EventForm";
import { useState } from "react";
import { createPortal } from "react-dom";
import "./index.scss"

const EventCreateForm = () => {
    const [modal, setModal] = useState();



    return (
        <div className="event-create-form-container">
            {
                modal &&
                    createPortal(
                        <Modal closeModal = {()=>setModal('')}>
                            {modal === 'event' && <EventForm />}
                        </Modal>,
                        document.body
                    )
            }
            <button className="event-create-button" onClick={()=>setModal('event')}>Create Event</button>
        </div>
    )
}

export default EventCreateForm;