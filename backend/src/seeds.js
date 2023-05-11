import mongoose from 'mongoose';
import { mongoURI as db } from './config';
import User from './models/User';
import Movie from './models/Movie';
import Comment from './models/Comment';
import Event from './models/Event';
import Rating from './models/Rating';
import bcrypt, { hashSync } from 'bcryptjs'
import { faker } from '@faker-js/faker';
import { fetchTMDB } from './routes/tmdb';
import { extractAllowedParams } from './utils';

const NUM_SEED_USERS = 10; //done
const NUM_SEED_MOVIE = 10; //done
const NUM_SEED_EVENTS = 20; //done
const NUM_SEED_COMMENTS = 30;  //done
const NUM_SEED_RATING = 30; //done

const genres = [878, 12, 28, 80, 53, 10751, 14, 35, 16, 9648, 27, 36];

(async () => {
    const users = Array.from(Array(NUM_SEED_USERS).keys()).map(i => {
        if (i === 0) return new User({
            username: 'DemoUser',
            email: 'DemoUser@appacademy.io',
            hashedPassword: bcrypt.hashSync('password', 10),
            zipCode: 94103,
            genreIds: [12, 80, 54, 10751, 16],
            likedMovies: [1102776, 315162, 640146]
        });

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const genreIds = [];

        while(genreIds.length < 4){
            const randGenre = genres[Math.floor(Math.random() * genres.length)]
            if(!genreIds.includes(randGenre)) genreIds.push(randGenre)
        }

        return new User({
            username: faker.internet.userName(firstName, lastName),
            email: faker.internet.email(firstName, lastName),
            zipCode: parseInt(faker.address.zipCodeByState("CA")),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            genreIds,
            likedMovies: []
        });
    });

    const movieIds = [76600, 315162, 420808, 447365, 493529, 502356, 594767, 804150, 677179, 640146];
    const movies = await Promise.all(movieIds.map(async movieId => {
        const allowedParams = ["tmdb_id", "title", "overview", "poster_path", "backdrop_path", "genre_ids", "alternative_titles", "runtime", "tagline", "certification"];
        const movieRes = await fetchTMDB(`/movie/${movieId}`, 'append_to_response=alternative_titles,release_dates');
        movieRes.tmdb_id = movieRes.id;
        movieRes.genre_ids = movieRes.genres.map(genre => genre.id);
        movieRes.certification = movieRes.release_dates.results
            .find(result => result['iso_3166_1'] === 'US').release_dates
            .map(({ certification }) => certification)
            .find(cert => cert.length > 0);
        movieRes.alternative_titles = movieRes.alternative_titles.titles
            .filter(title => title['iso_3166_1'] === 'US')
            .map(({ title }) => title);
        return new Movie(extractAllowedParams(allowedParams, movieRes));
    }));

    const events = Array.from(Array(NUM_SEED_EVENTS).keys()).map(() => {
        const attendees = []
        const host = users[Math.floor(Math.random() * NUM_SEED_USERS)]
    
        while (attendees.length < 4){
            const attendee = users[Math.floor(Math.random() * NUM_SEED_USERS)];
            if(attendee !== host) attendees.push(attendee);
        }
    
        return new Event({
            title: faker.hacker.adjective(),
            body: faker.hacker.phrase(),
            date: faker.date.future(),
            ticketUrl: 'https://www.fandango.com/century-san-francisco-centre-9-and-xd-aaudv/theater-page',
            ticketType: 'Standard',
            amenities: [
                'Reserved seating',
                'Luxury Lounger Recliners'
            ],
            theater: 'Century San Francisco Centre 9 and XD',
            address: '845 Market Street, San Francisco, CA 94103',
            coordinates: {
                latitude: 37.78401353523759,
                longitude: -122.4055097368778,
            },
            host: host,
            attendees: attendees
        });
    });

    const comments = [];

    const createChildComment = (parent, level) => {
        if (Math.random() > 0.5 || level === 5) return;

        const child = new Comment({
            author: users[Math.floor(Math.random() * NUM_SEED_USERS)],
            body: faker.random.words(),
            childrenComment: []
        });
        createChildComment(child, level + 1);
        parent.childrenComments.push(child)
        createChildComment(parent, level);
        comments.push(child);
    }

    const rootComments = Array.from(Array(NUM_SEED_COMMENTS).keys()).map(() => {
        const root = new Comment({
            author: users[Math.floor(Math.random() * NUM_SEED_USERS)],
            body: faker.random.words(),
            childrenComment: []
        });
        createChildComment(root, 0);
        comments.push(root);
        return root;
    });

    const ratings = Array.from(Array(NUM_SEED_RATING).keys()).map(() => 
        new Rating({
            rating: Math.floor(Math.random() * 5),
            rater: users[Math.floor(Math.random() * NUM_SEED_USERS)]
        })
    );

    const ratingsClone = [...ratings];
    const commentsClone = [...rootComments];

    movies.forEach((movie) => {
        for (let i = 0; i < 3; i++){
            movie.comments.push(commentsClone.shift());
            movie.ratings.push(ratingsClone.shift());
        }
    });

    try {
        await mongoose.connect(db, { useNewUrlParser: true });
         
        console.log('Connected to MongoDB successfully');
        console.log("Resetting db and seeding...");

        await User.collection.drop();
        await Movie.collection.drop();
        await Comment.collection.drop();
        await Rating.collection.drop();
        await Event.collection.drop();
        await User.insertMany(users);
        await Movie.insertMany(movies);
        await Comment.insertMany(comments);
        await Rating.insertMany(ratings);
        
        await Event.insertMany(events);
        console.log("Done!");
        mongoose.disconnect();
    } catch (err) {
        console.error(err.stack);
        process.exit(1);
    }
})();

