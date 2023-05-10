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
        type: String,
        required: true
    },
    posterPath: {
        type: String,
        required: true
    },
    backdropPath: {
        type: String,
        required: true
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
        type: String,
        required: true
    },
    certification: {
        type: String,
        required: true
    },
    genreIds: [{
        type: Number,
        required: true
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: 'Rating',
        
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }],
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }],
}, {
    timestamps: true
});

export default model('Movie', movieSchema);