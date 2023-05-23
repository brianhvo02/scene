import { Router } from 'express';
const router = Router();

import bcrypt from "bcryptjs";
import passport from "passport";
import User from '../models/User';
import { getUserInfo, isProduction, loginUser, requireUser, restoreUser } from '../config';
import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const upload = multer();
const client = new S3Client({region: "us-west-1"});

import validateRegisterInput from '../validations/register';
import validateLoginInput from '../validations/login';
import Movie from '../models/Movie';
import { fetchTMDB } from './tmdb';

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
        email: req.body.email
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
            if (err) throw err;
            try {
                newUser.hashedPassword = hashedPassword;
                const user = await newUser.save();
                const userInfo = await loginUser(user);
                return res.json(userInfo); 
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
    const userInfo = await getUserInfo(req.user);
    res.json(userInfo);
});

router.patch('/current/registerGenresZipCode', requireUser, async (req, res, next) => {
    try {
        let user = req.user;

        const { genres } = await fetchTMDB('/genre/movie/list');
        user.genreMap = new Map();
        genres.forEach(genre => user.genreMap.set(`${genre.id}`, req.body.genreIds.includes(`${genre.id}`) ? 5 : 0));

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
        const likedMovie = req.body.movie;
        let user = req.user;
        if (user.likedMovies.includes(likedMovie.id)) {
            const err = new Error('Movie already liked');
            err.statusCode = 400;
            err.errors = { session: "Movie already liked" };
            return next(err);
        }

        let count = 1;
        if (user.dislikedMovies.includes(likedMovie.id)) {
            user = await User.findByIdAndUpdate(user._id, {
                $pull: {
                    dislikedMovies: likedMovie.id
                }
            }, { new: true });
            count++;
        }
        
        user.likedMovies.push(likedMovie.id);

        likedMovie.genreIds.map(
            genreId => 
                user.genreMap.set(
                    `${genreId}`, 
                    user.genreMap.get(`${genreId}`) + count
                )
        );

        user = await user.save();
        return res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});

router.delete('/likedMovie', requireUser, async (req, res, next) => {
    try {
        let unlikedMovie = req.body.movie;
        let user = req.user;
        if (!user.likedMovies.includes(unlikedMovie.id)) {
            const err = new Error('Movie not liked by user');
            err.statusCode = 400;
            err.errors = { session: "Movie not liked by user" };
            return next(err);
        }
        user = await User.findByIdAndUpdate(user._id, {
            $pull: {
                likedMovies: unlikedMovie.id
            }
        }, { new: true });

        unlikedMovie.genreIds.map(
            genreId => 
                user.genreMap.set(
                    `${genreId}`, 
                    user.genreMap.get(`${genreId}`) - 1
                )
        );

        await user.save();

        return res.json(user);
    }
    catch (err) {
        next(err);
    }
});

router.post('/dislikedMovie', requireUser, async (req, res, next) => {
    try {
        let dislikedMovie = req.body.movie;
        let user = req.user;
        if (user.dislikedMovies.includes(dislikedMovie.id)) {
            const err = new Error('Movie already disliked');
            err.statusCode = 400;
            err.errors = { session: "Movie already disliked" };
            return next(err);
        }

        let count = -1;
        if (user.likedMovies.includes(dislikedMovie.id)) {
            user = await User.findByIdAndUpdate(user._id, {
                $pull: {
                    likedMovies: dislikedMovie.id
                }
            }, { new: true });
            count--;
        }
        
        user.dislikedMovies.push(dislikedMovie.id);

        dislikedMovie.genreIds.map(
            genreId => 
                user.genreMap.set(
                    `${genreId}`, 
                    user.genreMap.get(`${genreId}`) + count
                )
        );

        user = await user.save();
        return res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});

router.delete('/dislikedMovie', requireUser, async (req, res, next) => {
    try {
        let dislikedMovie = req.body.movie;
        let user = req.user;
        if (!user.dislikedMovies.includes(dislikedMovie.id)) {
            const err = new Error('Movie not disliked by user');
            err.statusCode = 400;
            err.errors = { session: "Movie not disliked by user" };
            return next(err);
        }

        user = await User.findByIdAndUpdate(user._id, {
            $pull: {
                dislikedMovies: dislikedMovie.id
            }
        }, { new: true });

        dislikedMovie.genreIds.map(
            genreId => 
                user.genreMap.set(
                    `${genreId}`, 
                    user.genreMap.get(`${genreId}`) + 1
                )
        );

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

        user.hasProfilePic = true;
        await user.save();
        
        const userInfo = await getUserInfo(user);

        return res.status(200).json(userInfo);
    }
    catch (err) {
        next(err);
    };
})

export default router;