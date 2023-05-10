import { Router } from 'express';
import mongoose, { model } from 'mongoose';
const router = Router({ mergeParams: true });
import Event from '../models/Event';
import passport from 'passport';
// import mongoose from 'mongoose';
import { isProduction } from '../config';
import validateEventInput from '../validations/event';
import { requireUser } from '../config';
import Movie from '../models/Movie';

router.post('/', requireUser, validateEventInput, async (req, res, next) => {
    try {
        const { movieId } = req.params;

        const newEvent = new Event({
            title: req.body.title,
            body: req.body.body,
            date: req.body.date,
            host: req.user._id,
            attendees: req.body.attendees
        });

        let event = await newEvent.save();

        let movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId });
        movie.events.push(event);
        movie = await movie.save()
            .populate({
                path: 'events',
                populate: {
                    path: 'host',
                    model: 'User',
                    select: '_id username email'
                }
            });
        return res.json(movie);
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

        const { movieId } = req.params;
        const movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId })
            .populate({
                path: 'events',
                populate: [
                    {
                        path: 'host',
                        model: 'User',
                        select: '_id username email'
                    },
                    {
                        path: 'attendees',
                        model: 'User',
                        select: '_id username email'
                    }
                ]
            });
        return res.json(movie);
    }
    catch (err) {
        next(err);
    }
});

router.post('/:id/addAttendee', requireUser, async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('host', '_id');

        if (event.attendees.includes(req.user._id)) {
            const error = new Error('User already an attendee');
            error.statusCode = 404;
            error.errors = { message: 'The logged in user is already attending this event' };
            return next(error);
        }
        if (event.host._id.equals(req.user._id)) {
            const error = new Error('User is the host');
            error.statusCode = 404;
            error.errors = { message: 'The logged in user is hosting this event' };
            return next(error);
        }
        event.attendees.push(req.user);
        await event.save();

        const { movieId } = req.params;
        const movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId })
            .populate({
                path: 'events',
                populate: [
                    {
                        path: 'host',
                        model: 'User',
                        select: '_id username email'
                    },
                    {
                        path: 'attendees',
                        model: 'User',
                        select: '_id username email'
                    }
                ]
            });
        return res.json(movie);
    }
    catch (err) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        error.errors = { message: 'No event found with that id' };
        return next(error);
    }
});

router.delete('/:id/removeAttendee', requireUser, async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event.attendees.includes(req.user._id)) {
            const error = new Error('User is not an attendee');
            error.statusCode = 404;
            error.errors = { message: 'The logged in user is not attending this event' };
            return next(error);
        }
        event.attendees.remove(req.user);
        await event.save();

        const { movieId } = req.params;
        const movie = await Movie.findOne({ [movieId.length === 24 ? '_id' : 'tmdbId']: movieId })
            .populate({
                path: 'events',
                populate: [
                    {
                        path: 'host',
                        model: 'User',
                        select: '_id username email'
                    },
                    {
                        path: 'attendees',
                        model: 'User',
                        select: '_id username email'
                    }
                ]
            });
        return res.json(movie);
    }
    catch (err) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        error.errors = { message: 'No event found with that id' };
        return next(error);
    }
});

export default router;
