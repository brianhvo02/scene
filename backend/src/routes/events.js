import { Router } from 'express';
import mongoose, { model } from 'mongoose';
const router = Router();
import Event from '../models/Event';
import passport from 'passport';
// import mongoose from 'mongoose';
import { isProduction } from '../config';


router.post('/', async (req, res, next) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            body: req.body.body,
            date: req.body.date,
            host_id: req.user._id,
            attendees: req.body.attendees
        });

        let event = await newEvent.save();
        event = await event.populate('host_id', '_id username');
        return res.json(event);
    }
    catch (err) {
        next(err);
    };
});


router.get('/:id', async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        return res.json(event);
    }
    catch (err) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        error.errors = { message: 'No event found with that id' };
        return next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            error.errors = { message: 'No event found with that id' };
            return next(error);
        }
        if (event.host_id.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.errors = { message: 'You are not authorized to delete this event' };
            return next(error);
        }
        await event.delete();
        return res.json({ message: 'Event deleted' });
    }
    catch (err) {
        next(err);
    }
});

export default router;
