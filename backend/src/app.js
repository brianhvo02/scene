import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import debug from 'debug';
import cors from 'cors';
import csurf from 'csurf';
import passport from 'passport';
import path from 'path';
import http from 'http';
import mongoose from 'mongoose';

import csrfRouter from './routes/csrf';
import tmdbRouter from './routes/tmdb';
import { isProduction, mongoURI as db } from './config';

const app = express();
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

if (!isProduction) {
    app.use(cors());
}

app.use(
    csurf({
        cookie: {
        secure: isProduction,
        sameSite: isProduction && 'Lax',
        httpOnly: true
        }
    })
);

app.use('/api/csrf', csrfRouter);
app.use('/api/tmdb', tmdbRouter);

if (isProduction) {
    app.get('/', (req, res) => {
        res.cookie('CSRF-TOKEN', req.csrfToken());
        res.sendFile(
        path.resolve(__dirname, '../frontend', 'build', 'index.html')
        );
    });

    app.use(express.static(path.resolve('../frontend/build')));

    app.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('CSRF-TOKEN', req.csrfToken());
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'build', 'index.html')
        );
    });
}

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

const serverErrorLogger = debug('backend:error');
app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    });
});

const serverLogger = debug('backend:server');
const dbLogger = debug('backend:mongodb');

const port = process.env.PORT || 5000;
app.set('port', port);
const server = http.createServer(app);

const onError = error => {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

const onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    serverLogger('Listening on ' + bind);
}

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        dbLogger('Connected to MongoDB successfully');
        server.listen(port);
    })
    .catch(err => serverLogger(err));

server.on('error', onError);
server.on('listening', onListening);
