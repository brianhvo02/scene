import mongoose from 'mongoose';
import { mongoURI as db } from './config';
import User from './models/User';
import Movie from './models/Movie';
import Comment from './models/Comment';
import Event from './models/Event';
import Rating from './models/Rating';
import bcrypt, { hashSync } from 'bcryptjs'
import { faker } from '@faker-js/faker';

const NUM_SEED_USERS = 10; //done
const NUM_SEED_MOVIE = 10; //done
const NUM_SEED_EVENTS = 20; //done
const NUM_SEED_COMMENTS = 30;  //done
const NUM_SEED_RATING = 30; //done

const genres = [878, 12, 28, 80, 53, 10751, 14, 35, 16, 9648, 27, 36]

const users = [];
users.push(
    new User({
        username: 'demo-user',
        email: 'demo-user@appacademy.io',
        hashedPassword: bcrypt.hashSync('password', 10),
        zipCode: 94103,
        genreIds: [12, 80, 54, 10751, 16],
        likedMovies: [1102776, 315162, 640146]
    })
);

for (let i = 1; i < NUM_SEED_USERS; i++){
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userGenreIds = [];

    while(userGenreIds.length < 4){
        const randGenre = genres[Math.floor(Math.random() * genres.length)]
        if(!userGenreIds.includes(randGenre)) userGenreIds.push(randGenre)
    }

    users.push(
        new User({
            username: faker.internet.userName(firstName, lastName),
            email: faker.internet.email(firstName, lastName),
            zipCode: parseInt(faker.address.zipCodeByState("CA")),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            genreIds: userGenreIds,
            likedMovies: []
        })
    )
};

const atwow = new Movie({
    tmdbId: 76600,
    title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    posterPath: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdropPath: "/8rpDcsfLJypbO6vREc0547VKqEv.jpg",
    alternativeTitles: [
        "Avatar 2"
    ],
    runtime: 192,
    tagline: "Return to Pandora.",
    certification: "PG-13",
    genreIds: [
        878,
        12,
        28
    ],
    ratings: [],
    comments: [],
    events: []
});

const pibtlw = new Movie({
    tmdbId: 315162,
    title: "Puss in Boots: The Last Wish",
    overview: "Puss in Boots discovers that his passion for adventure has taken its toll: He has burned through eight of his nine lives, leaving him with only one life left. Puss sets out on an epic journey to find the mythical Last Wish and restore his nine lives.",
    posterPath: "/kuf6dutpsT0vSVehic3EZIqkOBt.jpg",
    backdropPath: "/jr8tSoJGj33XLgFBy6lmZhpGQNu.jpg",
    alternativeTitles: [
        "Puss in Boots 2: Nine Lives & 40 Thieves"
    ],
    runtime: 103,
    tagline: "Say hola to his little friends.",
    certification: "PG",
    genreIds: [
        16,
        10751,
        14,
        12,
        35,
        18
    ],
    ratings: [],
    comments: [],
    events: []
});

const ppw = new Movie({
    tmdbId: 420808,
    title: "Peter Pan & Wendy",
    overview: "Wendy Darling, a young girl afraid to leave her childhood home behind, meets Peter Pan, a boy who refuses to grow up. Alongside her brothers and a tiny fairy, Tinker Bell, she travels with Peter to the magical world of Neverland. There, she encounters an evil pirate captain, Captain Hook, and embarks on a thrilling adventure that will change her life forever.",
    posterPath: "/9NXAlFEE7WDssbXSMgdacsUD58Y.jpg",
    backdropPath: "/8HfjrSxfTVKmjNh8cJjbu5eXzcX.jpg",
    alternativeTitles: [
        "Peter Pan and Wendy",
        "Peter Pan Wendy"
    ],
    runtime: 106,
    tagline: "Escape to Neverland",
    certification: "PG",
    genreIds: [
        10751,
        14,
        28,
        12
    ],
    ratings: [],
    comments: [],
    events: []
});

const gogv3 = new Movie({
    tmdbId: 447365,
    title: "Guardians of the Galaxy Volume 3",
    overview: "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
    posterPath: "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    backdropPath: "/A7JQ7MIV5fkIxceI5hizRIe6DRJ.jpg",
    alternativeTitles: [
        "Guardians of the Galaxy Vol. 3",
        "Marvel Studios' Guardians of the Galaxy Volume 3",
        "Marvel Studios' Guardians of the Galaxy Vol. 3",
        "GOTG 3"
    ],
    runtime: 150,
    tagline: "Once more with feeling.",
    certification: "PG-13",
    genreIds: [
        878,
        12,
        28
    ],
    ratings: [],
    comments: [],
    events: []
});

const ddhat = new Movie({
    tmdbId: 493529,
    title: "Dungeons & Dragons: Honor Among Thieves",
    overview: "A charming thief and a band of unlikely adventurers undertake an epic heist to retrieve a lost relic, but things go dangerously awry when they run afoul of the wrong people.",
    posterPath: "/v7UF7ypAqjsFZFdjksjQ7IUpXdn.jpg",
    backdropPath: "/20uHjZ4yCPD2x0ndcxZaxM7hLIy.jpg",
    alternativeTitles: [
        "Dungeons and Dragons: Honor Among Thieves"
    ],
    runtime: 134,
    tagline: "No experience necessary.",
    certification: "PG-13",
    genreIds: [
        12,
        14,
        35
    ],
    ratings: [],
    comments: [],
    events: []
});

const tsmbm = new Movie({
    tmdbId: 502356,
    title: "The Super Mario Bros. Movie",
    overview: "While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe and wander into a magical new world. But when the brothers are separated, Mario embarks on an epic quest to find Luigi.",
    posterPath: "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
    backdropPath: "/iJQIbOPm81fPEGKt5BPuZmfnA54.jpg",
    genreIds: [
        16,
        12,
        10751,
        14,
        35
    ],
    ratings: [],
    comments: [],
    events: [],
    alternativeTitles: [],
    tagline: "It's a me a Mario",
    runtime: 92,
    certification: "PG"
});

const sfotg = new Movie({
    tmdbId: 594767,
    title: "Shazam! Fury of the Gods",
    overview: "Billy Batson and his foster siblings, who transform into superheroes by saying \"Shazam!\", are forced to get back into action and fight the Daughters of Atlas, who they must stop from using a weapon that could destroy the world.",
    posterPath: "/2VK4d3mqqTc7LVZLnLPeRiPaJ71.jpg",
    backdropPath: "/nDxJJyA5giRhXx96q1sWbOUjMBI.jpg",
    genreIds: [
        28,
        35,
        14,
        12
    ],
    ratings: [],
    comments: [],
    events: [],
    alternativeTitles: [
        "Shazam: Fury of the Gods"
    ],
    runtime: 130,
    tagline: "Oh. My. Gods.",
    certification: "PG-13"
});

const cb = new Movie({
    tmdbId: 804150,
    title: "Cocaine Bear",
    overview: "Inspired by a true story, an oddball group of cops, criminals, tourists and teens converge in a Georgia forest where a 500-pound black bear goes on a murderous rampage after unintentionally ingesting cocaine.",
    posterPath: "/gOnmaxHo0412UVr1QM5Nekv1xPi.jpg",
    backdropPath: "/a2tys4sD7xzVaogPntGsT1ypVoT.jpg",
    alternativeTitles: [],
    runtime: 96,
    tagline: "Get in line.",
    certification: "R",
    genreIds: [
        53,
        35,
        80
    ],
    ratings: [],
    comments: [],
    events: []
})

const c3 = new Movie({
    tmdbId: 677179,
    title: "Creed III",
    overview: "After dominating the boxing world, Adonis Creed has been thriving in both his career and family life. When a childhood friend and former boxing prodigy, Damian Anderson, resurfaces after serving a long sentence in prison, he is eager to prove that he deserves his shot in the ring. The face-off between former friends is more than just a fight. To settle the score, Adonis must put his future on the line to battle Damian — a fighter who has nothing to lose.",
    posterPath: "/cvsXj3I9Q2iyyIo95AecSd1tad7.jpg",
    backdropPath: "/5i6SjyDbDWqyun8klUuCxrlFbyw.jpg",
    alternativeTitles: [
        "Creed 3"
    ],
    runtime: 116,
    tagline: "You can't run from your past.",
    certification: "PG-13",
    genreIds: [
        18,
        28
    ],
    ratings: [],
    comments: [],
    events: []
})

const atwq = new Movie({
    tmdbId: 640146,
    title: "Ant-Man and the Wasp: Quantumania",
    overview: "Super-Hero partners Scott Lang and Hope van Dyne, along with with Hope's parents Janet van Dyne and Hank Pym, and Scott's daughter Cassie Lang, find themselves exploring the Quantum Realm, interacting with strange new creatures and embarking on an adventure that will push them beyond the limits of what they thought possible.",
    posterPath: "/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg",
    backdropPath: "/3CxUndGhUcZdt1Zggjdb2HkLLQX.jpg",
    alternativeTitles: [
        "Ant-Man 3",
        "Marvel Studios’ Ant-Man and The Wasp: Quantumania",
        "Ant Man and the Wasp: Quantumania"
    ],
    runtime: 125,
    tagline: "Witness the beginning of a new dynasty.",
    certification: "PG-13",
    genreIds: [
        28,
        12,
        878
    ],
    ratings: [],
    comments: [],
    events: []
})

const movies = [atwow, pibtlw, ppw, gogv3, ddhat, tsmbm, sfotg, cb, c3, atwq]

const events = []

for(let i = 0; i < NUM_SEED_EVENTS; i++){
    const attendees = []
    const host = users[Math.floor(Math.random() * NUM_SEED_USERS)]

    while (attendees.length < 4){
        const attendee = users[Math.floor(Math.random() * NUM_SEED_USERS)];
        if(attendee !== host) attendees.push(attendee);
    }

    events.push(
        new Event({
            title: faker.hacker.adjective(),
            body: faker.hacker.phrase(),
            date: faker.date.future(),
            ticketUrl: faker.internet.url(),
            host: host,
            attendees: attendees
        })
    )
}

const commentsArr = []

for(let i = 0; i < NUM_SEED_COMMENTS; i++){
    commentsArr.push(
        new Comment({
            user: users[Math.floor(Math.random() * NUM_SEED_USERS)],
            body: faker.random.words(),
            childrenComment: []
        })
    )
}

const ratingsArr = []

for(let i = 0; i < NUM_SEED_RATING; i++){
    ratingsArr.push(
        new Rating({
            rating: Math.floor(Math.random() * 5),
            rater: users[Math.floor(Math.random() * NUM_SEED_USERS)]
        })
    )
}

movies.forEach((movie) => {

    for(let i = 0; i < 3; i++){
        movie.comments.push(commentsArr[Math.floor(Math.random() * commentsArr.length)])
        movie.ratings.push(ratingsArr[Math.floor(Math.random() * ratingsArr.length)])
    }
})


mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB successfully');
        insertSeeds();
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });

const insertSeeds = () => {
    console.log("Resetting db and seeding...");
    
    User.collection.drop()
                    .then(() => Movie.collection.drop())
                    .then(() => Comment.collection.drop())
                    .then(() => Rating.collection.drop())
                    .then(() => Event.collection.drop())
                    .then(() => User.insertMany(users))
                    .then(() => Movie.insertMany(movies))
                    .then(() => Comment.insertMany(commentsArr))
                    .then(() => Rating.insertMany(ratingsArr))
                    .then(() => Event.insertMany(events))
                    .then(() => {
                        console.log("Done!");
                        mongoose.disconnect();
                    })
                    .catch(err => {
                        console.error(err.stack);
                        process.exit(1);
                    })
    }