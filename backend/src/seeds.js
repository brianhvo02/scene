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
import { config } from 'dotenv';
config();

const NUM_SEED_USERS = 10; //done
const NUM_SEED_MOVIE = 10; //done
const NUM_SEED_EVENTS = 30; //done
const NUM_SEED_COMMENTS = 30;  //done
const NUM_SEED_RATING = 30; //done

(async () => {
    const eventNames = [
        "The Big Screen Experience",
        "A Night at the Movies",
        "Movie Magic",
        "Cinema Paradiso",
        "The Silver Screen",
        "The Dream Factory",
        "The Magic of Movies",
        "The World of Cinema",
        "The Art of Film",
        "The History of Movies",
        "The Future of Cinema",
        "A Celebration of Movies",
        "A Tribute to Movies",
        "A Night of Classic Movies",
        "A Marathon of Movies",
        "A Festival of Movies",
        "A Retrospective of Movies",
        "A Premiere of a New Movie",
        "A Screening of a Rare Movie",
        "A Q&A with a Movie Director",
        "A Meet and Greet with a Movie Star",
        "A Costume Contest",
        "A Trivia Night",
        "A Movie Trivia Night",
        "A Movie Marathon",
        "A Movie Party",
        "A Movie Night",
        "A Movie Date",
        "A Movie Night with Friends",
        "A Movie Night with Family"
    ];

    const { genres } = await fetchTMDB('/genre/movie/list');

    const users = Array.from(Array(NUM_SEED_USERS).keys()).map(i => {
        const genreIds = [];
        if (i === 0) {
            genreIds.push(12, 80, 53);
            const user = new User({
                username: 'DemoUser',
                email: 'DemoUser@appacademy.io',
                hashedPassword: bcrypt.hashSync('password', 10),
                zipCode: 94103,
                genreMap: new Map()
            });

            genres.forEach(genre => user.genreMap.set(`${genre.id}`, genreIds.includes(genre.id) ? 5 : 0));

            return user;
        }

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        while(genreIds.length < 4){
            const randGenre = genres[Math.floor(Math.random() * genres.length)]
            if(!genreIds.includes(randGenre)) genreIds.push(randGenre)
        }

        const user = new User({
            username: faker.internet.userName(firstName, lastName),
            email: faker.internet.email(firstName, lastName),
            zipCode: parseInt(faker.address.zipCodeByState("CA")),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            genreMap: new Map()
        });

        genres.forEach(genre => user.genreMap.set(`${genre.id}`, genreIds.includes(genre.id) ? 5 : 0));

        return user;
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

    const events = Array.from(Array(NUM_SEED_EVENTS).keys()).map(i => {
        const attendees = []
        const host = users[Math.floor(Math.random() * NUM_SEED_USERS)]
        
        while (attendees.length < 4){
            const attendee = users[Math.floor(Math.random() * NUM_SEED_USERS)];
            if(attendee !== host) attendees.push(attendee);
        }
        const movie = movies[i % movies.length];
        const event = new Event({
            title: eventNames.shift(),
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
            movie,
            host: host,
            attendees: attendees
        });
        movie.events.push(event);
        host.events.push(event);
        return event;
    });

    const comments = [];

    const createChildComment = (parent, level) => {
        if (Math.random() > 0.5 || level === 5) return;

        const child = new Comment({
            author: users[Math.floor(Math.random() * NUM_SEED_USERS)],
            body: faker.commerce.productDescription(),
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
            body: faker.commerce.productDescription(),
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

