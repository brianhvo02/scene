import { config }from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { async } from '../dist/config';

const client = new S3Client({region: "us-west-1"});

config();
export const 
    secret = process.env.SECRET,
    mongoURI = process.env.MONGO_URI,
    isProduction = process.env.NODE_ENV === 'production',
    tmdbAPIKey = process.env.TMDB_API_KEY,
    bardAPIKey = process.env.BARD_API_KEY;

passport.use(new LocalStrategy({
    session: false,
    usernameField: 'credential',
    passwordField: 'password',
}, async function (credential, password, done) {
    const user = await User.findOne({
        $or: [ { email: credential }, { username: credential } ]
    });
    if (user) {
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
            if (err || !isMatch) return done(null, false);
            return done(null, user);
        });
    } else done(null, false);
}));

export const loginUser = async user => {
    await user.populate('events');
    const command = new GetObjectCommand({
        Bucket: "scene-dev",
        Key: `${user.username}.jpg`
    });
    const userInfo = {
        _id: user._id,
        username: user.username,
        email: user.email,
        genreIds: user.genreIds,
        likedMovies: user.likedMovies,
        events: user.events,
        coordinates: user.coordinates,
        photoUrl: user.hasProfilePic ? await getSignedUrl(client, command, {expiresIn: 3600}) : null
    };
    const token = await new Promise((resolve, reject) => jwt.sign(
        userInfo,
        secret,
        { expiresIn: 3600 },
        (err, token) => err ? reject(err) : resolve(token)
    ));
    return {
        user: userInfo,
        token
    };
};

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    ignoreExpiration: !isProduction
}, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id)
        if (user) return done(null, user);
        return done(null, false);
    }
    catch(err) {
        done(err);
    }
}));

export const requireUser = passport.authenticate('jwt', { session: false });

export const restoreUser = async(req, res, next) => {
    return passport.authenticate('jwt', { session: false }, async(err, user) => {
        if (user){
            await user.populate('events');
            req.user = user;
        } 
        next();
    })(req, res, next);
};