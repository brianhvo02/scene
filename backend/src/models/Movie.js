import { model, Schema } from "mongoose";

const movieSchema = new Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String
    },
    posterPath: {
        type: String
    },
    backdropPath: {
        type: String
    },
    alternativeTitles: [{
        type: String,
        required: true
    }],
    runtime: {
        type: Number,
        required: true
    },
    tagline: {
        type: String
    },
    certification: {
        type: String
    },
    genreIds: [{
        type: Number
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
}, {
    timestamps: true
});

export default model('Movie', movieSchema);

