import { Router } from 'express';
const router = Router();

import bcrypt from "bcryptjs";
import passport from "passport";
import mongoose from 'monogoose';
import { isProduction, loginUser, restoreUser } from '../config';

const User = mongoose.model('User');

// import validateRegisterInput from '../../validations/register';
// import validateLoginInput from '../../validations/login';

router.get('/', (req, res, next) => {
    res.json({
        message:"GET /api/users"
    });
});

router.post('/register', validateReisterInput, async (req, res, next) => {
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
        genres: req.body.genres
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
})

router.post('/login', validateLoginInput, async (req, res, next) => {
    passport.authenticate('local', async function (err, user) {
        if (err) return next(err);
        if (!user) {
            const err = new Error('Invalid credentials');
            err.statusCode = 400;
            err.errors = { email: "Invalid credentials" };
            return next(err);
        }
        return res.json(await loginUser(user));
    })(req, res, next);
});

router.get('/current', restoreUser, (req, res) => {
    if (!isProduction) {
        const csrfToken = req.csrfToken();
        res.cookie("CSRF-TOKEN", csrfToken);
    }
    if (!req.user) return res.json(null);
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    });
});




