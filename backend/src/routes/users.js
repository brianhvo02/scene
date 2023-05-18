import { Router } from 'express';
const router = Router();

import bcrypt from "bcryptjs";
import passport from "passport";
import User from '../models/User';
import { isProduction, loginUser, requireUser, restoreUser } from '../config';
import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const upload = multer();
const client = new S3Client({region: "us-west-1"});

import validateRegisterInput from '../validations/register';
import validateLoginInput from '../validations/login';
import Movie from '../models/Movie';

router.post('/register', validateRegisterInput, async (req, res, next) => {
    const user = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }]
    });

    if (user) {
        const err = new Error ("Validation Error");
        err.statusCode = 400;
        const errors = {};
        if (user.email === req.body.email) {
            errors.email = "A user has already registered with this email";
        }
        if (user.username === req.body.username) {
            errors.username = "A user has already registered with this username";
        }
        err.errors = errors;
        return next(err);
    }

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        genreIds: [],
        likedMovies: [],
        events: []
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
            if (err) throw err;
            try {
                newUser.hashedPassword = hashedPassword;
                const user = await newUser.save();
                return res.json(await loginUser(user)); 
            }
            catch (err) {
                next(err);
            }
        })
    });
});

router.post('/login', validateLoginInput, async (req, res, next) => {
    passport.authenticate('local', async function (err, user) {
        if (err) return next(err);
        if (!user) {
            const err = new Error('Invalid credentials');
            err.statusCode = 400;
            err.errors = { credential: "Invalid credentials" };
            return next(err);
        }
        return res.json(await loginUser(user));
    })(req, res, next);
});

router.get('/current', restoreUser, async (req, res) => {
    if (!isProduction) {
        const csrfToken = req.csrfToken();
        res.cookie("X-CSRF-Token", csrfToken);
    }
    if (!req.user) return res.json(null);
    const command = new GetObjectCommand({
        Bucket: "scene-dev",
        Key: `${req.user.username}.jpg`
    });
    const userInfo = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        genreIds: req.user.genreIds,
        likedMovies: req.user.likedMovies,
        events: req.user.events,
        zipCode: req.user.zipCode,
        coordinates: req.user.coordinates,
        photoUrl: req.user.hasProfilePic ? await getSignedUrl(client, command, {expiresIn: 3600}) : null
    };
    res.json(userInfo);
});

router.patch('/current/registerGenresZipCode', requireUser, async (req, res, next) => {
    try {
        let user = req.user;
        user.genreIds.push(...req.body.genreIds);
        user.zipCode = req.body.zipCode;
        user.coordinates = req.body.coordinates;
        user = await user.save();
        return res.json(user);
    }
    catch (err) {
        next(err);
    };
});

router.post('/likedMovie', requireUser, async (req, res, next) => {
    try {
        let likedMovie = req.body.movieId;
        let user = req.user;
        if (user.likedMovies.includes(likedMovie)) {
            const err = new Error('Movie already liked');
            err.statusCode = 400;
            err.errors = { session: "Movie already liked" };
            return next(err);
        }
        
        user.likedMovies.push(likedMovie);
        user = await user.save();
        return res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});


router.delete('/unlikedMovie', requireUser, async (req, res, next) => {
    try {
        let unlikedMovie = req.body.movieId;
        let user = req.user;
        if (!user.likedMovies.includes(unlikedMovie)) {
            const err = new Error('Movie not liked by user');
            err.statusCode = 400;
            err.errors = { session: "Movie not liked by user" };
            return next(err);
        }
        user = await User.findByIdAndUpdate(user._id, {
            $pull: {
                likedMovies: unlikedMovie
            }
        }, { new: true });
        return res.json(user);
    }
    catch (err) {
        next(err);
    }
});

router.patch('/current/updateProfilePic', upload.single("profilePic"), requireUser, async (req, res, next) => {
    try {
        let user = req.user;
        const file = req.file;
        const uploadCommand = new PutObjectCommand({
            Body: file.buffer,
            Bucket: "scene-dev",
            Key: `${user.username}.jpg`
        });
        await client.send(uploadCommand);   
        const downloadCommand = new GetObjectCommand({
            Bucket: "scene-dev",
            Key: `${user.username}.jpg`
        });

        user.hasProfilePic = true;
        await user.save();

        const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            genreIds: user.genreIds,
            likedMovies: user.likedMovies,
            events: user.events,
            coordinates: user.coordinates,
            photoUrl: await getSignedUrl(client, downloadCommand, {expiresIn: 3600})
        };

        return res.status(200).json(userInfo);
    }
    catch (err) {
        next(err);
    };
})

export default router;