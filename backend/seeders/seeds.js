import mongoose from 'mongoose';
import { mongoURI } from '../src/config';
import User from '../src/models/User';
import Movie from '../src/models/Movie';
import Comment from '../src/models/Comment';
import Event from '../src/models/Event';
import Rating from '../src/models/Rating';
import bcrypt, { hashSync } from 'bcryptjs'
import { faker } from '@faker-js/faker';

const NUM_SEED_USERS = 10;
const NUM_SEED_MOVIE = 20;
const NUM_SEED_COMMENTS = 20;
const NUM_SEED_EVENTS = 20;
const NUM_SEED_RATING = 30;

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



const users = [];

users.push(
    new User({
        username: 'demo-user',
        email: 'demo-user@appacademy.io',
        hashedPassword: bcrypt.hashSync('starwars', 10)
    })
);

for (let i = 1; i < NUM_SEED_USERS; i++){
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    users.push(
        new User({
            username: faker.internet.userName(firstName, lastName),
            email: faker.internet.email(firstName, lastName),
            hashedPassword: bcrypt(hashSync(faker.internet.password(), 10))
        })
    )
};

const atwow = new Movie({
    tmdbId: 76600,
    title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    posterPath: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdropPath: "/8rpDcsfLJypbO6vREc0547VKqEv.jpg",
    genreIds: [
                878,
                12,
                28
            ]
});

const pibtlw = new Movie({
    tmdbId: 315162,
    title: "Puss in Boots: The Last Wish",
    overview: "Puss in Boots discovers that his passion for adventure has taken its toll: He has burned through eight of his nine lives, leaving him with only one life left. Puss sets out on an epic journey to find the mythical Last Wish and restore his nine lives.",
    posterPath: "/kuf6dutpsT0vSVehic3EZIqkOBt.jpg",
    backdropPath: "/jr8tSoJGj33XLgFBy6lmZhpGQNu.jpg",
    genreIds: [
        16,
        10751,
        14,
        12,
        35,
        18
    ]
});

const ppw = new User({
    tmdbId: 420808,
    title: "Peter Pan & Wendy",
    overview: "Wendy Darling, a young girl afraid to leave her childhood home behind, meets Peter Pan, a boy who refuses to grow up. Alongside her brothers and a tiny fairy, Tinker Bell, she travels with Peter to the magical world of Neverland. There, she encounters an evil pirate captain, Captain Hook, and embarks on a thrilling adventure that will change her life forever.",
    posterPath: "/9NXAlFEE7WDssbXSMgdacsUD58Y.jpg",
    backdropPath: "/8HfjrSxfTVKmjNh8cJjbu5eXzcX.jpg",
    genreIds: [
        10751,
        14,
        28,
        12
    ]
});

const gogv3 = new Movie({
    tmdbId: 447365,
    title: "Guardians of the Galaxy Volume 3",
    overview: "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
    posterPath: "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    backdropPath: "/A7JQ7MIV5fkIxceI5hizRIe6DRJ.jpg",
    genreIds: [
        878,
        12,
        28
    ]
});

const ddhat = new Movie({
    tmdbId: 493529,
    title: "Dungeons & Dragons: Honor Among Thieves",
    overview: "A charming thief and a band of unlikely adventurers undertake an epic heist to retrieve a lost relic, but things go dangerously awry when they run afoul of the wrong people.",
    posterPath: "/v7UF7ypAqjsFZFdjksjQ7IUpXdn.jpg",
    backdropPath: "/cWDWUkIR22FSlxokhaNrT6jqX3n.jpg",
    genreIds: [
        12,
        14,
        35
    ]
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
    ]
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
    ]
});
