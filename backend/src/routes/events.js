import { Router } from 'express';
import mongoose, { model } from 'mongoose';
const router = Router({mergeParams: true});
import Event from '../models/Event';
import passport from 'passport';
// import mongoose from 'mongoose';
import { isProduction } from '../config';
import validateEventInput from '../validations/event';
import { requireUser } from '../config';
import Movie from '../models/Movie';


router.post('/',requireUser, validateEventInput, async (req, res, next) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            body: req.body.body,
            date: req.body.date,
            host: req.user._id,
            attendees: req.body.attendees
        });

        let event = await newEvent.save();
        let movie = await Movie.findById(req.params.movieId);
        // console.log(movie)
        movie.events.push(event);
        movie.save();
        event = await event.populate('host', '_id username');
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

router.delete('/:id', requireUser, async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            error.errors = { message: 'No event found with that id' };
            return next(error);
        }
        if (event.host.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.errors = { message: 'You are not authorized to delete this event' };
            return next(error);
        }
        await Event.findByIdAndDelete(req.params.id);
        return res.json(event);
    }
    catch (err) {
        next(err);
    }
});

export default router;
